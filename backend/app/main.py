from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router

app = FastAPI(
    title="AI Lead Magnet Builder",
    description="Generate high-converting marketing lead magnets using AI",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "https://magnetai.onrender.com"],  # Tighten this in production to your Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
@app.get("/")
def root():
    return {"message": "MagnetAI API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}