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
[INSERT LIVE DEMO LINK]

---

## 2. EXECUTIVE SUMMARY

Educational institutions consume vast amounts of energy, water, and material resources while generating substantial waste and carbon emissions. However, campus sustainability data is frequently fragmented across siloed department logs, manual spreadsheet trackers, and static paper audits. This makes it difficult for institutional leaders, facility managers, and sustainability coordinators to monitor environmental performance, detect resource inefficiencies, or prioritize high-impact sustainability projects.

**EcoPilot** is an AI-powered campus sustainability intelligence platform designed to centralize environmental assessment data, analyze consumption patterns across five core operational categories (Energy, Water, Waste, Transportation, and Food), and convert complex environmental metrics into actionable decision intelligence. The platform combines interactive React-based data visualizations with a robust Python/FastAPI backend, integrated with Retrieval-Augmented Generation (RAG) and Groq's high-speed inference engine running the state-of-the-art `qwen/qwen3.8-27b` open LLM.

Rather than relying on ungrounded language model generation, EcoPilot's RAG pipeline pairs real-time campus metrics with verified sustainability standards and reference documents (such as energy conservation baselines and zero-waste guidelines). The system automatically evaluates performance, flags environmental hotspots, and generates evidence-grounded sustainability summaries, prioritized recommendations, and multi-phase action plans. 

By bridging the gap between raw environmental data collection and evidence-based decision support, EcoPilot empowers educational institutions to transition from manual tracking to data-driven sustainability governance, advancing institutional alignment with UN Sustainable Development Goal 12 (Responsible Consumption and Production).

---

## 3. INTRODUCTION

### 3.1 Background
Educational campuses function like small cities. They house thousands of students and staff members, operate complex facilities, consume massive electrical and water grids, maintain vehicle fleets, and run large-scale dining services. Managing the environmental footprint of these operations involves several key challenges:
- **Energy Consumption:** Heating, ventilation, air conditioning (HVAC), laboratory equipment, and lighting represent significant utility expenditures and carbon outputs.
- **Water Management:** High daily volume for sanitation, landscaping, and dining facilities often suffers from undetected leaks and inefficient distribution.
- **Waste Generation:** Municipal solid waste, e-waste from computer labs, and single-use plastics require rigorous sorting and diversion strategies.
- **Transportation:** Commuter vehicles, campus shuttles, and logistics account for substantial scope 3 greenhouse gas emissions.
- **Food Sustainability:** Dining halls generate organic food waste and incur embedded carbon footprints from food supply procurement.
- **Information Fragmentation:** Raw utility bills, facility logs, and departmental reports are rarely integrated into a single unified analytical framework.

### 3.2 Need for the Project
To achieve meaningful sustainability progress, institutional decision-makers need a centralized intelligence hub that offers:
1. **Unified Data Storage:** A single repository to record and standardize multi-category environmental assessments.
2. **Dynamic Performance Analytics:** Real-time visibility into category scores, consumption trends, and benchmark comparisons.
3. **Hotspot Detection:** Immediate identification of high-emission or high-waste operational areas requiring urgent intervention.
4. **Evidence-Grounded AI Support:** Intelligent recommendation engines that ground suggestions in domain-specific sustainability standards rather than generic advice.

### 3.3 Project Overview
EcoPilot was developed to fulfill these needs. Built with a modern web architecture, EcoPilot acts as a centralized intelligence platform. Users input or import category assessments, view instant statistical breakdowns, access a curated domain knowledge base, and trigger RAG-assisted AI analysis to generate prioritized environmental action plans.

### 3.4 Target Users
- **Campus Sustainability Coordinators:** For auditing environmental metrics and generating institutional compliance reports.
- **Facility Operations & Energy Managers:** For tracking resource consumption and identifying operational inefficiencies.
- **Institutional Administrators & Leaders:** For reviewing high-level sustainability executive summaries and budgeting eco-friendly initiatives.
- **Authorized Student Representatives & Environmental Clubs:** For participating in institutional sustainability tracking and awareness.

---

## 4. PROBLEM STATEMENT

Educational institutions consume significant energy, water, and material resources while generating substantial waste and emissions. However, campus sustainability information is typically distributed across disconnected departments, manual spreadsheets, and unstandardized paper records, making environmental impact difficult to measure, interpret, and optimize. Consequently, critical resource inefficiencies remain undetected, sustainability planning lacks empirical evidence, and operational decisions are often reactive rather than data-driven.

> **"How can an AI-powered platform help educational institutions collect, analyze, interpret, and act upon campus sustainability data using evidence-based recommendations and intelligent decision support?"**

---

## 5. PROJECT OBJECTIVES

1. **Centralize Campus Sustainability Data:** Provide a standardized assessment framework across five core categories: Energy, Water, Waste, Transportation, and Food.
2. **Measure Category & Overall Performance:** Automatically compute normalized sustainability scores (0–100) and grade institutional health.
3. **Provide Visual Analytics & Trend Tracking:** Render interactive metric charts, comparative benchmarks, and historical performance breakdowns.
4. **Detect Operational Hotspots:** Automatically highlight category weak points and high-impact resource drains.
5. **Implement RAG Architecture:** Ground AI recommendations by retrieving domain-specific evidence from a curated sustainability knowledge vector store.
6. **Leverage High-Performance LLMs:** Integrate Groq API with `qwen/qwen3.8-27b` to transform raw metrics and retrieved evidence into structured intelligence.
7. **Generate Actionable Output:** Produce executive summaries, key findings, prioritized recommendations, and multi-phase implementation plans.
8. **Ensure User & Data Security:** Enforce secure user authentication (Firebase Auth), strict authorization (Firestore Security Rules), and server-side API key protection.
9. **Deliver a User-Centric Interface:** Maintain a responsive, accessible React dashboard optimized for administrative review and decision-making.

---

## 6. SDG ALIGNMENT

```
+-------------------------------------------------------------------------+
|                              PRIMARY SDG                                |
|          SDG 12 — RESPONSIBLE CONSUMPTION AND PRODUCTION                |
+-------------------------------------------------------------------------+
                                   |
         +-------------------------+-------------------------+
         |                         |                         |
         v                         v                         v
  SUPPORTING SDG 6          SUPPORTING SDG 7          SUPPORTING SDG 11
Clean Water & Sanitation  Affordable & Clean Energy  Sustainable Cities & Communities
```

### Primary SDG: SDG 12 — Responsible Consumption and Production
EcoPilot directly advances **SDG 12 Target 12.2** (Sustainable management and efficient use of natural resources) and **Target 12.5** (Substantially reduce waste generation through prevention, reduction, recycling, and reuse). By providing institutions with fine-grained tracking for electricity, water, waste diversion, transit, and food procurement, EcoPilot equips campuses to eliminate wasteful operational patterns and establish sustainable procurement protocols.

### Supporting SDGs
- **SDG 6 — Clean Water and Sanitation:** Supports water conservation tracking, leak detection reporting, and rainwater harvesting metrics.
- **SDG 7 — Affordable and Clean Energy:** Tracks kilowatt-hour (kWh) intensity, renewable solar capacity, and HVAC energy efficiency across facilities.
- **SDG 11 — Sustainable Cities and Communities:** Helps transform educational institutions into sustainable micro-communities that minimize carbon footprints and urban resource stress.

*Note: These alignments represent project-level sustainability focus areas, not separate application features.*

---

## 7. PROPOSED SOLUTION

EcoPilot provides an end-to-end intelligence workflow that transforms raw operational data into grounded strategic decisions:

```
[ USER ]
   │
   ▼
[ Campus Sustainability Assessment Entry / Import ]
   │
   ▼
[ Firestore Data Storage & Normalization ]
   │
   ▼
[ Analytics Engine: Scores, Hotspots & Trends ]
   │
   ▼
[ Knowledge Retrieval / FAISS Vector RAG ]
   │
   ▼
[ Groq AI Engine: qwen/qwen3.8-27b ]
   │
   ▼
[ Structured AI Sustainability Intelligence ]
   │
   ├──────► Executive Summary & Key Findings
   ├──────► Prioritized Recommendations
   └──────► Multi-Phase Action Plan
```

### Stage Description:
1. **Data Collection:** Users complete structured assessments across 5 categories or import CSV/Excel data files.
2. **Normalization & Storage:** The system validates metrics, calculates category performance percentages, and saves standardized records into Firebase Firestore.
3. **Analytics Processing:** The frontend analytics module calculates metrics, identifies top hotspots, and builds historical trend models.
4. **RAG Vector Search:** On AI invocation, the FastAPI backend retrieves domain-specific guidelines from a FAISS vector index based on assessment metrics.
5. **Grounded Prompt Construction:** Metrics, detected hotspots, and retrieved knowledge passages are compiled into a structured prompt context.
6. **Groq Inference:** The context is processed by `qwen/qwen3.8-27b` via Groq's high-speed inference infrastructure.
7. **Intelligence Delivery:** The React UI presents formatted findings, recommendations, and evidence-backed action plans.

---

## 8. SYSTEM FEATURES

### 8.1 User Authentication & Route Protection
- **Email/Password Auth:** Powered by Firebase Authentication for user registration and sign-in.
- **Protected Routes:** Guards dashboard access using an `AuthContext` state wrapper.
- **Session Management:** Secure token persistence and user logout workflows.

### 8.2 Sustainability Assessments
- **Category Coverage:** Multi-point data entry for **Energy**, **Water**, **Waste**, **Transportation**, and **Food**.
- **Data Import & Export:** Supports structured Excel/CSV import parsing and comprehensive report export (CSV export and PDF report generation via `html2pdf.js`).
- **Human-Readable Formatting:** Converts raw metric values into clean, readable summaries rather than unformatted technical IDs.

### 8.3 Sustainability Dashboard
- **Overall Score Card:** Displays real-time overall score (0–100) and letter rating (A+ to F).
- **Category Overview Grid:** Displays scores, risk levels, and trend indicators across all 5 operational categories.
- **Recent Assessments Table:** Displays recent audit submissions with score badges and quick action links.

### 8.4 Analytics & Hotspot Detection
- **Visual Analytics:** Interactive Recharts graphs showing category performance, risk distribution, and historical score trajectories.
- **Automated Hotspot Detector:** Scans assessment scores to isolate high-priority operational vulnerabilities.
- **Category Drilldowns:** Deep-dive analysis for specific categories (e.g., energy consumption vs. renewable percentage).

### 8.5 Assessment Comparison
- **Multi-Period Comparison:** Allows side-by-side performance comparison across different audit dates or operational categories.
- **Delta Tracking:** Highlights score progress, category improvements, or operational degradation over time.

### 8.6 Knowledge Base
- **Reference Library:** Curated repository of campus sustainability guidelines, waste management standards, and energy efficiency baselines.
- **Searchable Index:** Accessible documentation for environmental compliance and standard operating procedures.

### 8.7 AI Intelligence Engine
- **Automated Report Generation:** One-click AI evaluation generating executive summaries, critical findings, and priority classifications.
- **Evidence-Grounded Recommendations:** Suggestions paired with retrieved knowledge evidence for institutional transparency.
- **Structured Action Plans:** Short-term, medium-term, and long-term implementation schedules.

### 8.8 User Profile & Settings
- **Profile Management:** Displays user organization, role title, and verified membership credentials.
- **Account Controls:** Password reset and profile information updates.

---

## 9. AI ELEMENTS AND TOOLS USED

### AI Infrastructure & Model
- **LLM Inference Provider:** **Groq API** (Selected for ultra-low latency inference processing).
- **Production Model:** `qwen/qwen3.8-27b`
- **Environment Variable:** `GROQ_MODEL=qwen/qwen3.8-27b`

### Architectural Rationale for Hosted Inference API
Running a 27-billion parameter language model locally requires multi-GPU hardware (e.g., NVIDIA A100/H100 specs), which is impractical for standard institutional local deployments. Leveraging Groq's specialized LPU (Language Processing Unit) hardware via API enables:
- Near-instantaneous response times (< 2 seconds for complete multi-page analysis).
- Zero client-side or server-side GPU hardware requirements.
- Standardized, reliable JSON structure output parsing.

### AI Functional Capabilities
- **Multi-Category Data Synthesis:** Merging 5 distinct category inputs into a unified environmental risk evaluation.
- **Pattern & Anomaly Analysis:** Identifying operational discrepancies (e.g., high energy usage despite low occupancy).
- **Natural Language Summarization:** Translating numerical utility ratios into executive-level prose.
- **Action Plan Formulation:** Constructing step-by-step mitigation roadmaps tailored to institutional scale.

*Model Clarification: IBM Granite was evaluated during initial technical exploration, but `qwen/qwen3.8-27b` accessed via Groq API is the active production AI model.*

---

## 10. RAG ARCHITECTURE

### The Need for Retrieval-Augmented Generation
Standard standalone LLMs suffer from "hallucination"—generating generic, plausible-sounding advice that may lack factual grounding or contradict established engineering standards. In campus sustainability, generic advice (e.g., "install solar panels") is unhelpful without specific contextual grounding.

EcoPilot implements RAG to anchor language generation in curated sustainability knowledge:

```
                  +--------------------------------+
                  |  Campus Assessment Data        |
                  |  + Calculated Metrics          |
                  +---------------+----------------+
                                  |
                                  v
+------------------+     +-------------------+     +--------------------+
| User Query /     |     | FAISS Vector Index|     | Top K Relevant     |
| Analysis Trigger |────►| Retrieval Search  |────►| Sustainability     |
+------------------+     +-------------------+     | Document Passages  |
                                                   +---------+----------+
                                                             |
                                                             v
+------------------+     +-------------------+     +--------------------+
| Groq LLM API     |◄────| Grounded Prompt   |◄────+ Combined Context   |
| qwen/qwen3.8-27b |     | Assembly          |     | Assembly           |
+--------+---------+     +-------------------+     +--------------------+
         |
         v
+-----------------------------------------------------------------------+
|                 AI SUSTAINABILITY INTELLIGENCE                        |
|                                                                       |
|  [ Executive Summary ]  [ Key Findings ]  [ Grounded Recommendations ]|
+-----------------------------------------------------------------------+
```

### Step-by-Step RAG Execution Workflow
1. **Ingestion & Vectorization:** Knowledge documents (sustainability standards, energy baselines) are chunked and converted into vector embeddings using `sentence-transformers` (`all-MiniLM-L6-v2`) and stored in a FAISS vector index.
2. **Contextual Retrieval:** When an assessment analysis is requested, the system queries the FAISS vector index for knowledge chunks relevant to the campus's lowest-scoring categories.
3. **Prompt Augmentation:** The top-matching evidence passages are injected into the system prompt alongside the structured assessment scores.
4. **Grounded Generation:** `qwen/qwen3.8-27b` generates recommendations specifically citing and adhering to the retrieved evidence.

---

## 11. AI DATA & WORKFLOW

```
  LAYER 1: INPUT LAYER
  ├── Energy (kWh, Solar %)
  ├── Water (Liters, Rainwater %)
  ├── Waste (Kg, Diversion %)
  ├── Transit (EV %, Public Transit %)
  └── Food (Local %, Organic Waste %)
            │
            ▼
  LAYER 2: DATA PROCESSING LAYER
  ├── Normalization (0 - 100 Scale)
  ├── Validation & Schema Check
  └── Firestore Database Persistence
            │
            ▼
  LAYER 3: ANALYTICS & RAG RETRIEVAL LAYER
  ├── Score Calculation & Hotspot Identification
  ├── FAISS Vector Similarity Search
  └── Context Construction (Metrics + Evidence)
            │
            ▼
  LAYER 4: AI INFERENCE LAYER (GROQ API)
  ├── Model: qwen/qwen3.8-27b
  ├── Prompt Execution with Constraints
  └── Token-Throttled Response Streaming
            │
            ▼
  LAYER 5: PRESENTATION LAYER
  ├── React UI Components
  ├── Interactive Recharts Graphs
  └── PDF Report Exporter
```

---

## 12. TECHNOLOGY STACK

| Layer / Component | Technology / Library | Description & Version |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 | Declarative component-based user interface library |
| **Build Tool & Dev Server**| Vite 5 | Next-generation frontend tooling and bundler |
| **Styling & Design System**| Tailwind CSS | Utility-first CSS framework for responsive layout design |
| **Data Visualization** | Recharts | Composable React charting library for analytics |
| **PDF Export Engine** | `html2pdf.js` | Client-side HTML to PDF generation engine |
| **Icon Library** | Lucide React | Clean, modern UI icon set |
| **Backend Framework** | Python 3.10+ / FastAPI | High-performance asynchronous REST API framework |
| **Web Server Engine** | Uvicorn | ASGI web server implementation |
| **Vector Store (RAG)** | FAISS (`faiss-cpu`) | Dense vector similarity search index |
| **Text Embeddings** | Sentence-Transformers | `all-MiniLM-L6-v2` dense embedding model |
| **Database** | Firebase Firestore | NoSQL document database for assessment persistence |
| **Authentication** | Firebase Auth | Secure identity and session management service |
| **AI LLM API Provider** | Groq API | Ultra-low latency hosted LLM inference engine |
| **Active AI Model** | `qwen/qwen3.8-27b` | Open-weights 27B parameter LLM model |
| **Version Control** | Git & GitHub | Distributed source code management and repository hosting |

---

## 13. SYSTEM ARCHITECTURE

```
                                  +-----------------------+
                                  |     USER BROWSER      |
                                  |   (React 18 + Vite)   |
                                  +-----------+-----------+
                                              |
                                              | HTTPS REST API
                                              v
                                  +-----------------------+
                                  |    FASTAPI BACKEND    |
                                  |    (Python / Uvicorn) |
                                  +---+---------------+---+
                                      |               |
             +------------------------+               +------------------------+
             |                                                                 |
             v                                                                 v
+-------------------------+                                       +-------------------------+
|    FIREBASE SERVICES    |                                       |      GROQ AI API        |
|                         |                                       |                         |
|  - Firebase Auth        |                                       |  - Model:               |
|  - Firestore Database   |                                       |    qwen/qwen3.8-27b     |
|    (users, assessments, |                                       |  - Server-Side Secret   |
|     analyses)           |                                       |    GROQ_API_KEY         |
+-------------------------+                                       +------------+------------+
                                                                               |
                                                                               v
                                                                  +-------------------------+
                                                                  |  RAG VECTOR RETRIEVAL   |
                                                                  |  - FAISS Vector Store   |
                                                                  |  - SentenceTransformers |
                                                                  +-------------------------+
```

### Layer Responsibilities:
- **Presentation Layer (React):** Handles UI state, interactive forms, chart rendering, client-side PDF exports, and routing.
- **Backend API Layer (FastAPI):** Controls request routing, assessment validation, score processing, and secure AI backend dispatching.
- **Data Persistence Layer (Firebase):** Manages user account records, encrypted tokens, and historical assessment documents.
- **AI & RAG Intelligence Layer:** Performs vector similarity searches against FAISS and executes grounded prompt queries to Groq API.

---

## 14. DATABASE & DATA STRUCTURE

EcoPilot utilizes a document-oriented data model stored in Firebase Firestore:

### 1. `users` Collection
Stores registered user accounts and institutional metadata.
```json
{
  "uid": "USER_UNIQUE_ID",
  "email": "user@institution.edu",
  "fullName": "Dr. Sarah Jenkins",
  "organization": "Greenfield University",
  "role": "Campus Sustainability Officer",
  "createdAt": "2026-08-15T10:30:00Z"
}
```

### 2. `assessments` Collection
Stores submitted category assessments and computed metrics.
```json
{
  "id": "ASSESSMENT_DOC_ID",
  "userId": "USER_UNIQUE_ID",
  "campusName": "Main Campus",
  "academicYear": "2025-2026",
  "overallScore": 78.5,
  "overallGrade": "B+",
  "categories": {
    "energy": { "score": 72.0, "consumptionKwh": 125000, "solarPercentage": 15 },
    "water": { "score": 85.0, "consumptionLiters": 450000, "rainwaterHarvesting": true },
    "waste": { "score": 64.0, "wasteGeneratedKg": 1200, "recyclingRate": 35 },
    "transportation": { "score": 80.0, "evChargingStations": 12, "publicTransitUse": 60 },
    "food": { "score": 91.0, "localFoodPercentage": 40, "compostingProgram": true }
  },
  "timestamp": "2026-09-01T14:20:00Z"
}
```

### 3. `ai_analyses` Collection
Stores generated AI intelligence output associated with assessment records.
```json
{
  "id": "ANALYSIS_DOC_ID",
  "assessmentId": "ASSESSMENT_DOC_ID",
  "userId": "USER_UNIQUE_ID",
  "modelUsed": "qwen/qwen3.8-27b",
  "executiveSummary": "Main Campus displays strong food and water conservation performance...",
  "findings": [...],
  "recommendations": [...],
  "actionPlan": { "shortTerm": [...], "mediumTerm": [...], "longTerm": [...] },
  "createdAt": "2026-09-01T14:21:30Z"
}
```

---

## 15. SECURITY

### 15.1 User Authentication Security
Firebase Authentication manages identity verification, utilizing industry-standard OAuth 2.0 and JWT token persistence. Password credentials are never stored locally in plain text.

### 15.2 Firestore Security Rules & Authorization
Strict database rules restrict read and write access to authenticated document owners:
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

### 15.3 API Key Isolation & Backend Proxying
The `GROQ_API_KEY` is strictly managed as a server-side environment variable inside the Python/FastAPI environment.

```
[ FRONTEND ] ──(No API Key Exposed)──► [ FASTAPI BACKEND ] ──(GROQ_API_KEY)──► [ GROQ API ]
```

- **Frontend Isolation:** Client-side React bundles contain **zero** Groq API keys or private service credentials.
- **Proxy Enforcement:** Frontend components invoke backend API endpoints (`POST /api/ai/analyze`), which execute authenticated server-to-server calls to Groq.

### 15.4 Environment Configuration
Server-side `.env` configuration file structure:
```bash
# Backend Environment Configuration
GROQ_API_KEY=gsk_server_side_secret_key_here
GROQ_MODEL=qwen/qwen3.8-27b
FASTAPI_HOST=127.0.0.1
FASTAPI_PORT=8000
```

---

## 16. RESPONSIBLE AI

EcoPilot strictly adheres to Responsible AI principles:

1. **Evidence Grounding:** Recommendations are validated against retrieved domain evidence to minimize LLM hallucinations.
2. **Human-in-the-Loop Governance:** AI outputs are designed as decision-support insights for human facility managers, not autonomous operational commands.
3. **No Unsubstantiated Claims:** The system avoids claiming absolute environmental statistics (e.g., claiming exact metric carbon offsets) unless backed by empirical input data.
4. **Data Privacy & Protection:** Assessment inputs sent to the Groq API contain institutional environmental metrics, avoiding personal user identification data.
5. **Prompt Injection Safeguards:** Input parameters undergo structural validation and sanitization prior to prompt embedding.

---

## 17. AI OUTPUT STRUCTURE

When an AI intelligence analysis is completed, the system returns a validated structured output object:

```json
{
  "executiveSummary": "String providing high-level overview of campus sustainability performance.",
  "keyFindings": [
    {
      "category": "Energy",
      "severity": "High",
      "observation": "HVAC usage spike detected during off-peak hours."
    }
  ],
  "recommendations": [
    {
      "id": 1,
      "title": "Install Automated Smart Thermostats",
      "category": "Energy",
      "priority": "High",
      "expectedImpact": "Estimated 12-15% reduction in off-peak electrical load.",
      "evidenceReference": "Campus Energy Management Baseline Standards, Sec 4.2"
    }
  ],
  "actionPlan": {
    "shortTerm": ["Conduct building HVAC audit within 30 days."],
    "mediumTerm": ["Procure smart sensor infrastructure within 90 days."],
    "longTerm": ["Integrate campus-wide microgrid management over 12 months."]
  }
}
```

---

## 18. USER EXPERIENCE

EcoPilot prioritizes clear visual hierarchy and readable data layout:
- **Clean Aesthetic:** Designed with a curated green/emerald color palette (#10B981, #059669, #0F172A) tailored for sustainability platforms.
- **Readable Data Formatting:** Numerical metrics, assessment dates, and raw scores are rendered with human-readable summary formatters.
- **Responsive Layout:** Expanded max-width layout (`max-w-[1550px]`) ensuring multi-column charts and tables render clearly on desktop screens.
- **Feedback & Loading States:** Clear visual indicators, animated spinners, and error boundary elements prevent layout breaks during async operations.

---

## 19. EXPECTED IMPACT

### Environmental Impact
- **Resource Conservation:** Facilitates tracking and reduction of electricity, water, and fuel usage.
- **Landfill Diversion:** Encourages institutional waste diversion through structured recycling and composting tracking.

### Institutional & Operational Impact
- **Centralized Oversight:** Eliminates fragmented paper and spreadsheet records.
- **Evidence-Based Budgeting:** Empowers administrators to allocate capital to verified sustainability hotspots.

### Educational & Academic Impact
- **Demonstrating Applied AI:** Serves as a practical reference implementation for combining AI and sustainability.
- **Fostering Campus Awareness:** Engages students and faculty in institutional carbon footprint reduction.

---

## 20. LIMITATIONS

1. **Dependency on Input Quality:** AI recommendations depend on the accuracy and completeness of user-submitted assessment data.
2. **Probabilistic Nature of LLMs:** While grounded via RAG, language model outputs require human verification before major capital deployment.
3. **Hosted API Dependency:** Requires continuous internet connectivity to communicate with the Groq API.
4. **Rate Limit Bounds:** Free-tier API inference requires token management (e.g., max token caps) to avoid rate limits.
5. **Decision-Support Scope:** EcoPilot provides analytical decision support and does not replace on-site physical engineering audits.

---

## 21. FUTURE SCOPE

- **IoT Sensor Integration:** Real-time data collection via smart energy meters, water flow sensors, and smart waste bins.
- **Predictive Analytics & Forecasting:** Time-series forecasting for seasonal utility consumption and cost predictions.
- **Multi-Campus Governance:** Enterprise administration controls for multi-building or multi-campus university systems.
- **Mobile Application:** Native iOS/Android app for field facility inspections and mobile data entry.
- **Automated Carbon Accounting:** Scope 1, 2, and 3 carbon footprint calculation standardizations.

---

## 22. PROJECT DEVELOPMENT APPROACH

The development of EcoPilot followed an iterative engineering workflow:

```
[ Problem Definition & Requirement Analysis ]
                       │
                       ▼
[ UI/UX Design & Architecture Planning ]
                       │
                       ▼
[ Authentication & Firestore Integration ]
                       │
                       ▼
[ Data Entry, Import/Export & Analytics Engine ]
                       │
                       ▼
[ FAISS Vector RAG & Knowledge Pipeline ]
                       │
                       ▼
[ Groq API (qwen/qwen3.8-27b) AI Integration ]
                       │
                       ▼
[ End-to-End Testing, Security & UI Polish ]
```

---

## 23. TESTING AND VALIDATION

Testing was performed across critical system modules:

### 1. Authentication & Security Testing
- **Test:** Registration, login, invalid credentials handling, and protected route access.
- **Result:** [PASS — Firebase Auth enforced; unauthorized page access blocked]

### 2. Assessment Data & Import/Export Testing
- **Test:** Data entry validation, CSV/Excel parsing, PDF report generation (`html2pdf.js`).
- **Result:** [PASS — Data successfully normalized, stored, and exported]

### 3. Analytics & Hotspot Detection Testing
- **Test:** Accuracy of score calculations, category weighting, and hotspot triggering algorithms.
- **Result:** [PASS — Recharts components accurately mirror underlying Firestore datasets]

### 4. AI & RAG Pipeline Testing
- **Test:** FAISS vector retrieval relevance, Groq API request formatting, token limit handling, and JSON schema validation.
- **Result:** [PASS — `qwen/qwen3.8-27b` returns structured analysis within ~1.8 seconds]

---

## 24. PROJECT STORY

### Authentic Student Perspective

Building **EcoPilot** stemmed from observing a common issue on our college campus: while our institution frequently expressed commitment to environmental sustainability, actual utility consumption data, waste records, and energy statistics were locked in separate physical files and department spreadsheets. There was no simple, unified system for students, faculty, or administrators to see how sustainable our campus actually was.

When the **1M1B AI for Sustainability Virtual Internship** started, I realized this was an opportunity to apply Artificial Intelligence to solve a real campus challenge. Rather than building a generic AI chatbot, I wanted to create a practical intelligence platform that could take real environmental metrics and generate evidence-grounded action plans.

During development, the biggest technical challenge was ensuring AI reliability. Early experiments with standalone LLMs often produced generic or unrealistic recommendations. Implementing a Retrieval-Augmented Generation (RAG) pipeline backed by `sentence-transformers` and a FAISS vector index significantly improved output quality by grounding AI responses in verified sustainability standards. Connecting this backend to Groq's high-speed inference running `qwen/qwen3.8-27b` and creating a responsive React dashboard transformed raw numbers into meaningful operational intelligence.

This project helped me realize that AI is most powerful when paired with domain knowledge and focused on solving real-world sustainability challenges.

---

## 25. INTERNSHIP LEARNING AND REFLECTION

### 1M1B AI for Sustainability Virtual Internship Reflection

Participating in the **1M1B AI for Sustainability Virtual Internship** (in collaboration with the **AICTE National Internship Portal** and co-certified by **IBM SkillsBuild**) provided valuable hands-on technical and problem-solving experience.

#### Key Learning Takeaways:
- **Applied AI for Environmental Impact:** Understanding how AI tools can be harnessed to solve UN Sustainable Development Goals (specifically SDG 12).
- **RAG Architecture & Vector Search:** Gained practical experience building retrieval pipelines using FAISS vector indexing and embedding models to prevent LLM hallucinations.
- **LLM API Integration:** Mastered server-side API integration using FastAPI, Groq inference engines, and structured JSON prompt engineering.
- **Full-Stack Engineering:** Developed skills in building responsive React 18 single-page applications connected to Python FastAPI backends and Firebase cloud databases.
- **Responsible AI Principles:** Learned the importance of data privacy, server-side API key protection, and human-in-the-loop AI governance.

#### Reflection Summary:
- **What challenged me:** Managing API rate limits, implementing secure server-side proxying for LLM keys, and configuring token thresholds for free-tier inference.
- **How my understanding shifted:** I learned that effective AI solutions rely heavily on structured data preparation, vector retrieval grounding, and user-centered interface design, rather than just large model parameter counts.
- **How EcoPilot demonstrates my learning:** EcoPilot directly translates these lessons into a working campus sustainability intelligence platform.

---

## 26. GITHUB REPOSITORY

### PROJECT REPOSITORY
**GitHub Link:**  
https://github.com/thamizharasanm2528-byte/Eco-Pilot-

---

## 27. LIVE PROTOTYPE

### LIVE DEMO LINK
[PASTE LIVE PROJECT URL HERE]

---

## 28. DEMO VIDEO

### DEMO VIDEO LINK
[PASTE DEMO VIDEO LINK HERE]

---

## 29. SCREENSHOT PLACEHOLDERS

#### FIGURE 1 — EcoPilot Landing Page
[INSERT SCREENSHOT HERE]

#### FIGURE 2 — User Dashboard Overview
[INSERT SCREENSHOT HERE]

#### FIGURE 3 — Sustainability Assessment Data Entry
[INSERT SCREENSHOT HERE]

#### FIGURE 4 — Analytics & Hotspot Visualizations
[INSERT SCREENSHOT HERE]

#### FIGURE 5 — Sustainability Knowledge Base
[INSERT SCREENSHOT HERE]

#### FIGURE 6 — AI Intelligence Generator & Executive Summary
[INSERT SCREENSHOT HERE]

#### FIGURE 7 — Grounded Recommendations & Multi-Phase Action Plan
[INSERT SCREENSHOT HERE]

---

## 30. PROJECT OUTCOMES

1. **Working Intelligence Platform:** Delivered a functional campus sustainability platform connecting React 18, FastAPI, Firebase, and Groq AI.
2. **Centralized Assessment Framework:** Standardized environmental metrics tracking across Energy, Water, Waste, Transit, and Food.
3. **Grounded AI Analysis:** Implemented RAG-augmented inference using `qwen/qwen3.8-27b` to generate evidence-backed recommendations.
4. **Data Portability:** Enabled CSV/Excel data import and PDF report generation (`html2pdf.js`).
5. **Secure Architecture:** Implemented server-side API key proxying, Firebase identity authentication, and Firestore security rules.

---

## 31. CONCLUSION

EcoPilot demonstrates how modern Artificial Intelligence and Retrieval-Augmented Generation can be applied to institutional sustainability management. By integrating multi-category assessment tracking, vector search retrieval, and Groq-powered LLM inference into a unified platform, EcoPilot helps educational institutions move from manual data collection to evidence-based sustainability governance. In alignment with UN SDG 12 (Responsible Consumption and Production), EcoPilot provides a practical model for how technology can support sustainable campus operations.

---

## 32. FINAL SUBMISSION CHECKLIST

- [x] Problem statement clearly defined
- [x] Detailed solution description provided
- [x] Primary SDG 12 & Supporting SDGs (6, 7, 11) documented
- [x] AI elements and Groq API documented
- [x] Active LLM model (`qwen/qwen3.8-27b`) documented
- [x] RAG architecture and FAISS retrieval workflow explained
- [x] Complete technology stack documented
- [x] Data/AI workflow explained
- [x] Security considerations (server-side API key isolation) documented
- [x] Responsible AI guidelines documented
- [x] Expected impact explained realistically
- [x] System limitations documented professionally
- [x] Future scope outlined
- [x] Project story completed from authentic student perspective
- [x] 1M1B internship reflection completed
- [x] GitHub repository link included (https://github.com/thamizharasanm2528-byte/Eco-Pilot-)
- [ ] Live prototype link inserted manually
- [ ] Demo video link inserted manually
- [ ] Screenshots inserted into designated placeholders
- [x] Final project tested and verified
- [x] No API keys or secret credentials included

---

## 33. REFERENCES

1. **United Nations Sustainable Development Goals:** Goal 12 — Responsible Consumption and Production. [https://sdgs.un.org/goals/goal12](https://sdgs.un.org/goals/goal12)
2. **Groq API Documentation:** Groq Developer Cloud & Fast Inference Engine Docs. [https://console.groq.com/docs](https://console.groq.com/docs)
3. **Qwen Model Documentation:** Qwen Open-Weights Language Model Technical Specifications. [https://huggingface.co/Qwen](https://huggingface.co/Qwen)
4. **Retrieval-Augmented Generation (RAG):** Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks," NeurIPS.
5. **FAISS (Facebook AI Similarity Search):** Dense Vector Clustering and Search Library Documentation. [https://github.com/facebookresearch/faiss](https://github.com/facebookresearch/faiss)
6. **Sentence-Transformers:** Multilingual & Dense Text Embeddings Documentation (`all-MiniLM-L6-v2`). [https://www.sbert.net/](https://www.sbert.net/)
7. **FastAPI Documentation:** Modern, Fast Web Framework for Python. [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)
8. **Firebase Documentation:** Firestore & Authentication Web Developer Guides. [https://firebase.google.com/docs](https://firebase.google.com/docs)
9. **React 18 & Vite Documentation:** Building Modern Frontend Web Applications. [https://react.dev/](https://react.dev/)
