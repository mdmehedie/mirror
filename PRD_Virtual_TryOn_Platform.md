# Product Requirements Document (PRD)
## AI-Powered Photorealistic Virtual Try-On Platform

**Version:** 1.0
**Date:** November 13, 2025
**Project Type:** Proof of Concept (PoC)
**Tech Stack:** Django 4.2 + DRF 3.14 + React 19 + PostgreSQL

---

## Executive Summary

This document outlines requirements for developing an AI-powered virtual try-on platform that generates photorealistic images of human models wearing uploaded garments/products. The platform prioritizes facial feature preservation and removes typical AI guardrails around human face generation, suitable for e-commerce businesses with proper model consent.

**Key Differentiators:**
- Minimal face generation restrictions (with consent-based usage)
- Advanced pose, lighting, and garment fitting controls
- Parametric prompt engineering system
- Real-time generation (5-20 seconds)
- Multi-category prompt templates

---

## Problem Statement

E-commerce businesses face significant challenges:
- **High Cost of Photography**: Professional model photoshoots cost $500-5000+ per session
- **Long Turnaround Time**: Traditional photography requires scheduling, shooting, and post-production (days/weeks)
- **Limited Model Diversity**: Expensive to showcase products on multiple body types, ethnicities, ages
- **Inventory Changes**: New products require complete reshoot cycles
- **Seasonal Updates**: Constant need for fresh content across collections

**Current AI Limitations:**
- Most AI platforms have strict face generation guardrails
- Poor facial feature preservation across generated images
- Limited control over lighting, pose, and garment fitting
- Generic outputs unsuitable for professional e-commerce use

---

## Solution Overview

An AI-powered SaaS platform that:
1. Accepts 2 model images + 1-2 product/garment images
2. Processes via best-in-class cloud AI APIs
3. Generates photorealistic try-on images in 5-20 seconds
4. Preserves model facial features and identity
5. Provides granular control over generation parameters
6. Supports multiple prompt templates for different use cases

---

## Target Users

### Primary Users
- **E-commerce Fashion Brands** (Small to Medium)
- **Fashion Retailers** with online stores
- **Fashion Designers & Boutiques**
- **Fashion Marketplaces** (multi-vendor platforms)

### Secondary Users
- **Marketing Agencies** serving fashion clients
- **Content Creators** in fashion space
- **Fashion Photographers** looking to scale

---

## Market Research: AI Provider Analysis

### Comprehensive Provider Comparison

#### 1. FASHN API ⭐ **RECOMMENDED FOR POC**

**Strengths:**
- **Speed:** 5-17 seconds (quality dependent)
- **Pricing:** $0.075/image (as of March 2025, increased from $0.04)
- **Resolution:** 576×864 (high quality upgrade)
- **Face Policy:** Moderate restrictions, suitable for fashion
- **API Quality:** Well-documented REST API
- **Virtual Try-On:** Model v1.6 specifically designed for garments
- **Credits:** Volume discounts available, can go below $0.04/image
- **Expiration:** Credits valid 365 days

**Weaknesses:**
- Price increased 87.5% in 2025 (reflects quality improvement)
- May have some face generation limitations

**Use Case:** Primary API for production POC

---

#### 2. Replicate (IDM-VTON) ⭐ **RECOMMENDED FOR BUDGET**

**Strengths:**
- **Speed:** ~19 seconds average
- **Pricing:** $0.025/image (~175 runs per $1)
- **Hardware:** Nvidia A100 (80GB)
- **Open Source:** Based on ECCV 2024 research
- **Face Policy:** Minimal restrictions (open-source model)
- **Quality:** High-fidelity results
- **Flexibility:** Can deploy on own infrastructure

**Weaknesses:**
- Requires technical setup for self-hosting
- Less "enterprise" support compared to commercial APIs

**Use Case:** Budget-conscious option, great for high-volume testing

---

#### 3. Kolors Virtual Try-On (Kling AI) ⭐ **CHINESE PROVIDER**

**Strengths:**
- **Quality:** Trained on billions of text-image pairs
- **Versions:** v1.5 available (improved from v1.0)
- **Face Policy:** Minimal restrictions reported
- **API Availability:** Multiple providers (fal.ai, Kling AI direct)
- **Commercial Use:** Available (requires registration with Kuaishou)
- **Realism:** Excellent photorealistic outputs

**Weaknesses:**
- Licensing requires questionnaire to kwai-kolors@kuaishou.com
- Documentation may be Chinese-heavy
- Pricing not publicly transparent

**Use Case:** High-quality alternative with Chinese tech advantage

---

#### 4. Self-Hosted: ComfyUI + IDM-VTON ⭐ **SELF-HOSTED OPTION**

**Strengths:**
- **Cost:** Free after infrastructure setup (no per-image charges)
- **Control:** Complete customization and control
- **Privacy:** Data stays on your servers
- **Face Policy:** No restrictions (self-hosted)
- **Models:** Access to latest open-source models
- **Scalability:** Can scale hardware as needed

**Weaknesses:**
- **Hardware Required:** Minimum 16GB VRAM GPU
- **Setup Complexity:** Requires DevOps expertise
- **Maintenance:** Ongoing server management needed
- **Dependency Issues:** Known issue with Huggingface-Hub (need v0.25.2)
- **Initial Cost:** GPU server costs ($500-2000/month for A100)

**Infrastructure Costs:**
- AWS p3.2xlarge (V100 16GB): ~$3.06/hour (~$2,200/month)
- AWS p4d.24xlarge (A100 40GB): ~$32.77/hour (~$23,600/month)
- Lambda Labs A100 (80GB): ~$1.10/hour (~$792/month)
- Vast.ai (spot instances): ~$0.40-0.80/hour (~$288-576/month)

**Use Case:** Long-term solution if generating >10,000 images/month

---

#### 5. HuHu AI ⭐ **MINIMAL RESTRICTIONS**

**Strengths:**
- **Face Policy:** Minimal restrictions on product categories
- **Categories Allowed:** Lingerie, swimwear, intimate apparel (blocked by others)
- **Speed:** 20-25 seconds
- **API Access:** Available for bulk processing
- **E-commerce Focus:** Built specifically for fashion e-commerce

**Weaknesses:**
- **Pricing:** Not fully transparent (starts at $9.90 first month, then $99)
- **Documentation:** Limited public API documentation
- **Unknown:** Per-image API costs unclear

**Use Case:** When other APIs block specific fashion categories

---

#### 6. Tencent Hunyuan Image 3.0 ⭐ **CHINESE ALTERNATIVE**

**Strengths:**
- **Quality:** #1 on Text-to-Image Arena (overall & open-source)
- **Pricing:** ~0.0005 CNY/1K input tokens, 0.002 CNY/1K output tokens
- **Technology:** Revolutionary diffusion architecture
- **Open Source:** HunyuanImage 2.1 available
- **Support:** Handles Chinese and English
- **3D Capabilities:** Can convert to 3D visuals

**Weaknesses:**
- **Access:** May require waiting list for some models
- **Documentation:** Primarily Chinese language
- **Virtual Try-On:** Not specifically designed for garment transfer
- **Integration:** May require additional adaptation layer

**Use Case:** When pure image generation needed (not pure try-on)

---

#### 7. Stability AI SDXL

**Strengths:**
- **Established:** Mature, widely-used platform
- **Pricing:** Similar to SD1.6 (~$0.0057/image via Replicate)
- **Community:** Large developer community
- **Open Source:** Community license available

**Weaknesses:**
- **Face Quality:** "Faces and people may not be generated properly with SDXL"
- **Not Specialized:** Not designed for virtual try-on
- **Price Increase:** API prices increasing August 1, 2025

**Use Case:** NOT recommended for this use case due to face generation issues

---

#### 8. Leonardo AI

**Strengths:**
- **API Documentation:** Well-documented API
- **Style Variety:** Pre-trained models for various styles
- **Developer-Friendly:** Easy integration

**Weaknesses:**
- **Not Specialized:** General-purpose, not virtual try-on specific
- **Pricing:** Not optimized for this use case

**Use Case:** Secondary option if primary APIs fail

---

#### 9. Civitai Models (Open Source)

**Strengths:**
- **Variety:** Hundreds of realistic human models
- **Face-Specific:** Models like "Real Faceji", "Real Humans", "Realistic Vision V6.0"
- **Customization:** Highly customizable LoRAs
- **API Available:** REST API, Python SDK, JavaScript SDK
- **Community:** Active development

**Weaknesses:**
- **Not Try-On:** General image generation, not garment transfer
- **Integration:** Requires custom implementation
- **Consistency:** Model quality varies

**Use Case:** Background generation, model variations, supplementary content

---

### Final Recommendations

#### For POC Phase:
```
PRIMARY: FASHN API
├── Reason: Best balance of quality, speed, documentation
├── Cost: $0.075/image (acceptable for POC)
└── Fallback: Replicate IDM-VTON ($0.025/image)

TESTING: Kolors (Kling AI)
├── Reason: Chinese tech advantage, high quality
├── Cost: TBD (need to contact for API pricing)
└── Use: Quality comparison tests

FUTURE: Self-Hosted ComfyUI + IDM-VTON
├── Reason: Cost optimization at scale
├── Threshold: When usage exceeds 1,000-2,000 images/month
└── Timeline: Post-POC (Q2 2026)
```

#### Cost Analysis (Monthly)

**Scenario 1: Low Volume (100 images/month)**
- FASHN: $7.50/month
- Replicate: $2.50/month
- Self-hosted: Not cost-effective

**Scenario 2: Medium Volume (1,000 images/month)**
- FASHN: $75/month (with discounts ~$40)
- Replicate: $25/month
- Self-hosted: ~$288-792/month (not yet cost-effective)

**Scenario 3: High Volume (10,000 images/month)**
- FASHN: $750/month (with discounts ~$400)
- Replicate: $250/month
- Self-hosted: ~$288-792/month ✅ **NOW COST-EFFECTIVE**

**Break-even Point:** ~5,000-8,000 images/month

---

## Technical Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Frontend (Vite 5)                  │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │ Image      │  │ Parameter    │  │ Generation             │  │
│  │ Upload UI  │  │ Controls     │  │ Gallery                │  │
│  └────────────┘  └──────────────┘  └────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────┘
                          │ JWT Auth + REST API
┌─────────────────────────▼───────────────────────────────────────┐
│                    Django Backend (4.2 + DRF)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │ Image        │  │ Generation   │  │ Prompt Template    │    │
│  │ Management   │  │ Queue        │  │ Engine             │    │
│  └──────────────┘  └──────────────┘  └────────────────────┘    │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │ API Router   │  │ Cost         │  │ Provider           │    │
│  │ (Multi-API)  │  │ Tracker      │  │ Failover           │    │
│  └──────────────┘  └──────────────┘  └────────────────────┘    │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                       PostgreSQL Database                       │
│  • Users & Auth        • Generated Images    • Usage Analytics  │
│  • Model Images        • Generation Jobs     • Cost Tracking    │
│  • Product Images      • Prompt Templates    • Provider Logs    │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                      File Storage (S3/R2)                       │
│  • Original Model Images    • Generated Results                 │
│  • Product/Garment Images   • Thumbnails                        │
└──────────────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                     AI Provider Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │ FASHN API    │  │ Replicate    │  │ Kolors (Kling)     │    │
│  │ (Primary)    │  │ (Fallback)   │  │ (Testing)          │    │
│  └──────────────┘  └──────────────┘  └────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Backend
```python
- Django 4.2 (existing)
- Django REST Framework 3.14 (existing)
- JWT Authentication (existing)
- Celery 5.3 (for async generation jobs)
- Redis 7.x (task queue + caching)
- PostgreSQL 15 (existing)
- Boto3 (S3/R2 integration)
- httpx (async HTTP client for API calls)
- Pillow (image preprocessing)
```

#### Frontend
```javascript
- React 19 (existing)
- Vite 5 (existing)
- Tailwind CSS + shadcn/ui (existing)
- React Query (server state management)
- Zustand (client state management)
- react-dropzone (image uploads)
- react-image-crop (image preprocessing)
- canvas-API (image manipulation)
```

#### Infrastructure
```yaml
Storage: Cloudflare R2 or AWS S3
CDN: Cloudflare
Queue: Redis + Celery
Monitoring: Sentry (errors), PostHog (analytics)
Logging: Structured JSON logs
```

---

## Core Features & Requirements

### Feature 1: Image Upload System

#### FR1.1: Model Image Upload
**Priority:** P0 (Critical)

**Requirements:**
- Users must upload exactly 2 model images
- Support formats: JPG, PNG, WEBP
- Max file size: 10MB per image
- Min resolution: 512×768 (portrait)
- Max resolution: 2048×3072
- Auto-detect face presence (reject if no face found)
- Face alignment guidance overlay
- Drag-and-drop + click-to-upload
- Preview with zoom capability
- EXIF data stripping (privacy)

**Validation Rules:**
```python
{
    "file_types": ["image/jpeg", "image/png", "image/webp"],
    "max_size_mb": 10,
    "min_resolution": [512, 768],
    "max_resolution": [2048, 3072],
    "required_count": 2,
    "face_detection": True,
    "aspect_ratio_range": [0.5, 0.8]  # Portrait orientation
}
```

**Technical Implementation:**
- Frontend: `react-dropzone` + `canvas-API` for preview
- Backend: Pillow for validation + face detection (MediaPipe/MTCNN)
- Storage: Direct upload to R2/S3 with pre-signed URLs

---

#### FR1.2: Product/Garment Image Upload
**Priority:** P0 (Critical)

**Requirements:**
- Users upload 1-2 product images
- Same format support as model images
- Max file size: 10MB per image
- Transparent background preferred (auto-remove background option)
- Support both flat-lay and worn product shots
- Product category tagging (dress, shirt, pants, accessories, etc.)
- Auto-crop to garment boundaries

**Background Removal:**
- Option to use remove.bg API or similar
- Fallback to manual masking tool
- Cost: ~$0.10-0.20 per image (optional feature)

**Product Categories:**
```python
PRODUCT_CATEGORIES = [
    "dresses",
    "tops_shirts",
    "pants_jeans",
    "skirts",
    "jackets_coats",
    "activewear",
    "swimwear",
    "lingerie",
    "accessories",
    "shoes",
    "bags"
]
```

---

### Feature 2: Prompt Engineering System ⭐ CRITICAL

#### FR2.1: Parametric Prompt Builder
**Priority:** P0 (Critical)

**Core Concept:**
User-adjustable parameters that dynamically construct prompts for AI generation.

**Parameter Categories:**

##### 2.1.1 Model Parameters
```javascript
{
  "pose": {
    "type": "select",
    "options": ["front", "side_profile", "three_quarter", "walking", "sitting", "dynamic"],
    "default": "front",
    "promptTemplate": "model in {pose} pose"
  },
  "expression": {
    "type": "select",
    "options": ["neutral", "subtle_smile", "confident", "cheerful", "serious"],
    "default": "subtle_smile",
    "promptTemplate": "with {expression} expression"
  },
  "body_type": {
    "type": "select",
    "options": ["preserve_original", "athletic", "curvy", "petite", "plus_size"],
    "default": "preserve_original",
    "promptTemplate": ""
  }
}
```

##### 2.1.2 Lighting Parameters
```javascript
{
  "lighting_type": {
    "type": "select",
    "options": [
      "studio_soft_box",
      "natural_window",
      "golden_hour",
      "high_key",
      "low_key",
      "dramatic",
      "even_flat"
    ],
    "default": "studio_soft_box",
    "promptTemplate": "{lighting_type} lighting"
  },
  "lighting_intensity": {
    "type": "slider",
    "min": 0.3,
    "max": 1.5,
    "step": 0.1,
    "default": 1.0,
    "promptTemplate": "lighting intensity {lighting_intensity}"
  },
  "shadows": {
    "type": "select",
    "options": ["soft", "moderate", "hard", "minimal"],
    "default": "soft",
    "promptTemplate": "{shadows} shadows"
  }
}
```

##### 2.1.3 Environment Parameters
```javascript
{
  "background": {
    "type": "select",
    "options": [
      "white_seamless",
      "gray_gradient",
      "studio_backdrop",
      "outdoor_natural",
      "urban_street",
      "minimal_interior",
      "fashion_runway"
    ],
    "default": "white_seamless",
    "promptTemplate": "{background} background"
  },
  "depth_of_field": {
    "type": "select",
    "options": ["sharp_all", "shallow_focus", "bokeh_background"],
    "default": "shallow_focus",
    "promptTemplate": "{depth_of_field}"
  }
}
```

##### 2.1.4 Garment Fitting Parameters
```javascript
{
  "fit_style": {
    "type": "select",
    "options": ["perfect_fit", "loose", "tight", "flowy", "structured"],
    "default": "perfect_fit",
    "promptTemplate": "{fit_style} garment fit"
  },
  "draping": {
    "type": "select",
    "options": ["natural", "enhanced", "minimal"],
    "default": "natural",
    "promptTemplate": "{draping} fabric draping"
  },
  "wrinkle_level": {
    "type": "slider",
    "min": 0,
    "max": 1,
    "step": 0.1,
    "default": 0.2,
    "promptTemplate": "fabric wrinkle level {wrinkle_level}"
  }
}
```

##### 2.1.5 Quality Parameters
```javascript
{
  "quality_preset": {
    "type": "select",
    "options": ["draft", "standard", "high", "ultra"],
    "default": "high",
    "apiMapping": {
      "draft": {"steps": 20, "cfg_scale": 5},
      "standard": {"steps": 30, "cfg_scale": 7},
      "high": {"steps": 40, "cfg_scale": 7.5},
      "ultra": {"steps": 50, "cfg_scale": 8}
    }
  },
  "style": {
    "type": "select",
    "options": [
      "photorealistic",
      "catalog_style",
      "editorial_fashion",
      "lifestyle",
      "commercial"
    ],
    "default": "photorealistic",
    "promptTemplate": "{style} photography"
  }
}
```

---

#### FR2.2: Prompt Template System
**Priority:** P0 (Critical)

**Template Structure:**

```python
class PromptTemplate:
    """
    Base prompt template for generation
    """
    def __init__(self, category: str):
        self.category = category
        self.base_structure = self.get_base_structure()

    def get_base_structure(self) -> str:
        """
        Returns category-specific base prompt structure
        """
        templates = {
            "standard_tryon": (
                "Professional fashion photography, {model_description}, "
                "wearing {garment_description}, {pose}, {expression}, "
                "{lighting_type}, {background}, {quality_modifiers}, "
                "hyper-realistic, detailed fabric texture, accurate colors, "
                "preserve facial features, maintain identity, "
                "e-commerce quality, 8K resolution"
            ),
            "editorial_fashion": (
                "High-end editorial fashion photography, {model_description}, "
                "showcasing {garment_description}, {pose}, artistic {expression}, "
                "{lighting_type} with dramatic contrast, {background}, "
                "magazine cover quality, {depth_of_field}, "
                "preserve unique facial characteristics, "
                "fashion-forward styling, ultra detailed"
            ),
            "lifestyle_casual": (
                "Lifestyle photography, {model_description}, "
                "casually wearing {garment_description}, {pose}, natural {expression}, "
                "soft natural lighting, {background}, "
                "authentic and relatable, preserve genuine appearance, "
                "candid style, real-life setting"
            ),
            "catalog_commercial": (
                "Commercial product catalog photography, {model_description}, "
                "displaying {garment_description}, {pose}, professional {expression}, "
                "even studio lighting, clean white background, "
                "sharp focus on product, maintain facial consistency, "
                "e-commerce optimized, clear product details"
            )
        }
        return templates.get(self.category, templates["standard_tryon"])

    def compile(self, parameters: dict) -> str:
        """
        Compiles final prompt from parameters
        """
        prompt = self.base_structure
        for key, value in parameters.items():
            placeholder = f"{{{key}}}"
            prompt = prompt.replace(placeholder, str(value))

        # Add negative prompt
        negative_prompt = self.get_negative_prompt()

        return {
            "prompt": prompt,
            "negative_prompt": negative_prompt
        }

    def get_negative_prompt(self) -> str:
        """
        Returns negative prompt to avoid common issues
        """
        return (
            "blurry, low quality, distorted face, disfigured, "
            "bad anatomy, wrong proportions, extra limbs, "
            "watermark, signature, text, logo, "
            "unrealistic skin texture, plastic skin, "
            "wrong garment fit, floating clothes, "
            "color bleeding, artifacts, noise, "
            "duplicate person, multiple faces on one body"
        )
```

**Template Selection UI:**

```
┌─────────────────────────────────────────────┐
│  Select Generation Style                    │
├─────────────────────────────────────────────┤
│                                             │
│  [🎨] Standard Try-On (Recommended)         │
│   Perfect for e-commerce product listings   │
│   • White/neutral background                │
│   • Professional lighting                   │
│   • Sharp product details                   │
│                                             │
│  [📸] Editorial Fashion                     │
│   Magazine-quality fashion photography      │
│   • Artistic poses                          │
│   • Dramatic lighting                       │
│   • Creative backgrounds                    │
│                                             │
│  [🌿] Lifestyle Casual                      │
│   Natural, relatable lifestyle shots        │
│   • Casual poses                            │
│   • Natural settings                        │
│   • Authentic feel                          │
│                                             │
│  [🏷️] Catalog Commercial                    │
│   Clean product-focused catalog shots       │
│   • Straight poses                          │
│   • Even lighting                           │
│   • Minimal distractions                    │
│                                             │
└─────────────────────────────────────────────┘
```

---

#### FR2.3: Advanced Prompt Features

**2.3.1 Smart Defaults by Category**
- Automatically set optimal parameters based on product category
- Example: Swimwear → outdoor lighting, beach background, natural pose

**2.3.2 Prompt History & Favorites**
- Save successful parameter combinations
- Quick-apply from history
- Share prompt templates across team

**2.3.3 A/B Testing Mode**
- Generate multiple variations with parameter tweaks
- Side-by-side comparison
- Vote for best result

**2.3.4 Batch Generation with Parameters**
- Apply same parameters to multiple model/product combinations
- Queue management
- Cost estimation before generation

---

### Feature 3: Generation Management

#### FR3.1: Generation Request Handling
**Priority:** P0 (Critical)

**Flow:**
```
1. User uploads images + sets parameters
2. Frontend validates inputs
3. Backend creates generation job (status: pending)
4. Job added to Celery queue
5. Worker processes job:
   a. Fetch images from storage
   b. Preprocess images (resize, format)
   c. Compile prompt from template + parameters
   d. Call AI provider API
   e. Poll for completion (if async API)
   f. Download generated image
   g. Store in S3/R2
   h. Update job status (completed/failed)
   i. Track costs
6. Frontend polls for job updates
7. Display result to user
```

**API Endpoints:**

```python
# POST /api/v1/generations/
{
  "model_images": ["uuid1", "uuid2"],
  "product_images": ["uuid3"],
  "prompt_template": "standard_tryon",
  "parameters": {
    "pose": "front",
    "lighting_type": "studio_soft_box",
    "background": "white_seamless",
    "quality_preset": "high"
    # ... all other parameters
  },
  "provider": "fashn"  # or "replicate", "kolors"
}

# Response
{
  "job_id": "gen_abc123xyz",
  "status": "pending",
  "estimated_time": 15,
  "estimated_cost": 0.075,
  "created_at": "2025-11-13T10:30:00Z"
}

# GET /api/v1/generations/{job_id}/
{
  "job_id": "gen_abc123xyz",
  "status": "completed",  # pending, processing, completed, failed
  "result_url": "https://cdn.example.com/results/gen_abc123xyz.jpg",
  "thumbnail_url": "https://cdn.example.com/results/gen_abc123xyz_thumb.jpg",
  "processing_time": 12.3,
  "actual_cost": 0.075,
  "created_at": "2025-11-13T10:30:00Z",
  "completed_at": "2025-11-13T10:30:12Z",
  "provider_used": "fashn",
  "parameters_used": { /* all parameters */ }
}
```

---

#### FR3.2: Provider Routing & Failover
**Priority:** P1 (High)

**Smart Routing Logic:**

```python
class ProviderRouter:
    """
    Routes generation requests to optimal provider
    """

    def select_provider(self, request_params: dict) -> str:
        """
        Selects best provider based on:
        - User preference
        - Provider availability
        - Cost optimization
        - Category restrictions
        """

        # Priority 1: User explicit choice
        if request_params.get("provider"):
            return request_params["provider"]

        # Priority 2: Category restrictions
        category = request_params.get("product_category")
        if category in ["swimwear", "lingerie"] and self.is_available("huhu"):
            return "huhu"

        # Priority 3: Load balancing
        provider_loads = self.get_provider_loads()
        if provider_loads["fashn"] < 0.8:
            return "fashn"
        elif provider_loads["replicate"] < 0.8:
            return "replicate"

        # Priority 4: Cost optimization
        if request_params.get("cost_mode") == "budget":
            return "replicate"

        # Default
        return "fashn"

    def handle_failure(self, failed_provider: str, request_params: dict):
        """
        Implements failover logic
        """
        fallback_chain = {
            "fashn": ["replicate", "kolors"],
            "replicate": ["fashn", "kolors"],
            "kolors": ["fashn", "replicate"]
        }

        for fallback in fallback_chain[failed_provider]:
            if self.is_available(fallback):
                return fallback

        raise NoProviderAvailableException()
```

---

#### FR3.3: Result Gallery & Management
**Priority:** P1 (High)

**Features:**
- Grid view of all generated images
- Filter by: date, product category, model, status
- Bulk actions: download, delete, regenerate
- Side-by-side comparison mode
- Rating system (1-5 stars)
- Export to CSV with metadata
- Share via link (with expiration)

**UI Components:**
```
┌─────────────────────────────────────────────────────────┐
│  My Generations                    🔍 Search   ⚙️ Filter │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Image 1]  [Image 2]  [Image 3]  [Image 4]            │
│  Model A    Model A    Model B    Model C              │
│  Dress 1    Shirt 2    Dress 1    Pants 1              │
│  ⭐⭐⭐⭐⭐    ⭐⭐⭐⭐☆    ⭐⭐⭐☆☆    ⭐⭐⭐⭐⭐               │
│  $0.075     $0.075     $0.025     $0.075               │
│  12s        15s        19s        11s                   │
│  Nov 13     Nov 13     Nov 12     Nov 12                │
│                                                         │
│  [Image 5]  [Image 6]  [Image 7]  [Image 8]            │
│  ...                                                    │
│                                                         │
│  ← Prev   Page 1 of 23   Next →                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Feature 4: Cost Tracking & Analytics

#### FR4.1: Cost Dashboard
**Priority:** P1 (High)

**Metrics to Track:**
- Total spend (all-time, monthly, weekly, daily)
- Cost per generation (average, by provider)
- Cost per product category
- Provider cost comparison
- Budget alerts
- Cost projections

**UI Dashboard:**
```
┌─────────────────────────────────────────────────────────┐
│  Cost Analytics - November 2025                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  💰 Total Spend This Month: $127.50                     │
│  📊 Generations: 1,700 images                           │
│  📈 Average Cost: $0.075/image                          │
│  🎯 Budget Used: 51% of $250                            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Provider Breakdown:                                    │
│  • FASHN API:    1,200 images ($90.00)  70%            │
│  • Replicate:      400 images ($10.00)  24%            │
│  • Kolors:         100 images ($27.50)   6%            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  [Cost Over Time Graph]                                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Category Breakdown:                                    │
│  • Dresses:       800 images ($60.00)                   │
│  • Tops/Shirts:   500 images ($37.50)                   │
│  • Pants:         300 images ($22.50)                   │
│  • Accessories:   100 images ($7.50)                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

#### FR4.2: Usage Analytics
**Priority:** P2 (Medium)

**Track:**
- Generation success rate (by provider)
- Average generation time
- Most used parameters
- Most used prompt templates
- Model image reuse rate
- Peak usage times
- User behavior patterns

---

### Feature 5: Model & Product Management

#### FR5.1: Model Library
**Priority:** P1 (High)

**Features:**
- Save multiple model profiles
- Tag models (gender, age, ethnicity, body type)
- Model metadata: name, description, notes
- Consent tracking (required)
- Usage statistics per model
- Batch operations

**Data Model:**
```python
class ModelProfile(models.Model):
    id = models.UUIDField(primary_key=True)
    user = models.ForeignKey(User)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    # Images
    image_1 = models.ForeignKey(Image, related_name='model_image_1')
    image_2 = models.ForeignKey(Image, related_name='model_image_2')

    # Tags
    gender = models.CharField(choices=GENDER_CHOICES)
    age_range = models.CharField(choices=AGE_RANGE_CHOICES)
    ethnicity = models.CharField(choices=ETHNICITY_CHOICES)
    body_type = models.CharField(choices=BODY_TYPE_CHOICES)

    # Consent & Legal
    consent_obtained = models.BooleanField(default=False)
    consent_date = models.DateTimeField(null=True)
    consent_document = models.FileField(upload_to='consents/', null=True)

    # Usage
    times_used = models.IntegerField(default=0)
    last_used = models.DateTimeField(null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

---

#### FR5.2: Product Library
**Priority:** P1 (High)

**Features:**
- Upload product images
- Categorize products
- Product metadata: SKU, name, description, price
- Tag by season, collection, color
- Link to external product pages
- Track generation usage per product

**Data Model:**
```python
class Product(models.Model):
    id = models.UUIDField(primary_key=True)
    user = models.ForeignKey(User)
    sku = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    # Images
    images = models.ManyToManyField(Image, related_name='product_images')

    # Categorization
    category = models.CharField(choices=PRODUCT_CATEGORIES)
    subcategory = models.CharField(max_length=100, blank=True)
    tags = models.JSONField(default=list)  # ["summer", "casual", "blue"]

    # Metadata
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    color = models.CharField(max_length=50)
    size_range = models.JSONField(default=list)  # ["XS", "S", "M", "L", "XL"]

    # External
    product_url = models.URLField(blank=True)

    # Usage
    times_used = models.IntegerField(default=0)
    last_used = models.DateTimeField(null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

---

### Feature 6: User Management & Billing

#### FR6.1: User Roles & Permissions
**Priority:** P1 (High)

**Roles:**
```python
ROLES = {
    "admin": {
        "permissions": ["*"],  # All permissions
        "description": "Full system access"
    },
    "team_owner": {
        "permissions": [
            "manage_team",
            "manage_billing",
            "view_all_generations",
            "create_generation",
            "manage_models",
            "manage_products"
        ],
        "description": "Team owner with billing access"
    },
    "team_member": {
        "permissions": [
            "view_team_generations",
            "create_generation",
            "manage_own_models",
            "manage_products"
        ],
        "description": "Standard team member"
    },
    "viewer": {
        "permissions": [
            "view_team_generations"
        ],
        "description": "Read-only access"
    }
}
```

---

#### FR6.2: Billing & Credits System
**Priority:** P1 (High)

**Credit System:**
- User purchases credit packs
- Each generation deducts credits based on provider cost
- Real-time credit balance display
- Low balance alerts
- Auto-reload option
- Usage history & invoices

**Credit Packs:**
```python
CREDIT_PACKS = [
    {
        "name": "Starter",
        "credits": 100,
        "price": 9.00,
        "cost_per_credit": 0.09,
        "best_for": "Testing (133 images @ FASHN)"
    },
    {
        "name": "Professional",
        "credits": 500,
        "price": 40.00,
        "cost_per_credit": 0.08,
        "discount": "11%",
        "best_for": "Small business (533 images @ FASHN)"
    },
    {
        "name": "Business",
        "credits": 2000,
        "price": 140.00,
        "cost_per_credit": 0.07,
        "discount": "22%",
        "best_for": "Growing business (1,867 images @ FASHN)"
    },
    {
        "name": "Enterprise",
        "credits": 10000,
        "price": 600.00,
        "cost_per_credit": 0.06,
        "discount": "33%",
        "best_for": "High volume (8,000 images @ FASHN)"
    }
]
```

**Credit Calculation:**
```python
def calculate_credits_required(provider: str, quality: str) -> float:
    """
    Maps provider costs to credits
    1 credit = $0.01 USD
    """
    cost_map = {
        "fashn": {
            "draft": 5,      # $0.05 (estimated)
            "standard": 6,   # $0.06 (estimated)
            "high": 7.5,     # $0.075 (actual)
            "ultra": 10      # $0.10 (estimated)
        },
        "replicate": {
            "draft": 2,      # $0.02 (estimated)
            "standard": 2.5, # $0.025 (actual)
            "high": 2.5,     # $0.025 (actual)
            "ultra": 3       # $0.03 (estimated)
        },
        "kolors": {
            "draft": 4,      # $0.04 (estimated)
            "standard": 6,   # $0.06 (estimated)
            "high": 8,       # $0.08 (estimated)
            "ultra": 12      # $0.12 (estimated)
        }
    }

    return cost_map[provider][quality]
```

---

### Feature 7: API for External Integration

#### FR7.1: Public REST API
**Priority:** P2 (Medium) - Post-POC

**Endpoints:**
```
POST   /api/v1/external/generations/     Create generation
GET    /api/v1/external/generations/:id  Get generation status
GET    /api/v1/external/generations/     List generations
DELETE /api/v1/external/generations/:id  Delete generation

POST   /api/v1/external/models/          Upload model profile
GET    /api/v1/external/models/:id       Get model details

POST   /api/v1/external/products/        Upload product
GET    /api/v1/external/products/:id     Get product details

GET    /api/v1/external/credits/balance  Get credit balance
GET    /api/v1/external/usage/           Get usage statistics
```

**Authentication:**
- API Key-based authentication
- Rate limiting (per API key)
- Usage tracking per API key

---

## User Flows

### Flow 1: First-Time Generation

```
1. User signs up / logs in
   └─> Lands on dashboard

2. Click "Create New Generation"
   └─> Opens generation wizard

3. Step 1: Upload Model Images
   ├─> Drag-and-drop 2 model images
   ├─> System validates images
   ├─> Face detection runs
   ├─> Preview shown with alignment guides
   └─> Option to save as Model Profile

4. Step 2: Upload Product Image
   ├─> Upload 1-2 product images
   ├─> Select product category (dropdown)
   ├─> Option to remove background
   └─> Option to save as Product

5. Step 3: Configure Generation
   ├─> Select prompt template (4 options)
   ├─> Adjust parameters:
   │   ├─> Model: pose, expression
   │   ├─> Lighting: type, intensity, shadows
   │   ├─> Environment: background, depth
   │   ├─> Garment: fit style, draping
   │   └─> Quality: preset, style
   ├─> Preview parameter summary
   ├─> See cost estimate (e.g., "7.5 credits / $0.075")
   └─> Option to save as preset

6. Review & Generate
   ├─> Summary shown
   ├─> Confirm credits deduction
   └─> Click "Generate"

7. Processing
   ├─> Job created (job_id displayed)
   ├─> Real-time status updates
   ├─> Progress bar (estimated time)
   └─> Can navigate away (receive notification)

8. Result Ready
   ├─> Notification sent
   ├─> Result displayed in gallery
   ├─> Options: Download, Regenerate with tweaks, Delete
   ├─> Rate result (1-5 stars)
   └─> Credits deducted from balance
```

---

### Flow 2: Batch Generation from Saved Library

```
1. User navigates to "Batch Generation"

2. Select Model Profiles
   ├─> Grid view of saved models
   ├─> Multi-select (checkboxes)
   └─> Selected: 3 models

3. Select Products
   ├─> Grid view of saved products
   ├─> Multi-select (checkboxes)
   └─> Selected: 5 products

4. Configure Generation
   ├─> Select prompt template
   ├─> Set parameters (applied to all)
   └─> Option to customize per combination

5. Review Matrix
   ├─> Shows 3 models × 5 products = 15 generations
   ├─> Total cost: 15 × 7.5 credits = 112.5 credits ($11.25)
   ├─> Estimated time: 15 × 15s = 3m 45s
   └─> Confirm

6. Processing
   ├─> Jobs queued
   ├─> Progress dashboard (15 jobs)
   ├─> Shows: pending, processing, completed, failed
   └─> Can pause/cancel queue

7. Results
   ├─> All results shown in gallery
   ├─> Filter by model or product
   ├─> Bulk download option
   └─> Export CSV with metadata
```

---

### Flow 3: A/B Testing Mode

```
1. User opens existing generation result

2. Click "Create Variations"

3. Select Parameters to Test
   ├─> Lighting: ["studio_soft_box", "natural_window", "golden_hour"]
   ├─> Pose: ["front", "three_quarter"]
   ├─> Background: ["white_seamless", "gray_gradient"]
   └─> Combinations: 3 × 2 × 2 = 12 variations

4. Review & Generate
   ├─> Cost: 12 × 7.5 = 90 credits
   └─> Confirm

5. Results in Comparison View
   ├─> Side-by-side grid
   ├─> Hover shows parameters used
   ├─> Vote for best result
   └─> Export winning parameters as preset
```

---

## Database Schema

### Core Tables

```sql
-- Users (existing from Django)
users
├── id (uuid, pk)
├── email
├── password_hash
├── role (admin, team_owner, team_member, viewer)
├── credits_balance (decimal)
├── created_at
└── updated_at

-- Model Profiles
model_profiles
├── id (uuid, pk)
├── user_id (fk → users)
├── name
├── description
├── image_1_id (fk → images)
├── image_2_id (fk → images)
├── gender
├── age_range
├── ethnicity
├── body_type
├── consent_obtained (boolean)
├── consent_date
├── consent_document_url
├── times_used
├── last_used
├── created_at
└── updated_at

-- Products
products
├── id (uuid, pk)
├── user_id (fk → users)
├── sku
├── name
├── description
├── category
├── subcategory
├── tags (jsonb)
├── price
├── color
├── size_range (jsonb)
├── product_url
├── times_used
├── last_used
├── created_at
└── updated_at

-- Product Images (many-to-many)
product_images
├── id (uuid, pk)
├── product_id (fk → products)
├── image_id (fk → images)
├── is_primary (boolean)
├── order_index
└── created_at

-- Images
images
├── id (uuid, pk)
├── user_id (fk → users)
├── file_path (s3/r2 path)
├── thumbnail_path
├── file_size (bytes)
├── width
├── height
├── format (jpg, png, webp)
├── upload_source (direct_upload, generated)
├── created_at
└── updated_at

-- Generation Jobs
generation_jobs
├── id (uuid, pk)
├── user_id (fk → users)
├── model_profile_id (fk → model_profiles, nullable)
├── product_id (fk → products, nullable)
├── model_image_1_id (fk → images)
├── model_image_2_id (fk → images)
├── product_image_id (fk → images)
├── prompt_template (standard_tryon, editorial, lifestyle, catalog)
├── parameters (jsonb) -- all generation parameters
├── compiled_prompt (text)
├── compiled_negative_prompt (text)
├── provider (fashn, replicate, kolors)
├── provider_job_id (external API job ID)
├── status (pending, processing, completed, failed)
├── result_image_id (fk → images, nullable)
├── error_message (text, nullable)
├── credits_charged (decimal)
├── actual_cost_usd (decimal)
├── processing_time_seconds (decimal)
├── estimated_time_seconds (decimal)
├── user_rating (1-5, nullable)
├── created_at
├── started_at
├── completed_at
└── updated_at

-- Prompt Presets (saved parameter combinations)
prompt_presets
├── id (uuid, pk)
├── user_id (fk → users)
├── name
├── description
├── prompt_template
├── parameters (jsonb)
├── is_public (boolean) -- shareable presets
├── times_used
├── created_at
└── updated_at

-- Credit Transactions
credit_transactions
├── id (uuid, pk)
├── user_id (fk → users)
├── transaction_type (purchase, deduction, refund, bonus)
├── credits_change (decimal) -- positive or negative
├── credits_balance_after (decimal)
├── amount_usd (decimal, nullable)
├── payment_method (stripe, paypal, etc.)
├── payment_intent_id (external ID)
├── related_generation_id (fk → generation_jobs, nullable)
├── description
├── created_at
└── updated_at

-- Usage Analytics (aggregated)
usage_analytics
├── id (uuid, pk)
├── user_id (fk → users)
├── date (date)
├── provider (fashn, replicate, kolors)
├── total_generations (int)
├── successful_generations (int)
├── failed_generations (int)
├── total_credits_used (decimal)
├── total_cost_usd (decimal)
├── avg_processing_time_seconds (decimal)
└── created_at

-- API Keys (for external integrations)
api_keys
├── id (uuid, pk)
├── user_id (fk → users)
├── key_hash (hashed api key)
├── name (user-friendly name)
├── last_4_chars (for display)
├── permissions (jsonb) -- array of allowed endpoints
├── rate_limit_per_hour (int)
├── is_active (boolean)
├── last_used_at
├── created_at
└── expires_at
```

### Indexes

```sql
-- Performance indexes
CREATE INDEX idx_generation_jobs_user_status ON generation_jobs(user_id, status);
CREATE INDEX idx_generation_jobs_created_at ON generation_jobs(created_at DESC);
CREATE INDEX idx_model_profiles_user ON model_profiles(user_id);
CREATE INDEX idx_products_user_category ON products(user_id, category);
CREATE INDEX idx_credit_transactions_user_type ON credit_transactions(user_id, transaction_type);
CREATE INDEX idx_usage_analytics_user_date ON usage_analytics(user_id, date DESC);
```

---

## API Integration Architecture

### Provider Integration Layer

```python
# backend/apps/generation/providers/base.py

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import httpx

class BaseProvider(ABC):
    """
    Abstract base class for AI provider integrations
    """

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.client = httpx.AsyncClient(timeout=60.0)

    @abstractmethod
    async def generate(
        self,
        model_images: list[str],
        product_image: str,
        prompt: str,
        negative_prompt: str,
        parameters: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Submits generation request
        Returns job_id or result_url depending on sync/async API
        """
        pass

    @abstractmethod
    async def check_status(self, job_id: str) -> Dict[str, Any]:
        """
        Checks generation status for async APIs
        Returns status and result_url if completed
        """
        pass

    @abstractmethod
    async def download_result(self, result_url: str) -> bytes:
        """
        Downloads generated image
        Returns image bytes
        """
        pass

    @abstractmethod
    def calculate_cost(self, parameters: Dict[str, Any]) -> float:
        """
        Calculates generation cost in USD
        """
        pass

    async def health_check(self) -> bool:
        """
        Checks if provider API is available
        """
        try:
            response = await self.client.get(self.health_check_url)
            return response.status_code == 200
        except:
            return False


# backend/apps/generation/providers/fashn.py

class FashnProvider(BaseProvider):
    """
    FASHN API integration
    """

    base_url = "https://api.fashn.ai/v1"

    async def generate(
        self,
        model_images: list[str],
        product_image: str,
        prompt: str,
        negative_prompt: str,
        parameters: Dict[str, Any]
    ) -> Dict[str, Any]:

        # Map parameters to FASHN API format
        payload = {
            "model_image": model_images[0],  # FASHN uses 1 model image
            "garment_image": product_image,
            "category": parameters.get("category", "auto"),
            "num_samples": parameters.get("num_samples", 1),
            "guidance_scale": parameters.get("cfg_scale", 7.5),
            "num_inference_steps": parameters.get("steps", 40),
            "seed": parameters.get("seed", -1),
            # FASHN-specific parameters
            "pose_control": parameters.get("pose") != "preserve_original",
            "garment_fit": parameters.get("fit_style", "perfect_fit")
        }

        response = await self.client.post(
            f"{self.base_url}/tryon",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json=payload
        )

        if response.status_code == 200:
            data = response.json()
            return {
                "job_id": data.get("id"),
                "status": "processing",
                "estimated_time": 12
            }
        else:
            raise ProviderAPIException(f"FASHN API error: {response.text}")

    async def check_status(self, job_id: str) -> Dict[str, Any]:
        response = await self.client.get(
            f"{self.base_url}/tryon/{job_id}",
            headers={"Authorization": f"Bearer {self.api_key}"}
        )

        data = response.json()

        if data["status"] == "completed":
            return {
                "status": "completed",
                "result_url": data["output_url"],
                "processing_time": data.get("processing_time")
            }
        elif data["status"] == "failed":
            return {
                "status": "failed",
                "error": data.get("error_message")
            }
        else:
            return {
                "status": "processing"
            }

    async def download_result(self, result_url: str) -> bytes:
        response = await self.client.get(result_url)
        return response.content

    def calculate_cost(self, parameters: Dict[str, Any]) -> float:
        # FASHN charges per image
        num_samples = parameters.get("num_samples", 1)
        cost_per_image = 0.075  # $0.075 as of March 2025
        return num_samples * cost_per_image


# backend/apps/generation/providers/replicate.py

class ReplicateProvider(BaseProvider):
    """
    Replicate (IDM-VTON) integration
    """

    base_url = "https://api.replicate.com/v1"
    model_version = "cuuupid/idm-vton:..."  # Model version ID

    async def generate(
        self,
        model_images: list[str],
        product_image: str,
        prompt: str,
        negative_prompt: str,
        parameters: Dict[str, Any]
    ) -> Dict[str, Any]:

        payload = {
            "version": self.model_version,
            "input": {
                "human_img": model_images[0],
                "garm_img": product_image,
                "garment_des": prompt,  # Used as garment description
                "seed": parameters.get("seed", -1),
                "n_samples": parameters.get("num_samples", 1)
            }
        }

        response = await self.client.post(
            f"{self.base_url}/predictions",
            headers={
                "Authorization": f"Token {self.api_key}",
                "Content-Type": "application/json"
            },
            json=payload
        )

        data = response.json()
        return {
            "job_id": data["id"],
            "status": "processing",
            "estimated_time": 19
        }

    async def check_status(self, job_id: str) -> Dict[str, Any]:
        response = await self.client.get(
            f"{self.base_url}/predictions/{job_id}",
            headers={"Authorization": f"Token {self.api_key}"}
        )

        data = response.json()

        if data["status"] == "succeeded":
            return {
                "status": "completed",
                "result_url": data["output"][0] if isinstance(data["output"], list) else data["output"],
                "processing_time": data["metrics"]["predict_time"]
            }
        elif data["status"] == "failed":
            return {
                "status": "failed",
                "error": data.get("error")
            }
        else:
            return {
                "status": "processing"
            }

    def calculate_cost(self, parameters: Dict[str, Any]) -> float:
        # Replicate charges ~$0.025 per run
        num_samples = parameters.get("num_samples", 1)
        cost_per_image = 0.025
        return num_samples * cost_per_image


# backend/apps/generation/providers/kolors.py

class KolorsProvider(BaseProvider):
    """
    Kolors (Kling AI) integration
    """

    base_url = "https://api.kling.ai/v1"

    async def generate(
        self,
        model_images: list[str],
        product_image: str,
        prompt: str,
        negative_prompt: str,
        parameters: Dict[str, Any]
    ) -> Dict[str, Any]:

        payload = {
            "model": "kolors-virtual-try-on-v1-5",
            "person_image": model_images[0],
            "garment_image": product_image,
            "prompt": prompt,
            "negative_prompt": negative_prompt,
            "num_inference_steps": parameters.get("steps", 40),
            "guidance_scale": parameters.get("cfg_scale", 7.5)
        }

        response = await self.client.post(
            f"{self.base_url}/virtual-try-on",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json=payload
        )

        data = response.json()
        return {
            "job_id": data["task_id"],
            "status": "processing",
            "estimated_time": 15
        }

    def calculate_cost(self, parameters: Dict[str, Any]) -> float:
        # Estimated cost (actual pricing TBD)
        num_samples = parameters.get("num_samples", 1)
        cost_per_image = 0.08  # Estimated
        return num_samples * cost_per_image


# backend/apps/generation/providers/__init__.py

PROVIDERS = {
    "fashn": FashnProvider,
    "replicate": ReplicateProvider,
    "kolors": KolorsProvider
}

def get_provider(provider_name: str, api_key: str) -> BaseProvider:
    provider_class = PROVIDERS.get(provider_name)
    if not provider_class:
        raise ValueError(f"Unknown provider: {provider_name}")
    return provider_class(api_key)
```

---

## Celery Task Implementation

```python
# backend/apps/generation/tasks.py

from celery import shared_task
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def process_generation_job(self, job_id: str):
    """
    Processes a generation job asynchronously
    """
    from apps.generation.models import GenerationJob
    from apps.generation.providers import get_provider
    from apps.storage.services import StorageService

    job = GenerationJob.objects.get(id=job_id)

    try:
        # Update status
        job.status = "processing"
        job.started_at = timezone.now()
        job.save()

        # Get provider
        provider = get_provider(
            job.provider,
            settings.PROVIDER_API_KEYS[job.provider]
        )

        # Download images from storage
        storage = StorageService()
        model_image_1_url = storage.get_presigned_url(job.model_image_1.file_path)
        model_image_2_url = storage.get_presigned_url(job.model_image_2.file_path)
        product_image_url = storage.get_presigned_url(job.product_image.file_path)

        # Submit generation request
        result = await provider.generate(
            model_images=[model_image_1_url, model_image_2_url],
            product_image=product_image_url,
            prompt=job.compiled_prompt,
            negative_prompt=job.compiled_negative_prompt,
            parameters=job.parameters
        )

        provider_job_id = result["job_id"]
        job.provider_job_id = provider_job_id
        job.save()

        # Poll for completion (for async APIs)
        max_polls = 60  # 5 minutes max
        poll_interval = 5  # seconds

        for i in range(max_polls):
            status_result = await provider.check_status(provider_job_id)

            if status_result["status"] == "completed":
                # Download result
                result_image_bytes = await provider.download_result(
                    status_result["result_url"]
                )

                # Upload to our storage
                result_path = storage.upload_bytes(
                    result_image_bytes,
                    f"results/{job_id}.jpg"
                )

                # Create Image record
                result_image = Image.objects.create(
                    user=job.user,
                    file_path=result_path,
                    upload_source="generated"
                )

                # Update job
                job.status = "completed"
                job.result_image = result_image
                job.completed_at = timezone.now()
                job.processing_time_seconds = (
                    job.completed_at - job.started_at
                ).total_seconds()
                job.save()

                # Send notification
                send_generation_complete_notification.delay(job_id)

                return {"status": "completed", "job_id": job_id}

            elif status_result["status"] == "failed":
                raise Exception(f"Provider generation failed: {status_result.get('error')}")

            else:
                # Still processing, wait and poll again
                await asyncio.sleep(poll_interval)

        # Timeout
        raise Exception("Generation timed out")

    except Exception as exc:
        logger.error(f"Generation job {job_id} failed: {exc}")

        job.status = "failed"
        job.error_message = str(exc)
        job.save()

        # Retry with exponential backoff
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@shared_task
def send_generation_complete_notification(job_id: str):
    """
    Sends notification when generation completes
    """
    # Implement email/push notification
    pass
```

---

## MVP Scope (PoC Phase)

### Phase 1: Core MVP (Weeks 1-4)

**Week 1-2: Backend Foundation**
- [ ] Set up Celery + Redis
- [ ] Implement image upload to S3/R2
- [ ] Implement FASHN API integration
- [ ] Create database models
- [ ] Implement generation job processing
- [ ] Basic error handling

**Week 3-4: Frontend Foundation**
- [ ] Image upload UI components
- [ ] Parameter control panel
- [ ] Generation job status display
- [ ] Result gallery (basic)
- [ ] Cost display

**Deliverable:** Working end-to-end generation with FASHN API

---

### Phase 2: Enhancement (Weeks 5-6)

**Week 5: Additional Providers**
- [ ] Implement Replicate (IDM-VTON) integration
- [ ] Implement provider routing logic
- [ ] Add provider selection UI
- [ ] Cost comparison display

**Week 6: Prompt System**
- [ ] Implement prompt template system
- [ ] Add 4 prompt template options
- [ ] Parameter controls for all categories
- [ ] Prompt preview

**Deliverable:** Multi-provider system with parametric prompts

---

### Phase 3: Management Features (Weeks 7-8)

**Week 7: Library Management**
- [ ] Model profile CRUD
- [ ] Product CRUD
- [ ] Tagging and filtering
- [ ] Consent tracking

**Week 8: Analytics & Billing**
- [ ] Cost tracking dashboard
- [ ] Credit system implementation
- [ ] Usage analytics
- [ ] Credit purchase flow (Stripe integration)

**Deliverable:** Full-featured POC ready for user testing

---

### Out of Scope for MVP

❌ **Not in POC:**
- API for external integrations (Phase 4)
- Self-hosted ComfyUI option (Phase 5)
- Team collaboration features (Phase 4)
- Advanced A/B testing (Phase 4)
- Kolors integration (Phase 3 testing)
- Tencent Hunyuan integration (Future)
- Mobile app (Future)
- Batch processing >10 jobs (Phase 3)

---

## Testing Strategy

### Unit Tests
- Provider integrations (mock API responses)
- Prompt template compilation
- Cost calculation logic
- Credit system transactions

### Integration Tests
- End-to-end generation flow
- Provider failover
- Image upload/download
- Job queue processing

### Manual Testing Checklist
- [ ] Upload various image formats/sizes
- [ ] Test all prompt templates
- [ ] Test all parameter combinations
- [ ] Verify facial feature preservation
- [ ] Test provider routing
- [ ] Test cost tracking accuracy
- [ ] Test credit system
- [ ] Test error scenarios (API down, invalid images, etc.)

---

## Non-Functional Requirements

### Performance
- **Image Upload**: < 5 seconds for 10MB image
- **Generation Submission**: < 2 seconds
- **Generation Time**: 5-20 seconds (provider dependent)
- **Result Download**: < 3 seconds
- **Dashboard Load**: < 1 second
- **API Response Time**: < 500ms (excluding generation)

### Scalability
- Support 100 concurrent users (POC)
- Support 1,000 generations/day (POC)
- Queue up to 100 pending jobs per user

### Security
- All images encrypted at rest (S3/R2 encryption)
- HTTPS only
- JWT token expiration: 1 hour (access), 7 days (refresh)
- API key rotation every 90 days
- Rate limiting: 100 requests/hour per user
- CORS restricted to frontend domain
- Input validation on all file uploads
- SQL injection prevention (ORM)
- XSS prevention (React escaping)

### Compliance
- GDPR compliant (data deletion, export)
- Consent tracking for model images
- Terms of Service acceptance required
- Age verification (18+ for model image upload)
- DMCA takedown process

### Availability
- Target: 99% uptime (POC)
- Automated health checks every 5 minutes
- Error monitoring with Sentry
- Database backups: daily
- Image backups: weekly

---

## Monitoring & Observability

### Application Monitoring
- **Sentry**: Error tracking and alerting
- **PostHog**: User analytics and feature usage
- **CloudWatch/DataDog**: Infrastructure metrics

### Key Metrics to Track
```python
METRICS = {
    "business": [
        "daily_active_users",
        "total_generations",
        "generation_success_rate",
        "average_cost_per_generation",
        "credit_purchases",
        "user_retention_rate"
    ],
    "technical": [
        "api_response_time_p50",
        "api_response_time_p95",
        "api_response_time_p99",
        "generation_time_by_provider",
        "provider_availability",
        "queue_length",
        "worker_utilization",
        "storage_usage",
        "database_query_time"
    ],
    "quality": [
        "average_user_rating",
        "generation_retry_rate",
        "user_reported_issues",
        "facial_feature_preservation_score"
    ]
}
```

### Alerts
- Provider API down (alert if >3 failures in 5 min)
- Queue backlog (alert if >50 pending jobs)
- High error rate (alert if >5% failed generations)
- Low credit balance (notify user at 20%)
- High cost per generation (alert if >$0.20)

---

## Risk Assessment & Mitigation

### Technical Risks

**Risk 1: Provider API Downtime**
- **Impact:** High - Users cannot generate images
- **Probability:** Medium
- **Mitigation:**
  - Implement multi-provider failover
  - Cache provider health status
  - Display status page to users
  - SLA monitoring

**Risk 2: Poor Face Preservation Quality**
- **Impact:** High - Core value proposition fails
- **Probability:** Medium
- **Mitigation:**
  - Test multiple providers during POC
  - Implement quality rating system
  - Allow regeneration with different providers
  - Optimize prompts based on user feedback

**Risk 3: Generation Cost Exceeds Budget**
- **Impact:** Medium - Unsustainable unit economics
- **Probability:** Low
- **Mitigation:**
  - Monitor cost per generation
  - Set per-user generation limits
  - Implement cost optimization algorithms
  - Negotiate volume discounts with providers

**Risk 4: Slow Generation Time**
- **Impact:** Medium - Poor user experience
- **Probability:** Low
- **Mitigation:**
  - Use fastest providers (FASHN: 5s)
  - Queue management with priorities
  - Set realistic expectations (show estimated time)
  - Implement notification system

### Legal/Compliance Risks

**Risk 5: Misuse for Deepfakes/Fraud**
- **Impact:** Critical - Legal liability, reputation damage
- **Probability:** Medium
- **Mitigation:**
  - Mandatory consent checkbox
  - Terms of Service with prohibited uses
  - Watermark option on generated images
  - Implement abuse reporting
  - User verification (email, payment method)
  - Audit trail of all generations

**Risk 6: Copyright Infringement (Product Images)**
- **Impact:** High - Legal liability
- **Probability:** Medium
- **Mitigation:**
  - Terms requiring users to own/license images
  - DMCA takedown process
  - User education about copyright
  - Proactive content moderation (future)

**Risk 7: GDPR/Privacy Violations**
- **Impact:** Critical - Fines, legal issues
- **Probability:** Low
- **Mitigation:**
  - Implement data deletion APIs
  - Data export functionality
  - Privacy policy compliance
  - Cookie consent
  - EU data residency option (future)

### Business Risks

**Risk 8: Low User Adoption**
- **Impact:** High - POC fails
- **Probability:** Medium
- **Mitigation:**
  - Early user interviews
  - Beta testing with target customers
  - Iterate based on feedback
  - Competitive pricing
  - Strong marketing/positioning

**Risk 9: Competitor with Better Technology**
- **Impact:** Medium - Market share loss
- **Probability:** Medium
- **Mitigation:**
  - Stay updated on new AI models
  - Easy provider swapping architecture
  - Focus on UX differentiation
  - Build switching costs (library, integrations)

---

## Success Metrics (POC)

### Primary KPIs

```python
SUCCESS_CRITERIA = {
    "user_adoption": {
        "target": "50 active users in first 2 months",
        "measurement": "Users who generated ≥5 images"
    },
    "generation_quality": {
        "target": "Average rating ≥ 4.0/5.0",
        "measurement": "User ratings on generated images"
    },
    "facial_preservation": {
        "target": "≥80% user satisfaction",
        "measurement": "Survey: 'Did the AI preserve facial features?'"
    },
    "technical_reliability": {
        "target": "≥95% success rate",
        "measurement": "Completed jobs / Total jobs"
    },
    "cost_efficiency": {
        "target": "Average cost ≤ $0.10 per image",
        "measurement": "Total API costs / Total generations"
    },
    "user_retention": {
        "target": "≥40% return rate (Week 2)",
        "measurement": "Users who return after first session"
    }
}
```

### Secondary Metrics
- Time to first successful generation
- Number of regenerations per user
- Average parameters changed per generation
- Most popular prompt templates
- Provider preference distribution
- Credit purchase conversion rate

---

## Future Enhancements (Post-POC)

### Phase 4: Advanced Features (Q1 2026)
- **API for External Integration**
  - Public REST API
  - Webhooks for completion notifications
  - Shopify/WooCommerce plugins
- **Team Collaboration**
  - Multi-user workspaces
  - Role-based permissions
  - Shared libraries
  - Comments & approvals
- **A/B Testing Suite**
  - Automated parameter optimization
  - Statistical significance testing
  - Campaign comparison

### Phase 5: Self-Hosting Option (Q2 2026)
- **ComfyUI Integration**
  - One-click deployment scripts
  - GPU optimization guides
  - Model management
  - Cost calculator
- **Hybrid Mode**
  - Route high-volume to self-hosted
  - Failover to cloud APIs
  - Cost optimization algorithms

### Phase 6: Advanced AI Features (Q3 2026)
- **Multi-Garment Try-On**
  - Complete outfit generation
  - Accessories addition
  - Layering support
- **Background Generation**
  - Custom scene creation
  - Lifestyle context
  - Seasonal variations
- **Video Try-On**
  - Animated model walks
  - 360° product views
  - Short video clips

### Phase 7: Enterprise Features (Q4 2026)
- **White-Label Solution**
  - Custom branding
  - Dedicated infrastructure
  - SLA guarantees
- **Advanced Analytics**
  - Conversion tracking
  - ROI calculation
  - Customer insights
- **Integration Marketplace**
  - Pre-built integrations
  - Partner ecosystem
  - Revenue sharing

---

## Technical Debt & Maintenance

### Planned Technical Debt (Acceptable for POC)
- Synchronous image uploads (use pre-signed URLs in production)
- No image CDN (use Cloudflare in production)
- Basic queue management (upgrade to AWS SQS/RabbitMQ later)
- Manual provider API key management (use secrets manager later)
- Limited test coverage (80% target for production)

### Maintenance Tasks
- Weekly dependency updates
- Monthly security audits
- Quarterly provider performance reviews
- Database optimization (quarterly)
- Cost analysis and optimization (monthly)

---

## Deployment Strategy

### Infrastructure Setup

**Option 1: AWS (Recommended)**
```yaml
Compute:
  - EC2 t3.medium (backend) - $30/month
  - EC2 t3.small (celery workers) - $15/month × 2
Frontend:
  - S3 + CloudFront - $10/month
Database:
  - RDS PostgreSQL db.t3.micro - $15/month
Cache/Queue:
  - ElastiCache Redis t3.micro - $13/month
Storage:
  - S3 Standard - $0.023/GB (~$5-20/month)
Total: ~$103-118/month (POC)
```

**Option 2: DigitalOcean (Budget)**
```yaml
Compute:
  - Droplet 2vCPU/4GB (backend + workers) - $24/month
Database:
  - Managed PostgreSQL 1vCPU/1GB - $15/month
Storage:
  - Spaces (S3-compatible) 250GB - $5/month
Total: ~$44/month (POC)
```

**Option 3: Railway/Render (Simplest)**
```yaml
Compute:
  - Railway Pro Plan - $20/month
  - Additional resources - $10-30/month
Database:
  - Included in Pro Plan
Total: ~$30-50/month (POC)
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml

name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run backend tests
        run: |
          cd backend
          pip install -r requirements.txt
          python manage.py test
      - name: Run frontend tests
        run: |
          cd frontend
          npm install
          npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy backend
        run: |
          # Deploy to chosen platform
      - name: Deploy frontend
        run: |
          # Build and deploy to S3/CDN
```

---

## Documentation Requirements

### For Developers
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Database schema documentation
- [ ] Provider integration guides
- [ ] Setup instructions (local dev)
- [ ] Deployment guide
- [ ] Troubleshooting guide

### For Users
- [ ] Getting started guide
- [ ] Image upload best practices
- [ ] Parameter explanation guide
- [ ] Billing & credits FAQ
- [ ] Consent & legal information
- [ ] Video tutorials

---

## Budget Estimate (POC - First 3 Months)

```
INFRASTRUCTURE:
├─ Hosting (AWS/DO)                 $103/mo × 3 = $309
├─ Domain & SSL                     $20/year     = $20
├─ Email service (Sendgrid)         $15/mo × 3   = $45
└─ Monitoring (Sentry, PostHog)     $30/mo × 3   = $90

AI API COSTS:
├─ FASHN API (testing)              ~$200
├─ Replicate (testing)              ~$50
├─ Kolors (testing)                 ~$100
└─ Buffer                           ~$150

THIRD-PARTY SERVICES:
├─ Background removal (remove.bg)   $50
├─ Stripe fees (assuming $1k rev)   ~$30
└─ CDN/Storage overages            $50

DEVELOPMENT:
├─ If outsourced (optional)         $5,000-15,000
└─ If in-house                      Time investment

TOTAL (excluding development):      ~$1,094
TOTAL (with freelance dev):         ~$6,094-16,094
```

---

## Timeline & Milestones

```
Week 1-2:   Backend foundation + FASHN integration
            ├─ Milestone: First successful generation

Week 3-4:   Frontend UI + job management
            ├─ Milestone: End-to-end user flow works

Week 5-6:   Multi-provider + prompt system
            ├─ Milestone: Parametric generation working

Week 7-8:   Library management + billing
            ├─ Milestone: Full POC feature complete

Week 9-10:  Testing + bug fixes
            ├─ Milestone: Production-ready POC

Week 11-12: Beta user testing + iteration
            ├─ Milestone: Public launch

TOTAL: 12 weeks (3 months)
```

---

## Conclusion & Next Steps

### POC Goals Recap
1. ✅ Identify best AI provider with minimal face restrictions → **FASHN + Replicate**
2. ✅ Build parametric prompt system → **Designed with 5 parameter categories**
3. ✅ Real-time generation (5-20s) → **Achievable with selected providers**
4. ✅ Preserve facial features → **Core feature of selected providers**
5. ✅ Cost-effective POC → **$0.025-0.075 per image**

### Immediate Next Steps
1. **Validate Provider Access**
   - [ ] Sign up for FASHN API account
   - [ ] Get Replicate API key
   - [ ] Test both providers with sample images
   - [ ] Contact Kolors/Kling AI for access

2. **Setup Development Environment**
   - [ ] Create project repositories (backend/frontend)
   - [ ] Set up PostgreSQL database
   - [ ] Set up Redis for Celery
   - [ ] Configure S3/R2 storage

3. **Begin Development**
   - [ ] Follow Week 1-2 tasks (backend foundation)
   - [ ] Implement FASHN integration first
   - [ ] Build basic image upload flow

4. **User Research**
   - [ ] Interview 5-10 potential users
   - [ ] Validate pricing strategy
   - [ ] Gather feature priorities

### Decision Points
- **Week 4**: Evaluate POC progress → Continue or pivot?
- **Week 8**: Assess provider quality → Adjust provider mix?
- **Week 12**: Launch or extend beta?

---

## Appendix

### A. Glossary
- **Virtual Try-On (VTON)**: AI technology that superimposes clothing onto images of people
- **Garment Transfer**: Process of transferring a garment from one image to another
- **Prompt Template**: Pre-defined text structure that gets filled with parameters
- **Parametric Generation**: Using adjustable parameters to control AI output
- **Inference**: The process of generating images using a trained AI model
- **CFG Scale**: Classifier-Free Guidance scale, controls prompt adherence
- **Seed**: Random seed for reproducible generation

### B. Reference Links
- [FASHN API Docs](https://docs.fashn.ai/)
- [Replicate IDM-VTON](https://replicate.com/cuuupid/idm-vton)
- [Kolors on HuggingFace](https://huggingface.co/spaces/Kwai-Kolors/Kolors-Virtual-Try-On)
- [ComfyUI IDM-VTON](https://github.com/TemryL/ComfyUI-IDM-VTON)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React 19 Docs](https://react.dev/)

### C. Provider Contact Information
```
FASHN:
├─ Website: https://fashn.ai/
├─ Email: support@fashn.ai
└─ Pricing: https://fashn.ai/pricing

Replicate:
├─ Website: https://replicate.com/
├─ Email: team@replicate.com
└─ Pricing: Pay per run

Kolors (Kling AI):
├─ Website: https://kling.ai/
├─ License: kwai-kolors@kuaishou.com
└─ Pricing: Contact for API access

HuHu AI:
├─ Website: https://huhu.ai/
├─ Email: Contact via website
└─ Pricing: Contact sales
```

---

**END OF PRD**

---

**Document Control:**
- **Version:** 1.0
- **Last Updated:** November 13, 2025
- **Author:** AI Product Research & Development Team
- **Status:** Draft - Awaiting Review
- **Next Review:** Upon POC completion (Week 12)

---

## Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Nov 13, 2025 | Initial PRD creation | AI Research |
|  |  |  | |
|  |  |  | |
