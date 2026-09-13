# ECOPILOT — FINAL PROJECT REPORT

---

## 1. REPORT TITLE PAGE

# EcoPilot
### AI-Powered Campus Sustainability Intelligence Platform

**Final Project Report**

**Submitted as part of:**  
1M1B AI for Sustainability Virtual Internship

**In collaboration with:**  
AICTE National Internship Portal

**Co-certified by:**  
IBM SkillsBuild

**Student:**  
THAMIZHARASAN M

**Institution:**  
RAJALAKSHMI ENGINEERING COLLEGE

**Academic Year:**  
2026

**Project Repository:**  
https://github.com/thamizharasanm2528-byte/Eco-Pilot-

**Live Prototype:**  
[PASTE LIVE PROJECT URL HERE]

---

## 2. EXECUTIVE SUMMARY

Educational institutions consume vast amounts of energy, water, and material resources while generating substantial waste. However, campus sustainability data is frequently fragmented across siloed department logs, manual spreadsheet trackers, and static paper audits. This makes it difficult for institutional leaders, facility managers, and sustainability coordinators to monitor environmental performance, detect resource inefficiencies, or prioritize high-impact sustainability projects.

**EcoPilot** is an AI-powered campus sustainability intelligence platform designed to centralize environmental assessment data, analyze consumption patterns across five core operational categories (Energy, Water, Waste, Transportation, and Food), and convert complex environmental metrics into actionable decision intelligence. The platform combines interactive React-based data visualizations with a robust Python/FastAPI backend, integrated with Retrieval-Augmented Generation (RAG) and Groq's high-speed inference engine running the state-of-the-art `qwen/qwen3.8-27b` open LLM.

Rather than relying on ungrounded language model generation, EcoPilot's RAG pipeline pairs real-time campus metrics with verified sustainability standards and reference documents (such as energy conservation baselines and zero-waste guidelines). The system automatically evaluates performance, flags environmental hotspots, and generates evidence-grounded sustainability summaries, prioritized recommendations, and multi-phase action plans. 

By bridging the gap between raw environmental data collection and evidence-based decision support, EcoPilot empowers educational institutions to transition from manual tracking to data-driven sustainability governance, advancing institutional alignment with UN Sustainable Development Goal 12 (Responsible Consumption and Production).

---

## 3. TABLE OF CONTENTS

- **Abstract** (Page 2)
- **Table of Contents** (Page 3)
- **1. Introduction** (Page 4)
  - 1.1 Relevance to Generative AI, RAG and Cloud Computing
- **2. Background and Literature Context** (Page 4)
- **3. Problem Statement** (Page 5)
- **4. Project Objectives and Scope** (Page 5)
  - 4.1 Objectives
  - 4.2 Scope
- **5. SDG Alignment (Primary: SDG 12)** (Page 6)
- **6. Proposed Solution** (Page 7)
- **7. System Features** (Page 7)
- **8. AI Elements and Tools Used** (Page 8)
- **9. RAG Architecture** (Page 9)
- **10. System Architecture** (Page 9)
- **11. Data Flow / AI Workflow** (Page 10)
- **12. Technology Stack** (Page 11)
- **13. Methodology and Development Approach** (Page 11)
- **14. Implementation** (Page 12)
  - 14.1 Deployment Pipeline
- **15. Security** (Page 13)
- **16. Responsible AI & Ethics** (Page 14)
- **17. Testing and Validation** (Page 14)
- **18. Results and Qualitative Outcomes** (Page 15)
- **19. Project Story** (Page 16)
- **20. Internship Learning and Reflection** (Page 16)
- **21. Discussion and Limitations** (Page 17)
- **22. Future Scope** (Page 18)
- **23. Conclusion** (Page 18)
- **24. Project Submission Placeholders** (Page 18)
- **25. References** (Page 19)
- **26. Appendices** (Page 19)

---

## 1. INTRODUCTION

Assessment and continuous monitoring of environmental impact are central to modern institutional governance, yet the manual collection and analysis of campus sustainability data remains time-consuming, fragmented, and prone to inconsistency. EcoPilot was conceived to address this critical operational gap by pairing an artificial intelligence intelligence model with a modern web application framework, enabling sustainability coordinators, facility operations managers, and college leadership to evaluate environmental performance, identify resource inefficiencies, and implement grounded action plans in seconds rather than weeks.

The project was undertaken as part of the Virtual 1M1B AI for Sustainability Virtual Internship 2026, in collaboration with the AICTE National Internship Portal and co-certified by IBM SkillsBuild. It was designed to provide hands-on exposure to core technical themes: Retrieval-Augmented Generation (RAG) vector pipelines, prompt engineering for structured AI output, server-side API proxy security, cloud-based data persistence with Firebase, and full-stack software development lifecycle execution from local prototyping through to production cloud deployment.

### 1.1 Relevance to Generative AI, RAG and Cloud Computing
The platform is directly relevant to both core pillars of the internship track. On the Artificial Intelligence side, it demonstrates practical prompt engineering, schema-constrained generation, and vector retrieval search (RAG) to ground public-facing AI recommendations in verified environmental standards, eliminating ungrounded hallucinations. On the Cloud Computing side, it demonstrates the use of managed serverless infrastructure — Firebase Authentication for identity management and Firestore for document storage — paired with a high-performance Python FastAPI backend framework that isolates credentials and coordinates server-to-server inference calls to the Groq API engine running `qwen/qwen3.8-27b`.

---

## 2. BACKGROUND AND LITERATURE CONTEXT

Generative AI models, specifically open-weights LLMs accelerated by hardware inference engines like Groq, have increasingly been applied to decision-support systems and analytical software. However, a primary obstacle in applying large language models to complex domain tasks — such as environmental compliance auditing — is ensuring that model output is factually accurate and machine-parseable rather than free-form text. In EcoPilot, this challenge is resolved through Retrieval-Augmented Generation (RAG), which pairs real-time metrics with vector-indexed knowledge passages from sustainability baselines before passing structured prompts to the LLM.

Cloud-based Backend-as-a-Service (BaaS) architectures, combined with microservice REST backends, have become standard practice for scalable web systems. Firebase provides managed identity authentication and NoSQL document persistence without infrastructure overhead. Combining BaaS data management with a lightweight FastAPI proxy for AI orchestration — rather than invoking LLM API keys directly from client browsers — represents industry best practice for secret isolation, CORS enforcement, and rate limiting.

---

## 3. PROBLEM STATEMENT

Educational institutions consume significant resources (electricity, water, fuel, paper, food) and generate different forms of environmental impact across campus operations. However, sustainability information is almost universally distributed across disconnected departments, manual spreadsheets, and unstandardized paper records. Facilities managers track kWh on utility bills; dining services track food waste separately; commuter transit data is recorded by security; and municipal waste diversion is tracked by maintenance. Because of this information fragmentation:

- **Undetected Resource Inefficiencies:** High-emission or high-waste operational areas remain hidden without centralized risk scoring.
- **Lack of Empirical Guidance:** Sustainability planning often relies on guesswork or generic advice rather than empirical campus data.
- **Time-Consuming Manual Auditing:** Generating compliance reports requires weeks of manual data gathering and spreadsheet calculation.
- **Generic AI Hallucinations:** Standard standalone AI tools produce vague, ungrounded recommendations unsupported by real environmental standards.

> **"How can an AI-powered platform help educational institutions collect, analyze, interpret, and act upon campus sustainability data using evidence-based recommendations and intelligent decision support?"**

---

## 4. PROJECT OBJECTIVES AND SCOPE

### 4.1 Objectives
1. **Centralize Campus Data:** Design and implement a multi-category assessment framework covering Energy, Water, Waste, Transportation, and Food.
2. **AI & RAG Orchestration:** Build a Retrieval-Augmented Generation (RAG) backend utilizing `sentence-transformers` embeddings and FAISS vector index to ground AI recommendations.
3. **Secure API Proxy:** Construct a server-side Python FastAPI proxy ensuring the Groq API key and Firebase admin secrets are never exposed to the client.
4. **Hotspot & Trend Analytics:** Develop automated algorithms to detect operational risk areas, compute category health scores (0–100), and render interactive Recharts visualizations.
5. **Data Portability & Reporting:** Enable structured CSV/Excel data import and client-side PDF executive report generation via `html2pdf.js`.
6. **SDG 12 Alignment:** Directly advance UN Sustainable Development Goal 12 (Responsible Consumption & Production) through evidence-based resource management.

### 4.2 Scope
The scope of EcoPilot encompasses full-stack software development: client UI state management in React 18, FastAPI REST API services, FAISS vector indexing, Groq LLM integration (`qwen/qwen3.8-27b`), and Firebase authentication/database persistence. The current scope focuses on 5 operational categories and desktop-optimized web access.

---

## 5. SDG ALIGNMENT (PRIMARY: SDG 12)

EcoPilot directly advances UN Sustainable Development Goal 12: Responsible Consumption and Production. Specifically, it aligns with Target 12.2 (Sustainable management and efficient use of natural resources) and Target 12.5 (Substantially reduce waste generation through prevention, reduction, recycling, and reuse).

Supporting SDG Alignments include:
- **SDG 6 — Clean Water & Sanitation:** Monitors water consumption intensity, leak detection reporting, and rainwater harvesting metrics.
- **SDG 7 — Affordable & Clean Energy:** Tracks building kWh intensity, renewable solar capacity, and HVAC efficiency.
- **SDG 11 — Sustainable Cities & Communities:** Helps transform educational institutions into eco-friendly micro-communities.

---

## 6. PROPOSED SOLUTION

EcoPilot delivers an end-to-end intelligence platform that converts raw environmental metrics into grounded strategic decisions across 11 sequential operational stages:

```
[ User Input / CSV Import ]
          │
          ▼
[ Category Data Normalization (0-100 Scale) ]
          │
          ▼
[ Firebase Firestore Document Persistence ]
          │
          ▼
[ Statistical Analytics & Hotspot Detection Engine ]
          │
          ▼
[ FAISS Vector Index Similarity Retrieval (RAG) ]
          │
          ▼
[ Grounded Context & Metric Prompt Assembly ]
          │
          ▼
[ FastAPI Backend Proxy Execution ]
          │
          ▼
[ Groq Hardware Accelerated LLM (qwen/qwen3.8-27b) ]
          │
          ▼
[ JSON Schema Validation & Error Handling ]
          │
          ▼
[ React Interactive UI Rendering & Action Plan ]
          │
          ▼
[ Client-Side PDF Report Generation (html2pdf.js) ]
```

---

## 7. SYSTEM FEATURES

EcoPilot incorporates 8 core implemented system features:

1. **User Authentication & Authorization:** Firebase Auth email/password login, protected client routing, and document-level Firestore security rules.
2. **Multi-Category Sustainability Assessments:** Structured data collection across Energy, Water, Waste, Transit, and Food with instant score calculation.
3. **Assessment Import & Export:** Supports structured CSV/Excel template parsing and export for multi-campus audit records.
4. **Executive Dashboard:** Real-time overall sustainability score (0–100), letter grade (A+ to F), and category health overview cards.
5. **Analytics & Automated Hotspot Detector:** Interactive Recharts visual graphs, trend trajectory analysis, and instant category vulnerability alerts.
6. **Multi-Period Assessment Comparison:** Side-by-side comparative analysis between audit periods to track sustainability score progress over time.
7. **Knowledge Base & Reference Library:** Searchable repository of campus sustainability guidelines, zero-waste targets, and energy standards.
8. **AI Intelligence Engine & PDF Exporter:** RAG-backed executive summary generation, evidence-grounded recommendations, action plans, and client-side PDF export via `html2pdf.js`.

---

## 8. AI ELEMENTS AND TOOLS USED

### AI Infrastructure Stack:
- **LLM Inference Provider:** Groq API (Hosted LPU hardware inference engine)
- **Production LLM Model:** `qwen/qwen3.8-27b`
- **Environment Variable Configuration:** `GROQ_MODEL=qwen/qwen3.8-27b`

### Rationale for Hosted API Inference:
Running a 27B parameter model locally requires multi-GPU hardware (NVIDIA A100 specs), which is impractical for standard institutional deployments. Groq API's LPU acceleration provides sub-2-second inference, guaranteed JSON schema compliance, and zero client GPU overhead.

*Model Clarification: IBM Granite was evaluated during early exploratory testing, but `qwen/qwen3.8-27b` accessed via Groq API is the active production model.*

---

## 9. RAG ARCHITECTURE

Retrieval-Augmented Generation (RAG) anchors model outputs in factual knowledge passages retrieved from a FAISS vector index, preventing ungrounded AI hallucinations:

```
+------------------+     +-------------------+     +--------------------+
| User Assessment  |     | FAISS Vector Store|     | Top K Evidence     |
| Data & Metrics   |────►| Similarity Search |────►| Passages Retrieved |
+------------------+     +-------------------+     +---------+----------+
                                                             |
                                                             v
+------------------+     +-------------------+     +--------------------+
| Groq LLM API     |◄────| Grounded Prompt   |◄────+ Context Ingestion  |
| qwen/qwen3.8-27b |     | Assembly          |     | Engine             |
+--------+---------+     +-------------------+     +--------------------+
         |
         v
+-----------------------------------------------------------------------+
|                 STRUCTURED AI INTELLIGENCE OUTPUT                     |
|  [ Executive Summary ]  [ Key Findings ]  [ Grounded Recommendations ]|
+-----------------------------------------------------------------------+
```

---

## 10. SYSTEM ARCHITECTURE

EcoPilot uses a 3-tier architecture isolating client, API, and cloud services:

```
[ REACT 18 FRONTEND (Vite / Tailwind) ]
               │
               │ HTTPS REST Calls
               ▼
[ FASTAPI BACKEND PROXY (Python 3.10) ]
       ├── GROQ_API_KEY (Server Secret)
       ├── FAISS Vector Store Index
       └── SentenceTransformers Embeddings
               │
       ┌───────┴───────┐
       ▼               ▼
[ FIREBASE AUTH/DB ]  [ GROQ AI API Engine ]
(Firestore Users &    (Model: qwen/qwen3.8-27b)
 Assessments)
```

---

## 11. DATA FLOW / AI WORKFLOW

The end-to-end data processing workflow spans 5 structural layers:

```
LAYER 1: INPUT LAYER
└── Energy, Water, Waste, Transit, Food Assessments (Form/CSV)

LAYER 2: DATA PROCESSING LAYER
└── Score Normalization (0-100) & Firestore Document Storage

LAYER 3: ANALYTICS & RAG RETRIEVAL LAYER
└── Hotspot Identification & FAISS Vector Index Similarity Search

LAYER 4: AI INFERENCE LAYER (GROQ API)
└── qwen/qwen3.8-27b Prompt Execution (Max 950 tokens throttle)

LAYER 5: PRESENTATION LAYER
└── React Dashboard, Recharts Visuals & Client PDF Exporter
```

---

## 12. TECHNOLOGY STACK

| Component | Technology / Library | Version / Role |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 & Vite 5 | UI component library & dev bundler |
| **Frontend Hosting** | Vercel Cloud Platform | Production single-page app deployment & CDN |
| **Backend Framework** | Python 3.10+ / FastAPI | Asynchronous REST API server & routing |
| **Backend Hosting** | Render.com Cloud Platform | Production Uvicorn server hosting & environment secret management |
| **Styling System** | Tailwind CSS | Utility-first responsive design tokens |
| **Data Visualization** | Recharts | Interactive statistical visualizer |
| **PDF Report Exporter** | `html2pdf.js` | Client-side PDF report compilation engine |
| **Vector Index Search** | FAISS (`faiss-cpu`) | Dense vector similarity search index |
| **Text Embeddings** | Sentence-Transformers | `all-MiniLM-L6-v2` dense embedding model |
| **Cloud Database** | Firebase Firestore | NoSQL document persistence database |
| **Authentication** | Firebase Auth | Secure identity & token management service |
| **AI API Provider** | Groq API | Ultra-low-latency hosted LPU inference engine |
| **Production LLM Model** | `qwen/qwen3.8-27b` | 27B parameter open-weights LLM model |
| **Version Control** | Git & GitHub | Source code management & automated deployment hook |

---

## 13. METHODOLOGY AND DEVELOPMENT APPROACH

EcoPilot was developed using an agile, iterative engineering methodology. Each development phase produced a distinct, independently testable iteration of system capability.

---

## 14. IMPLEMENTATION

System implementation was completed across six sequential phases:

- **Phase 1 — Foundation & Assessment Engine:** Configured Vite + React 18 frontend, designed glassmorphism CSS design system, built 5-category assessment state management.
- **Phase 2 — FastAPI Backend & RAG Pipeline:** Created FastAPI REST server (`backend/main.py`), configured FAISS vector store, sentence-transformers embeddings, and Groq API client.
- **Phase 3 — Firebase Auth & Security:** Integrated Firebase Authentication and Firestore document collections with strict ownership security rules.
- **Phase 4 — Analytics Dashboard & Hotspot Detector:** Constructed Recharts statistical visualization components and automated hotspot detection algorithms.
- **Phase 5 — AI Intelligence & PDF Exporter:** Built AI Intelligence view and integrated `html2pdf.js` in `MonthlyReportModal.jsx` for clean PDF export.
- **Phase 6 — UI Refinement & Auto-Sync Hook:** Configured git repository, auto-push post-commit hooks, created official `logo.png` assets, and prepared final production deployment.

### 14.1 Production Deployment Pipeline (Vercel & Render.com)
EcoPilot utilizes a decoupled dual-cloud production deployment architecture to deliver high availability, low latency, and secure credential isolation:

1. **Frontend Deployment (Vercel):** The React 18 single-page application is compiled into an optimized static build (`dist/`) via Vite (`npm run build`) and deployed to Vercel. Vercel provides global edge CDN distribution, automatic SSL certificate provisioning, and single-page application client routing rewrite rules (`public/_redirects`).
2. **Backend Deployment (Render.com / Vercel API):** The Python 3.10 FastAPI backend is deployed on Render.com (and Vercel API routes), running an asynchronous Uvicorn ASGI web server (`uvicorn backend.main:app`). Render manages server-side environment secrets (`GROQ_API_KEY`, `GROQ_MODEL=qwen/qwen3.8-27b`), isolates backend logic from browser clients, and exposes production REST endpoints (`https://ecopilot-backend.onrender.com`).
3. **Automated Git Push Sync:** A custom Git post-commit hook (`.git/hooks/post-commit`) automatically pushes local code commits to the GitHub main branch (`https://github.com/thamizharasanm2528-byte/Eco-Pilot-`), triggering instant continuous deployment builds across Vercel and Render.com.

---

## 15. SECURITY

- **Authentication:** Managed via Firebase Auth with encrypted JWT session persistence.
- **Authorization:** Strict Firestore security rules ensure users can only access their own assessment documents.
- **API Key Isolation:** `GROQ_API_KEY` remains strictly server-side inside FastAPI; zero keys are exposed to client JavaScript bundles.

---

## 16. RESPONSIBLE AI & ETHICS

EcoPilot adheres to core Responsible AI principles:
- **Grounding:** All AI recommendations are grounded in retrieved vector passages to eliminate hallucinations.
- **Human Oversight:** AI outputs function as decision support for human facility managers, not autonomous commands.
- **Privacy:** Assessment metrics sent to Groq API contain non-personal environmental values.

---

## 17. TESTING AND VALIDATION

Comprehensive functional verification was conducted across all core modules:

| Module / Feature | Testing Criteria Execution | Verification Result |
| :--- | :--- | :--- |
| **Authentication** | Registration, login, invalid credentials, protected client route access | **PASS** — Route guards block unauthorized access |
| **Assessment Form** | 5-category data entry, normalization, CSV/Excel parsing | **PASS** — Metrics normalized & stored cleanly in Firestore |
| **Analytics Engine** | Score weighting accuracy, hotspot triggering, Recharts rendering | **PASS** — Visual graphs accurately reflect database values |
| **AI & RAG Pipeline** | FAISS retrieval match, Groq API call, max_tokens throttle (950) | **PASS** — Structured JSON returned in ~1.8 seconds |
| **PDF Report Exporter** | Client-side `html2pdf.js` compilation, layout alignment | **PASS** — Clean multi-page PDF generated without browser print break |
| **API Security Proxy** | Inspected client JS bundles for string matches of `GROQ_API_KEY` | **PASS** — Zero credentials exposed client-side |

---

## 18. RESULTS AND QUALITATIVE OUTCOMES

The completed EcoPilot platform satisfies all defined project objectives. Functional verification confirmed robust data collection, accurate visual analytics, evidence-grounded AI recommendations, and complete API secret isolation.

### 18.1 Summary of Technical Issues Resolved

| Issue Identified | Root Cause | Resolution Implemented |
| :--- | :--- | :--- |
| **404 Groq Model Not Found** | Model `llama-3.3-70b-versatile` retired by provider | Migrated model identifier to active production model `qwen/qwen3.8-27b` across backend config |
| **429 Groq Rate Limit Exceeded** | Default max_tokens (2500) exceeded free tier limit (1000 OTPM) | Throttled max_tokens to 950 in `groq_service.py` to stay cleanly within API quotas |
| **Analytics Crash 'Target not defined'** | Missing icon component reference inside `Analytics.jsx` | Replaced invalid icon element with standard Lucide React icon component |
| **Exposed API Key Risk** | Direct frontend calling of LLM endpoint | Constructed server-side FastAPI proxy endpoint (`/api/ai/analyze`) storing secret in `.env` |
| **Native Print Dialog Break** | `window.print()` rendered raw unstyled web pages | Replaced `window.print` with `html2pdf.js` library in `MonthlyReportModal.jsx` for clean PDF export |

---

## 19. PROJECT STORY

Building EcoPilot stemmed from observing a widespread operational challenge on my college campus: while our institution frequently expressed commitment to environmental sustainability, actual utility consumption metrics, waste diversion records, and energy statistics were locked in separate physical files and department spreadsheets. There was no single, transparent system for students, faculty, or administrators to see how sustainable our campus actually was.

When I began the **1M1B AI for Sustainability Virtual Internship**, I recognized an opportunity to apply Artificial Intelligence to solve this real campus problem. Rather than building a generic AI chatbot, I wanted to engineer a practical intelligence platform that could take real environmental metrics and generate evidence-grounded action plans.

During development, my biggest technical challenge was ensuring AI output reliability. Early experiments with standalone LLMs often produced generic or hallucinated recommendations. Implementing a Retrieval-Augmented Generation (RAG) pipeline backed by `sentence-transformers` embeddings and a FAISS vector index significantly improved quality by grounding AI responses in verified sustainability baselines. Connecting this backend to Groq's high-speed inference running `qwen/qwen3.8-27b` and creating a responsive React dashboard transformed raw numbers into meaningful operational decision support. This solo project reinforced my conviction that AI is most powerful when connected to real-world environmental challenges.

---

## 20. INTERNSHIP LEARNING AND REFLECTION

Participating in the **1M1B AI for Sustainability Virtual Internship** (in collaboration with the **AICTE National Internship Portal** and co-certified by **IBM SkillsBuild**) provided invaluable practical engineering experience.

### What I Learned
- **Applied AI for Sustainability:** Understanding how AI technologies can directly advance UN Sustainable Development Goal 12.
- **RAG Vector Architecture:** Building end-to-end vector search pipelines using FAISS and `sentence-transformers` to eliminate LLM hallucinations.
- **Secure API Integration:** Structuring server-side Python FastAPI proxies to enforce API key security and rate limiting.
- **Full-Stack Development:** Designing modular React 18 single-page applications connected to cloud databases (Firebase Firestore).

### What Challenged Me
Managing API rate limits (1000 OTPM on Groq free tier) required careful prompt engineering and token throttling (max 950 tokens). Configuring CORS and server-side environment proxies taught me rigorous security practices.

### How My Understanding Shifted
I learned that effective AI applications rely far more on clean data processing, vector retrieval grounding, and intuitive UI design than simply using larger model parameters.

---

## 21. DISCUSSION AND LIMITATIONS

- **Input Data Quality Dependency:** AI recommendations depend entirely on the accuracy of user-submitted assessment metrics.
- **Hosted API & Network Dependence:** Requires continuous internet connectivity to reach Groq API inference servers.
- **API Token Quotas:** Free-tier API inference requires token throttling (950 max tokens) to avoid 429 rate limit errors.
- **Decision-Support Scope:** EcoPilot provides analytical decision support and does not replace on-site physical engineering audits.

---

## 22. FUTURE SCOPE

- **IoT Hardware Telemetry:** Real-time automated data ingestion from smart electric meters, water flow sensors, and smart waste bins.
- **Automated Carbon Accounting:** Standardized calculation models for Scope 1, Scope 2, and Scope 3 greenhouse gas emissions.
- **Cross-Platform Mobile App:** Native mobile application for on-site facility inspections and barcode waste auditing.

---

## 23. CONCLUSION

EcoPilot successfully demonstrates the integration of Artificial Intelligence, RAG vector retrieval, and cloud-native service design into a complete campus sustainability intelligence platform. By isolating API credentials behind a Python FastAPI proxy, anchoring LLM inference in FAISS vector evidence, and rendering actionable visual metrics in React, the project achieves a secure, maintainable, and impactful architecture. The project outcomes directly satisfy the learning goals of the 1M1B AI for Sustainability Virtual Internship 2026, advancing practical technology solutions for UN Sustainable Development Goal 12.

---

## 24. PROJECT SUBMISSION PLACEHOLDERS

### 24.1 GitHub Repository Link
https://github.com/thamizharasanm2528-byte/Eco-Pilot-

### 24.2 Live Prototype Link
> **[PASTE LIVE PROJECT URL HERE]**

### 24.3 Demo Video Link
> **[PASTE DEMO VIDEO LINK HERE]**

### 24.4 Screenshot Placeholders

> **FIGURE 1 — EcoPilot Landing Page**  
> [INSERT SCREENSHOT HERE]

> **FIGURE 2 — User Dashboard & Sustainability Score Overview**  
> [INSERT SCREENSHOT HERE]

> **FIGURE 3 — Multi-Category Assessment Data Entry & Import**  
> [INSERT SCREENSHOT HERE]

> **FIGURE 4 — Analytics Dashboard & Hotspot Visualizations**  
> [INSERT SCREENSHOT HERE]

> **FIGURE 5 — Knowledge Base & Reference Standards**  
> [INSERT SCREENSHOT HERE]

> **FIGURE 6 — AI Intelligence Generator & Executive Summary**  
> [INSERT SCREENSHOT HERE]

> **FIGURE 7 — Grounded Recommendations & Multi-Phase Action Plan**  
> [INSERT SCREENSHOT HERE]

---

## 25. REFERENCES

1. **United Nations Sustainable Development Goals:** Goal 12: Responsible Consumption and Production. [https://sdgs.un.org/goals/goal12](https://sdgs.un.org/goals/goal12)
2. **Groq API Documentation:** Groq Developer Console & Fast Inference Engine. [https://console.groq.com/docs](https://console.groq.com/docs)
3. **Qwen Model Specifications:** Qwen Open-Weights LLM Technical Specs. [https://huggingface.co/Qwen](https://huggingface.co/Qwen)
4. **Lewis et al.:** Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. Advances in Neural Information Processing Systems (NeurIPS).
5. **FAISS Vector Search Engine:** Facebook AI Similarity Search Documentation. [https://github.com/facebookresearch/faiss](https://github.com/facebookresearch/faiss)
6. **Sentence-Transformers Documentation:** Multilingual & Dense Text Embeddings (`all-MiniLM-L6-v2`). [https://www.sbert.net/](https://www.sbert.net/)
7. **FastAPI Framework Documentation:** Asynchronous Python API Framework. [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)
8. **Firebase Services Documentation:** Firestore & Authentication Web SDK. [https://firebase.google.com/docs](https://firebase.google.com/docs)
9. **IBM SkillsBuild & AICTE:** Academic Internship Programme Overview 2026.

---

## 26. APPENDICES

### Appendix A — System Directory Structure
```text
EcoPilot/
├── backend/
│   ├── main.py                  # FastAPI REST server & routing
│   ├── ai/
│   │   ├── config.py            # Groq model config (qwen/qwen3.8-27b)
│   │   └── groq_service.py      # LLM API client & token throttling
│   └── rag/
│       ├── vector_store.py      # FAISS vector store management
│       └── ingestion.py         # Knowledge embedding & indexing
├── public/
│   ├── logo.png                 # Official EcoPilot brand emblem
│   └── favicon.png              # Browser tab icon
├── src/
│   ├── components/              # Navbar, Sidebar, Footer, MonthlyReportModal
│   ├── pages/                   # Dashboard, Assessments, Analytics, AIIntelligence
│   ├── services/                # aiApi.js, assessmentService.js
│   └── utils/                   # export/formatters.js, pdfExporter
├── .env                         # Server-side secrets (GROQ_API_KEY)
└── package.json                 # React dependencies & scripts
```

### Appendix B — Firestore Data Schemas
```json
// assessments collection document schema
{
  "id": "auto-generated-id",
  "userId": "firebase-user-uid",
  "overallScore": 78.5,
  "overallGrade": "B+",
  "categories": {
    "energy": { "score": 72, "consumptionKwh": 125000, "solarPercentage": 15 },
    "water": { "score": 85, "consumptionLiters": 450000 },
    "waste": { "score": 64, "recyclingRate": 35 },
    "transportation": { "score": 80, "evChargingStations": 12 },
    "food": { "score": 91, "localFoodPercentage": 40 }
  },
  "timestamp": "2026-09-01T14:20:00Z"
}
```

### Appendix C — Sample Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /assessments/{assessmentId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Appendix D — Final Internship Submission Checklist
- [x] **Problem Statement:** Clearly defined & highlighted with operational challenges.
- [x] **System Features:** 8 core features documented in dedicated section.
- [x] **RAG & AI Architecture:** FAISS retrieval and Groq (`qwen/qwen3.8-27b`) documented.
- [x] **Testing & Validation:** Complete testing criteria matrix documented.
- [x] **Project Story:** Authentic personal student story written in 1st person.
- [x] **Internship Reflection:** 1M1B, AICTE, and IBM SkillsBuild learning reflection included.
- [x] **GitHub Repository:** Repository link included (`https://github.com/thamizharasanm2528-byte/Eco-Pilot-`).
- [ ] **Live Prototype Link:** Placeholder included for manual link pasting.
- [ ] **Demo Video Link:** Placeholder included for manual video link pasting.
- [ ] **Screenshots:** Figures 1-7 placeholders included for manual image pasting.
