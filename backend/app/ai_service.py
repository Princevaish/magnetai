import re
from groq import Groq
from app.config import GROQ_API_KEY
from app.schemas import (
    LeadMagnetRequest,
    LeadMagnetResponse,
    PosterRequest,
    PosterResponse,
    CampaignRequest,
    CampaignResponse,
    EmailNewsletter,
)

client = Groq(api_key=GROQ_API_KEY)

MODEL = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = (
    "You are an expert marketing strategist specializing in lead generation and conversion optimization. "
    "Always respond in the exact structured format requested. Be specific, creative, and compelling."
)


def build_prompt(req: LeadMagnetRequest) -> str:
    return f"""You are an expert marketing strategist.
Generate a high-converting lead magnet for the following business.

Business: {req.business}
Industry: {req.industry}
Target Audience: {req.audience}
Goal: {req.goal}
Tone: {req.tone}

Return ONLY the following 6 sections, each clearly labeled with the exact headers below.
Do not add any preamble, commentary, or extra text outside these sections.

### 1. Lead Magnet Idea
[Your lead magnet idea here]

### 2. Landing Page Headline
[Your headline here]

### 3. Description
[Your description here]

### 4. Call To Action
[Your CTA here]

### 5. Email Follow-Up Template
[Your email template here]

### 6. Content Outline
[Your content outline here]
"""


def parse_response(text: str) -> LeadMagnetResponse:
    """Parse the LLM's structured text response into a LeadMagnetResponse."""

    sections = {
        "lead_magnet": r"###\s*1\.\s*Lead Magnet Idea\s*(.*?)(?=###\s*2\.)",
        "headline": r"###\s*2\.\s*Landing Page Headline\s*(.*?)(?=###\s*3\.)",
        "description": r"###\s*3\.\s*Description\s*(.*?)(?=###\s*4\.)",
        "cta": r"###\s*4\.\s*Call To Action\s*(.*?)(?=###\s*5\.)",
        "email_template": r"###\s*5\.\s*Email Follow-Up Template\s*(.*?)(?=###\s*6\.)",
        "content_outline": r"###\s*6\.\s*Content Outline\s*(.*?)$",
    }

    parsed = {}
    for key, pattern in sections.items():
        match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
        parsed[key] = match.group(1).strip() if match else "N/A"

    return LeadMagnetResponse(**parsed)


async def generate_lead_magnet(req: LeadMagnetRequest) -> LeadMagnetResponse:
    """Call Groq API and return a structured LeadMagnetResponse."""

    prompt = build_prompt(req)

    completion = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        temperature=0.8,
        max_tokens=2048,
    )

    raw_text = completion.choices[0].message.content
    return parse_response(raw_text)


# ── Poster Generator ───────────────────────────────────────────────────────────

_POSTER_ENHANCE_PROMPT = """\
You are a concise marketing copywriter optimizing text for a visual poster.

Given the following poster content, return ONLY the two improved fields below.
Rules:
- Headline must be at most 8 words. Keep the core message. Do NOT add punctuation at the end.
- CTA must be a clear, action-oriented phrase of 2-5 words (e.g. "Get Your Free Guide").
- Do NOT change the subtext.
- Do NOT add commentary or explanation outside the two labeled sections.

### Current Content
Headline : {headline}
CTA      : {cta}

### Output (return exactly these two lines, nothing else)
HEADLINE: <improved headline here>
CTA: <improved CTA here>
"""


def _needs_llm_enhancement(headline: str, cta: str) -> bool:
    """Return True when the headline is too long OR the CTA is vague/long."""
    headline_too_long = len(headline.split()) > 10
    cta_too_long = len(cta.split()) > 6
    return headline_too_long or cta_too_long


def _parse_poster_enhancement(raw: str, fallback_headline: str, fallback_cta: str) -> tuple[str, str]:
    """Extract HEADLINE and CTA from the LLM enhancement response."""
    headline_match = re.search(r"HEADLINE:\s*(.+)", raw, re.IGNORECASE)
    cta_match = re.search(r"CTA:\s*(.+)", raw, re.IGNORECASE)

    headline = headline_match.group(1).strip() if headline_match else fallback_headline
    cta = cta_match.group(1).strip() if cta_match else fallback_cta
    return headline, cta


async def generate_poster_content(req: PosterRequest) -> PosterResponse:
    """
    Format lead magnet text into a structured poster payload.

    Enhancement policy:
    - If headline > 10 words OR CTA > 6 words → call LLM to shorten/improve.
    - Otherwise → return the input values directly (fast path, zero LLM cost).

    The subtext (description) is never LLM-modified; it maps directly to the
    poster's supporting copy field.
    """
    headline = req.headline.strip()
    cta = req.cta.strip()
    subtext = req.description.strip()

    if _needs_llm_enhancement(headline, cta):
        prompt = _POSTER_ENHANCE_PROMPT.format(headline=headline, cta=cta)

        completion = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            temperature=0.5,   # Lower temperature for precise, constrained output
            max_tokens=128,    # We only need two short lines back
        )

        raw = completion.choices[0].message.content
        headline, cta = _parse_poster_enhancement(raw, headline, cta)

    return PosterResponse(
        headline=headline,
        subtext=subtext,
        cta=cta,
        template=req.template,
        poster_size=req.poster_size,
    )

# ── Social Media Campaign Generator ───────────────────────────────────────────

_CAMPAIGN_PROMPT = """\
You are an expert social media marketer and copywriter.
Generate a complete multi-platform marketing campaign based on the lead magnet below.

Headline  : {headline}
Description: {description}
CTA       : {cta}
Audience  : {audience}
Tone      : {tone}

Return ONLY the following sections with the exact headers shown. No preamble or extra commentary.

### 1. LinkedIn Post
[A professional 150-200 word LinkedIn post. Include a hook, value proposition, and the CTA.]

### 2. Twitter Thread
TWEET 1: [Hook tweet — one punchy sentence or question]
TWEET 2: [Problem or pain point]
TWEET 3: [Solution or insight]
TWEET 4: [Social proof or benefit]
TWEET 5: [CTA tweet with link placeholder]

### 3. Instagram Caption
[Engaging caption under 150 words with 5–8 relevant hashtags at the end]

### 4. Email Newsletter
SUBJECT: [Subject line under 10 words]
BODY:
[Email body: greeting, problem, solution, CTA, sign-off. 150-200 words.]

### 5. CTA Variations
CTA 1: [First CTA option]
CTA 2: [Second CTA option]
CTA 3: [Third CTA option]
"""


def _parse_campaign_response(text: str) -> CampaignResponse:
    """Parse the LLM's structured campaign text into a CampaignResponse."""

    # LinkedIn
    linkedin_match = re.search(
        r"###\s*1\.\s*LinkedIn Post\s*(.*?)(?=###\s*2\.)", text, re.DOTALL | re.IGNORECASE
    )
    linkedin_post = linkedin_match.group(1).strip() if linkedin_match else "N/A"

    # Twitter thread — extract all 5 TWEET N: lines
    twitter_block_match = re.search(
        r"###\s*2\.\s*Twitter Thread\s*(.*?)(?=###\s*3\.)", text, re.DOTALL | re.IGNORECASE
    )
    twitter_thread = ["N/A"] * 5
    if twitter_block_match:
        tweets = re.findall(r"TWEET\s*\d+:\s*(.+?)(?=TWEET\s*\d+:|$)", twitter_block_match.group(1), re.DOTALL)
        twitter_thread = [t.strip() for t in tweets[:5]]
        # Pad to 5 if the LLM returned fewer
        while len(twitter_thread) < 5:
            twitter_thread.append("N/A")

    # Instagram
    instagram_match = re.search(
        r"###\s*3\.\s*Instagram Caption\s*(.*?)(?=###\s*4\.)", text, re.DOTALL | re.IGNORECASE
    )
    instagram_caption = instagram_match.group(1).strip() if instagram_match else "N/A"

    # Email newsletter — subject + body
    email_block_match = re.search(
        r"###\s*4\.\s*Email Newsletter\s*(.*?)(?=###\s*5\.)", text, re.DOTALL | re.IGNORECASE
    )
    email_subject = "N/A"
    email_body = "N/A"
    if email_block_match:
        email_block = email_block_match.group(1)
        subject_match = re.search(r"SUBJECT:\s*(.+?)(?=BODY:|$)", email_block, re.DOTALL | re.IGNORECASE)
        body_match = re.search(r"BODY:\s*(.*?)$", email_block, re.DOTALL | re.IGNORECASE)
        email_subject = subject_match.group(1).strip() if subject_match else "N/A"
        email_body = body_match.group(1).strip() if body_match else "N/A"

    # CTA variations — extract all 3 CTA N: lines
    cta_block_match = re.search(
        r"###\s*5\.\s*CTA Variations\s*(.*?)$", text, re.DOTALL | re.IGNORECASE
    )
    cta_variations = ["N/A"] * 3
    if cta_block_match:
        ctas = re.findall(r"CTA\s*\d+:\s*(.+?)(?=CTA\s*\d+:|$)", cta_block_match.group(1), re.DOTALL)
        cta_variations = [c.strip() for c in ctas[:3]]
        while len(cta_variations) < 3:
            cta_variations.append("N/A")

    return CampaignResponse(
        linkedin_post=linkedin_post,
        twitter_thread=twitter_thread,
        instagram_caption=instagram_caption,
        email_newsletter=EmailNewsletter(subject=email_subject, body=email_body),
        cta_variations=cta_variations,
    )


async def generate_social_campaign(req: CampaignRequest) -> CampaignResponse:
    """Call Groq API and return a structured CampaignResponse."""

    prompt = _CAMPAIGN_PROMPT.format(
        headline=req.headline,
        description=req.description,
        cta=req.cta,
        audience=req.audience,
        tone=req.tone,
    )

    completion = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        temperature=0.75,
        max_tokens=2048,
    )

    raw_text = completion.choices[0].message.content
    return _parse_campaign_response(raw_text)