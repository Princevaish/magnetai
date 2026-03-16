# ═══════════════════════════════════════════════════════════════
# MagnetAI — schemas.py
# Pydantic request/response models for all API endpoints.
# ═══════════════════════════════════════════════════════════════

from __future__ import annotations

from typing import Literal
from pydantic import BaseModel, Field


# ══════════════════════════════════════════════════════════════
# LEAD MAGNET  (existing — unchanged)
# ══════════════════════════════════════════════════════════════

class LeadMagnetRequest(BaseModel):
    business: str
    industry: str
    audience: str
    goal:     str
    tone:     str


class LeadMagnetResponse(BaseModel):
    lead_magnet:     str
    headline:        str
    description:     str
    cta:             str
    email_template:  str
    content_outline: str


# ══════════════════════════════════════════════════════════════
# POSTER GENERATOR  (existing — unchanged)
# ══════════════════════════════════════════════════════════════

class PosterRequest(BaseModel):
    headline:    str = Field(..., min_length=4, max_length=200)
    description: str = Field(..., min_length=4, max_length=500)
    cta:         str = Field(..., min_length=2, max_length=100)
    template: Literal[
        "startup_neon",
        "minimal_white",
        "gradient_dark",
        "bold_impact",
        "corporate_clean",
    ] = "startup_neon"
    poster_size: Literal[
        "1080x1080",
        "1080x1920",
        "1200x628",
    ] = "1080x1080"


class PosterResponse(BaseModel):
    headline:    str
    subtext:     str
    cta:         str
    template:    str
    poster_size: str


# ══════════════════════════════════════════════════════════════
# SOCIAL MEDIA CAMPAIGN  (existing — unchanged)
# ══════════════════════════════════════════════════════════════

class EmailNewsletter(BaseModel):
    subject: str
    body:    str


class CampaignRequest(BaseModel):
    headline:    str
    description: str
    cta:         str
    audience:    str
    tone:        str


class CampaignResponse(BaseModel):
    linkedin_post:     str
    twitter_thread:    list[str]   # exactly 5 tweets
    instagram_caption: str
    email_newsletter:  EmailNewsletter
    cta_variations:    list[str]   # exactly 3


# ══════════════════════════════════════════════════════════════
# LANDING PAGE GENERATOR  (NEW)
# ══════════════════════════════════════════════════════════════

class FAQ(BaseModel):
    """A single FAQ question + answer pair."""

    question: str = Field(
        ...,
        min_length=5,
        max_length=300,
        description="The frequently asked question.",
    )
    answer: str = Field(
        ...,
        min_length=5,
        max_length=600,
        description="The answer to the question.",
    )


class LandingPageRequest(BaseModel):
    """
    Input for POST /generate-landing-page.

    All five text fields map directly to the user's lead-magnet
    form so the frontend can forward them without transformation.
    """

    headline: str = Field(
        ...,
        min_length=4,
        max_length=200,
        description="Landing page headline (usually the lead-magnet headline).",
    )
    description: str = Field(
        ...,
        min_length=4,
        max_length=500,
        description="Product or lead-magnet description.",
    )
    cta: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Primary call-to-action text.",
    )
    audience: str = Field(
        ...,
        min_length=2,
        max_length=200,
        description="Target audience description.",
    )
    tone: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Desired copy tone (e.g. 'Motivational and energetic').",
    )
    theme: Literal[
        "startup_neon",
        "minimal_white",
        "corporate_clean",
        "gradient_dark",
        "bold_startup",
    ] = Field(
        default="startup_neon",
        description=(
            "Visual theme for the generated landing page. "
            "The backend returns this value unchanged; "
            "the frontend applies the corresponding CSS template."
        ),
    )


class LandingPageResponse(BaseModel):
    """
    Structured output returned by POST /generate-landing-page.

    The frontend converts these fields into a themed HTML file
    and offers it as a download (landing_page.html).
    """

    hero_title: str = Field(
        ...,
        description="Main hero headline — punchy, benefit-driven.",
    )
    hero_subtitle: str = Field(
        ...,
        description="Supporting subheadline that expands on the hero title.",
    )
    cta_text: str = Field(
        ...,
        description="CTA button label.",
    )
    benefits: list[str] = Field(
        ...,
        min_length=3,
        max_length=3,
        description="Exactly 3 benefit statements.",
    )
    testimonials: list[str] = Field(
        ...,
        min_length=2,
        max_length=2,
        description="Exactly 2 customer testimonials.",
    )
    faq: list[FAQ] = Field(
        ...,
        min_length=3,
        max_length=3,
        description="Exactly 3 FAQ items.",
    )
    footer_text: str = Field(
        ...,
        description="Footer tagline reinforcing the brand promise.",
    )
    theme: Literal[
        "startup_neon",
        "minimal_white",
        "corporate_clean",
        "gradient_dark",
        "bold_startup",
    ] = Field(
        ...,
        description="Visual theme echoed back from the request.",
    )

# ═══════════════════════════════════════════════════════════════
# schemas.py — MINIMAL PATCH
#
# Add these three classes to the BOTTOM of your existing schemas.py.
# Do NOT replace the file — just append these classes.
# ═══════════════════════════════════════════════════════════════

from typing import Literal
from pydantic import BaseModel, Field


# ── Paste everything below this line into your schemas.py ──────


class FAQ(BaseModel):
    """A single FAQ question + answer pair."""
    question: str = Field(..., min_length=5, max_length=300)
    answer:   str = Field(..., min_length=5, max_length=600)


class LandingPageRequest(BaseModel):
    headline:    str = Field(..., min_length=4, max_length=200)
    description: str = Field(..., min_length=4, max_length=500)
    cta:         str = Field(..., min_length=2, max_length=100)
    audience:    str = Field(..., min_length=2, max_length=200)
    tone:        str = Field(..., min_length=2, max_length=100)
    theme: Literal[
        "startup_neon",
        "minimal_white",
        "corporate_clean",
        "gradient_dark",
        "bold_startup",
    ] = "startup_neon"


class LandingPageResponse(BaseModel):
    hero_title:    str
    hero_subtitle: str
    cta_text:      str
    benefits:      list[str]   # exactly 3
    testimonials:  list[str]   # exactly 2
    faq:           list[FAQ]   # exactly 3
    footer_text:   str
    theme:         str