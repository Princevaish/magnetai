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

                    ┌─────────────────────────────────┐
                    │ Generated Marketing Assets      │
                    └─────────────────────────────────┘
