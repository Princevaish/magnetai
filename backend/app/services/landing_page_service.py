# ═══════════════════════════════════════════════════════════════
# MagnetAI — services/landing_page_service.py
#
# Handles landing page generation:
#   • builds prompt via landing_page_prompt.py
#   • calls Groq API (same model as the rest of the project)
#   • parses the labeled LLM response into structured fields
#   • returns a LandingPageResponse schema instance
#
# Deliberately isolated from ai_service.py so existing features
# are never at risk of breakage.
# ═══════════════════════════════════════════════════════════════

from __future__ import annotations

import logging
import os
import re
from typing import Any

from groq import AsyncGroq

from ..schemas import FAQ, LandingPageRequest, LandingPageResponse
from ..prompts.landing_page_prompt import build_landing_page_prompt

logger = logging.getLogger(__name__)

# ── Model — same as the rest of MagnetAI ──────────────────────
_MODEL = "llama-3.3-70b-versatile"

# ── Groq API key — read from environment, same pattern as ai_service.py.
# We do NOT import from config.py because config.py does not expose a
# `settings` object; it exposes the key directly (or not at all).
# Reading from os.environ here is identical to what ai_service.py does.
_GROQ_API_KEY: str = os.environ.get("GROQ_API_KEY", "")

# ── Groq client (lazy singleton) ──────────────────────────────
_client: AsyncGroq | None = None


def _get_client() -> AsyncGroq:
    global _client
    if _client is None:
        if not _GROQ_API_KEY:
            raise RuntimeError(
                "GROQ_API_KEY environment variable is not set. "
                "Add it to your .env file or shell environment."
            )
        _client = AsyncGroq(api_key=_GROQ_API_KEY)
    return _client


# ══════════════════════════════════════════════════════════════
# PUBLIC ENTRY POINT
# ══════════════════════════════════════════════════════════════

async def generate_landing_page(req: LandingPageRequest) -> LandingPageResponse:
    """
    Generate a full landing-page structure from the supplied
    lead-magnet fields.  Calls the LLM, parses the response,
    and returns a validated LandingPageResponse.
    """
    prompt = build_landing_page_prompt(
        headline=req.headline,
        description=req.description,
        cta=req.cta,
        audience=req.audience,
        tone=req.tone,
    )

    raw_text = await _call_llm(prompt)
    logger.debug("[LandingPageService] raw LLM response:\n%s", raw_text)

    parsed = _parse_landing_page_response(raw_text)

    # Theme comes straight from the request — LLM does not pick it.
    parsed["theme"] = req.theme

    return LandingPageResponse(**parsed)


# ══════════════════════════════════════════════════════════════
# LLM CALL
# ══════════════════════════════════════════════════════════════

async def _call_llm(prompt: str) -> str:
    """Send the prompt to Groq and return the raw text response."""
    client = _get_client()

    completion = await client.chat.completions.create(
        model=_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert marketing copywriter. "
                    "Follow the output format instructions exactly. "
                    "Produce only the labeled sections — no preamble, "
                    "no explanation, no markdown beyond the ### labels."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.75,
        max_tokens=2048,
    )

    return completion.choices[0].message.content or ""


# ══════════════════════════════════════════════════════════════
# RESPONSE PARSER
# ══════════════════════════════════════════════════════════════

def _extract_section(text: str, label: str) -> str:
    """
    Extract the text block that follows '### LABEL' up to the
    next '### ' heading or end of string.

    Returns an empty string if the section is not found.
    """
    pattern = rf"###\s*{re.escape(label)}\s*\n(.*?)(?=###\s|\Z)"
    match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
    if not match:
        return ""
    return match.group(1).strip()


def _parse_benefits(raw: str) -> list[str]:
    """
    Parse the BENEFITS block.

    Expected format:
        1. Title: Explanation
        2. Title: Explanation
        3. Title: Explanation

    Falls back to splitting on newlines if numbered format not found.
    Returns exactly 3 items, padding with fallbacks if necessary.
    """
    lines = [ln.strip() for ln in raw.splitlines() if ln.strip()]

    # Strip leading "1. " / "2. " / "3. " numbering
    numbered = re.compile(r"^\d+\.\s*")
    items = [numbered.sub("", ln) for ln in lines if ln]

    # Pad to 3 if the LLM returned fewer
    while len(items) < 3:
        items.append("Discover the difference our solution makes.")

    return items[:3]


def _parse_testimonials(raw: str) -> list[str]:
    """
    Parse the TESTIMONIALS block.

    Expected format:
        1. "Quote" — Name, Title
        2. "Quote" — Name, Title

    Returns exactly 2 items.
    """
    lines = [ln.strip() for ln in raw.splitlines() if ln.strip()]
    numbered = re.compile(r"^\d+\.\s*")
    items = [numbered.sub("", ln) for ln in lines if ln]

    while len(items) < 2:
        items.append('"This product changed everything for me." — Happy Customer')

    return items[:2]


def _parse_faq(raw: str) -> list[FAQ]:
    """
    Parse the FAQ block.

    Expected format (repeated 3 times):
        Q: Question text
        A: Answer text

    Returns exactly 3 FAQ objects.
    """
    faqs: list[FAQ] = []

    # Match Q:/A: pairs — handle multi-line answers
    pattern = re.compile(
        r"Q:\s*(.+?)\nA:\s*(.+?)(?=\nQ:|\Z)",
        re.DOTALL | re.IGNORECASE,
    )

    for match in pattern.finditer(raw):
        question = match.group(1).strip()
        answer   = match.group(2).strip()
        # Collapse internal newlines in the answer to a single space
        answer   = re.sub(r"\s+", " ", answer)
        faqs.append(FAQ(question=question, answer=answer))

    # Pad to 3 if necessary
    defaults = [
        FAQ(
            question="How quickly will I see results?",
            answer="Most customers see measurable improvements within the first 30 days.",
        ),
        FAQ(
            question="Is this right for my situation?",
            answer="Our solution is designed for a wide range of needs — contact us to find out.",
        ),
        FAQ(
            question="What support is included?",
            answer="Full onboarding support and ongoing assistance are included at every tier.",
        ),
    ]

    while len(faqs) < 3:
        faqs.append(defaults[len(faqs)])

    return faqs[:3]


def _parse_landing_page_response(text: str) -> dict[str, Any]:
    """
    Orchestrate all section parsers and return a dict that maps
    directly to LandingPageResponse fields (minus 'theme' which
    is injected by the caller).
    """
    return {
        "hero_title":    _extract_section(text, "HERO TITLE")    or "Achieve More, Starting Today",
        "hero_subtitle": _extract_section(text, "HERO SUBTITLE") or "The proven system built for people like you.",
        "cta_text":      _extract_section(text, "CTA TEXT")      or "Get Started Free",
        "benefits":      _parse_benefits(_extract_section(text, "BENEFITS")),
        "testimonials":  _parse_testimonials(_extract_section(text, "TESTIMONIALS")),
        "faq":           _parse_faq(_extract_section(text, "FAQ")),
        "footer_text":   _extract_section(text, "FOOTER")        or "Built to help you succeed.",
    }