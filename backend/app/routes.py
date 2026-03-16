from fastapi import APIRouter, HTTPException
from app.schemas import LeadMagnetRequest, LeadMagnetResponse, PosterRequest, PosterResponse, CampaignRequest, CampaignResponse
from app.ai_service import generate_lead_magnet, generate_poster_content, generate_social_campaign
from .schemas import LandingPageRequest, LandingPageResponse
from .services.landing_page_service import generate_landing_page as _generate_landing_page
router = APIRouter()


@router.get("/health", tags=["Health"])
async def health_check():
    """Returns server health status."""
    return {"status": "ok"}


@router.post("/generate", response_model=LeadMagnetResponse, tags=["Lead Magnet"])
async def generate(request: LeadMagnetRequest):
    """
    Generate a high-converting lead magnet using AI.

    Provide your business details and receive a complete lead magnet package
    including headline, description, CTA, email template, and content outline.
    """
    try:
        result = await generate_lead_magnet(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")


# ── Poster Generator ───────────────────────────────────────────────────────────

@router.post(
    "/generate-poster",
    response_model=PosterResponse,
    tags=["Poster Generator"],
    summary="Convert lead magnet text into poster-ready structured data",
)
async def generate_poster(request: PosterRequest):
    """
    Accept lead magnet text and return structured poster configuration data.

    The backend optionally calls the LLM to:
    - Shorten the headline to ≤ 8 words when the input exceeds 10 words.
    - Improve CTA clarity when the input exceeds 6 words.

    When the input is already concise the LLM is skipped entirely (fast path).
    The frontend is responsible for rendering the returned data as a visual poster.
    """
    try:
        result = await generate_poster_content(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Poster generation failed: {str(e)}")
    

# ── Social Media Campaign Generator ───────────────────────────────────────────

from app.schemas import CampaignRequest, CampaignResponse
from app.ai_service import generate_social_campaign


@router.post(
    "/generate-campaign",
    response_model=CampaignResponse,
    tags=["Social Media Campaign"],
    summary="Generate a full multi-platform social media campaign from lead magnet content",
)
async def generate_campaign(request: CampaignRequest):
    """
    Accepts lead magnet content and returns a complete marketing campaign including:
    - LinkedIn post
    - Twitter/X thread (5 tweets)
    - Instagram caption with hashtags
    - Email newsletter (subject + body)
    - 3 CTA variations
    """
    try:
        result = await generate_social_campaign(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Campaign generation failed: {str(e)}")
    
@router.post(
    "/generate-landing-page",
    response_model=LandingPageResponse,
)
async def generate_landing_page_route(
    request: LandingPageRequest,
) -> LandingPageResponse:
    return await _generate_landing_page(request)