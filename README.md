# 🚀 MagnetAI

<div align="center">

# AI-Powered Marketing Automation Platform

### Transforming business ideas into complete AI-generated marketing systems.

<img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi" />
<img src="https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python" />
<img src="https://img.shields.io/badge/AI-LLaMA%203.3%2070B-purple?style=for-the-badge" />
<img src="https://img.shields.io/badge/Groq-API-orange?style=for-the-badge" />
<img src="https://img.shields.io/badge/JavaScript-Frontend-yellow?style=for-the-badge&logo=javascript" />
<img src="https://img.shields.io/badge/OpenSource-Project-red?style=for-the-badge" />

<br/>
<br/>

> ⚡ AI-powered SaaS platform that automatically generates marketing assets, campaigns, landing pages, and lead magnets using Large Language Models.

</div>

---

# 📌 Overview

MagnetAI is a full-stack AI-powered marketing automation platform designed to help startups, creators, businesses, and coaches generate high-converting marketing assets instantly.

The platform transforms a simple business description into:

✅ Lead Magnets  
✅ Marketing Posters  
✅ Social Media Campaigns  
✅ AI Landing Pages  

MagnetAI acts as an AI growth engine that automates early-stage marketing workflows using advanced Large Language Models.

---

# 🌍 Problem Statement

Most businesses struggle with:

- creating consistent marketing content
- writing high-converting copy
- designing campaigns quickly
- generating landing pages
- scaling content production

Traditional marketing workflows require:
- copywriters
- designers
- marketers
- landing page builders

This process is:
- expensive
- time-consuming
- difficult for startups

MagnetAI solves this by automating marketing generation using AI.

---

# ✨ Core Features

# 1️⃣ AI Lead Magnet Generator

Users provide:
- business description
- industry
- target audience
- marketing goal
- tone

The AI generates:
- lead magnet ideas
- landing page headlines
- CTA copy
- descriptions
- email follow-up sequences
- content outlines

---

# 2️⃣ AI Poster Generator

Transforms generated marketing copy into visually styled posters.

### Features

- Multiple poster templates
- Responsive preview
- PNG export support
- Theme selection
- Optimized poster copy generation

### Rendering Engine

- HTML/CSS templates
- html2canvas export engine

---

# 3️⃣ AI Social Media Campaign Generator

Automatically creates complete multi-platform campaigns.

### Outputs

- LinkedIn posts
- Twitter/X threads
- Instagram captions
- Email newsletters
- CTA variations

Enables instant campaign deployment.

---

# 4️⃣ AI Landing Page Generator

Generates structured landing page content.

### Outputs

- Hero section
- CTA section
- Benefits
- Testimonials
- FAQ
- Footer

### Supported Themes

- startup_neon
- minimal_white
- corporate_clean
- gradient_dark
- bold_startup

Landing pages are downloadable as standalone HTML pages.

---

# 🏗️ System Architecture

```plaintext
                           ┌────────────────────┐
                           │    User Input      │
                           │ Business Details   │
                           └─────────┬──────────┘
                                     │
                                     ▼

                    ┌─────────────────────────────────┐
                    │        FastAPI Backend          │
                    │  Routing + Validation Layer     │
                    └──────────────┬──────────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        ▼                          ▼                          ▼

┌────────────────┐      ┌───────────────────┐      ┌──────────────────┐
│ Lead Magnet AI │      │ Campaign Engine   │      │ Landing Page AI  │
└────────────────┘      └───────────────────┘      └──────────────────┘

                                   │
                                   ▼

                    ┌─────────────────────────────────┐
                    │       Groq API + LLaMA 3.3      │
                    └─────────────────────────────────┘
                                   │
                                   ▼
🎨 UI / Design System

MagnetAI uses a futuristic premium AI SaaS design language inspired by modern startup platforms.

Design Features
Dark neon aesthetic
Glassmorphism interface
Animated gradients
GSAP motion animations
Particle background effects
Responsive layouts
🎨 Primary Colors
Background
#060614
Accent Gradient
linear-gradient(135deg,#00f0ff,#9b6dff)
🧰 Tech Stack
Frontend
Technology	Purpose
HTML5	Structure
CSS3	Styling
Vanilla JavaScript	Frontend logic
GSAP	Animations
html2canvas	Poster export
Glassmorphism UI	Design system
Backend
Technology	Purpose
Python	Backend language
FastAPI	API framework
Pydantic	Validation
Uvicorn	ASGI server
AI / LLM
Technology	Purpose
LLaMA 3.3 70B	Marketing content generation
Groq API	High-speed inference
Authentication
Technology	Purpose
Clerk	User authentication
📁 Frontend Architecture
frontend/
│
├── index.html
│
├── js
│   ├── config.js
│   ├── api.js
│   ├── state.js
│   │
│   ├── features
│   │   ├── lead_magnet.js
│   │   ├── poster_generator.js
│   │   ├── campaign_generator.js
│   │   ├── landing_page_generator.js
│   │
│   ├── ui
│   │   ├── cards.js
│   │   ├── toast.js
│   │   ├── loader.js
│   │
│   └── app.js
│
├── styles
│   ├── base.css
│   ├── components.css
│   ├── animations.css
│   ├── landing_page.css
│
└── animations
    └── gsap.js
⚙️ Backend Architecture
backend/
│
├── app/
│   ├── main.py
│   ├── routes.py
│   ├── schemas.py
│   ├── config.py
│   │
│   ├── services/
│   │   ├── landing_page_service.py
│   │
│   └── prompts/
│       ├── landing_page_prompt.py
│
└── requirements.txt
🔐 Authentication

Authentication is implemented using Clerk.

Features
Email OTP authentication
Session management
Protected routes
Secure user access
Themed authentication UI
🤖 AI Model

MagnetAI uses:

LLaMA 3.3 70B via Groq API
Benefits
Ultra-fast inference
High-quality marketing copy
Low latency generation
Scalable AI architecture
📡 API Example
POST /generate-campaign
Request
{
  "business": "AI Resume Builder",
  "industry": "EdTech",
  "target_audience": "Students",
  "goal": "Generate Leads",
  "tone": "Professional"
}
Response
{
  "headline": "Land Your Dream Job Faster",
  "cta": "Start Building Your AI Resume",
  "linkedin_post": "...",
  "email_sequence": "...",
  "landing_page": {
    "hero": "...",
    "benefits": [...]
  }
}
⚙️ Environment Variables

Create .env

GROQ_API_KEY=your_groq_api_key
▶️ Local Development
Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
Frontend

Use Live Server or any static server.

🚀 Deployment
Frontend

Hosted on:

Vercel
Backend

Hosted on:

Render
📸 Screenshots
Dashboard
[ Add Dashboard Screenshot Here ]
AI Campaign Generator
[ Add Campaign Generator Screenshot Here ]
Landing Page Builder
[ Add Landing Page Screenshot Here ]
🧠 Engineering Highlights
Built scalable modular frontend architecture
Designed service-oriented FastAPI backend
Implemented structured prompt engineering pipeline
Integrated Groq API for high-speed inference
Built animated glassmorphism UI with GSAP
Developed AI-powered marketing automation workflows
Designed reusable AI generation pipelines
🛣️ Future Roadmap

Planned features:

AI Marketing Strategy Engine
AI Website Builder
AI Carousel Generator
Analytics Dashboard
Multi-user Workspaces
AI A/B Testing
Campaign Performance Optimization
SaaS Subscription Billing
Docker Deployment
CI/CD Pipelines
🤝 Contributing

Contributions are welcome.

Steps
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push branch
5. Open Pull Request
📜 License

This project is licensed under the MIT License.

👨‍💻 Author
Prince Vaish

AI Engineer • Backend Developer • SaaS Builder

GitHub: https://github.com/yourusername
LinkedIn: https://linkedin.com/in/yourprofile
⭐ Support

If you found this project useful:

⭐ Star the repository
🍴 Fork the project
🚀 Share it with others

Built with AI, FastAPI & LLaMA 3.3
                    ┌─────────────────────────────────┐
                    │ Generated Marketing Assets      │
                    └─────────────────────────────────┘
