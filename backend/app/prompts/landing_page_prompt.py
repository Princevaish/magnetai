# ═══════════════════════════════════════════════════════════════
# MagnetAI — prompts/landing_page_prompt.py
#
# Stores the prompt template for landing page generation.
# Kept separate from the service so the template can be edited,
# versioned, or A/B-tested without touching business logic.
# ═══════════════════════════════════════════════════════════════

LANDING_PAGE_PROMPT_TEMPLATE = """You are an expert marketing copywriter and conversion specialist.

Generate a complete landing page structure for the following product or service.

INPUT:
- Headline: {headline}
- Description: {description}
- Call to Action: {cta}
- Target Audience: {audience}
- Tone: {tone}

INSTRUCTIONS:
Write compelling, conversion-focused copy for each section below.
Match the tone exactly: {tone}
Write specifically for this audience: {audience}
Every section must be complete — do not leave placeholders or ellipses.

OUTPUT FORMAT — follow this exactly, using the ### labels as delimiters:

### HERO TITLE
Write a punchy, benefit-driven headline (max 12 words). Must be more specific and compelling than the input headline.

### HERO SUBTITLE
Write a supporting subheadline that expands on the hero title (max 25 words). Focus on the transformation or outcome.

### CTA TEXT
Write a single, action-oriented CTA button label (max 6 words). Must be more specific than the input CTA.

### BENEFITS
Write exactly 3 benefit statements. Each on its own numbered line.
Format:
1. [Benefit title]: [One-sentence explanation of the value delivered]
2. [Benefit title]: [One-sentence explanation of the value delivered]
3. [Benefit title]: [One-sentence explanation of the value delivered]

### TESTIMONIALS
Write exactly 2 realistic customer testimonials. Each on its own numbered line.
Format:
1. "[Quote of 1-2 sentences]" — [First Name], [Job Title]
2. "[Quote of 1-2 sentences]" — [First Name], [Job Title]

### FAQ
Write exactly 3 frequently asked questions with answers. Use Q:/A: format.
Format:
Q: [Question]
A: [Answer in 1-2 sentences]
Q: [Question]
A: [Answer in 1-2 sentences]
Q: [Question]
A: [Answer in 1-2 sentences]

### FOOTER
Write a single footer tagline (max 15 words). Reinforce the brand promise or CTA.

Produce ONLY the labeled sections above. No preamble, no explanation, no extra text.
"""


def build_landing_page_prompt(
    headline: str,
    description: str,
    cta: str,
    audience: str,
    tone: str,
) -> str:
    """
    Interpolate the template with request values and return the
    fully-formed prompt string ready to send to the LLM.
    """
    return LANDING_PAGE_PROMPT_TEMPLATE.format(
        headline=headline,
        description=description,
        cta=cta,
        audience=audience,
        tone=tone,
    )