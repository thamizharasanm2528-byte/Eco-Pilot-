# EcoPilot – AI-Powered Sustainable Campus Decision-Making Platform

[![Phase 1 Foundation](https://img.shields.io/badge/EcoPilot-Phase%201%20Foundation-emerald.svg)](https://github.com/)
[![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-blue.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-009688.svg)](https://fastapi.tiangolo.com/)
[![Firebase](https://img.shields.io/badge/Database-Firebase%20Firestore-ffca28.svg)](https://firebase.google.com/)

EcoPilot is a modern web application built to help higher-education campuses understand sustainability challenges, measure environmental impact, and make data-driven decarbonization decisions.

> **Project Context**: EcoPilot is being developed as a project for an **AI for Sustainability Virtual Internship**. Phase 1 establishes a clean, production-quality, scalable foundation.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features (Phase 1)](#key-features-phase-1)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Environment Variables](#environment-variables)
6. [Firebase & Firestore Setup](#firebase--firestore-setup)
7. [Firestore Security Rules](#firestore-security-rules)
8. [Local Development & Startup](#local-development--startup)
   - [Frontend Startup](#1-frontend-startup)
   - [Backend Startup](#2-backend-startup)
9. [Verification & Testing Checklist](#verification--testing-checklist)
10. [Multi-Phase Future Roadmap](#multi-phase-future-roadmap)

---

## Project Overview

EcoPilot Phase 2 builds an **Advanced Sustainability Analytics Platform** powered by deterministic analytics, statistical trends, rule-based hotspot detection, period-over-period comparisons, KPI tracking, reference benchmarking, and CSV exports based on real Cloud Firestore user assessments.

> ⚠️ **Disclaimer Note**: "Phase 2 Advanced Analytics" calculations are deterministic prototype analytics and are not certified environmental audits. Results support decision-making but should not be treated as certified measurements.

---

## Phase 2 Features & Analytics Architecture

### 1. Analytics Engine Modules (`src/utils/analytics/`)
- **`metricDirection.js`**: Centralized configuration dictating directional evaluation (`lower_is_better` for consumption vs `higher_is_better` for renewables/recycling).
- **`trendAnalyzer.js`**: Chronological period analysis, percentage change calculation, and 2+ consecutive decline/improvement detection (using a 2% stability threshold).
- **`hotspotDetector.js`**: Rule-based hotspot priority ranking (`Critical`, `Needs Attention`, `Moderate`, `Strong`).
- **`kpiCalculator.js`**: 11 core campus KPIs tracking values, units, changes, and direction indicators.
- **`benchmarkCalculator.js`**: Gap calculation against "EcoPilot Reference Benchmark" (default target score: 75/100).
- **`insightGenerator.js`**: Prioritized deterministic insight feed (High, Medium, Low) and identification of Best vs Weakest Performing Categories.
- **`analyticsCalculator.js`**: Central aggregator returning a complete, null-safe analytics payload for any dataset size.

### 2. Client-Side CSV Export (`src/utils/csvExporter.js`)
- Exports user assessment history and computed analytics into a downloadable `.csv` file directly from the browser.

### 3. Advanced Analytics View (`/analytics`)
- **Data Completeness Analysis**: 0–100% completeness progress bar and 5-category checklist.
- **Overall Sustainability Trend**: Recharts `LineChart` tracking score progression across periods.
- **Category Benchmark Comparison**: Recharts `BarChart` comparing current category scores to the 75/100 target.
- **Period-over-Period Comparison Module**: Side-by-side metric comparison between any 2 selected periods.
- **Sustainability Hotspot Panel**: Priority-ranked critical and declining operational areas.
- **KPI Grid**: 11 compact indicators with trend status badge.

---

## Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **SDK**: Firebase Web SDK v10+

### Backend
- **Framework**: Python 3.10+ & FastAPI
- **Server**: Uvicorn
- **Validation**: Pydantic

### Database & Auth
- **Authentication**: Firebase Auth (Email/Password)
- **Database**: Firebase Firestore

---

## Project Structure

```
d:/ibm/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── routes/
│   │   ├── health.py
│   │   └── sustainability.py
│   └── services/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── MetricCard.jsx
│   │   ├── ChartCard.jsx
│   │   └── LoadingScreen.jsx
│   │
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Assessments.jsx
│   │   ├── Profile.jsx
│   │   └── Settings.jsx
│   │
│   ├── firebase/
│   │   ├── config.js
│   │   ├── auth.js
│   │   └── firestore.js
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env.example
├── .gitignore
├── firestore.rules
├── package.json
├── README.md
├── tailwind.config.js
└── vite.config.js
```

---

## Environment Variables

Copy `.env.example` to `.env` in the root directory:

```bash
cp .env.example .env
```

Populate `.env` with your actual Firebase Web app keys:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# FastAPI Backend Configuration
VITE_API_BASE_URL=http://localhost:8000
```

> ⚠️ **Note**: `.env` is ignored by Git and will never be committed to version control.

---

## Firebase & Firestore Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project named `ecopilot`.
2. Add a **Web App** to register your project and copy the configuration snippet.
3. Enable **Authentication** in the Firebase console:
   - Navigate to **Authentication** -> **Get Started** -> Enable **Email/Password**.
4. Enable **Cloud Firestore**:
   - Navigate to **Firestore Database** -> **Create database** -> Choose test/production mode.

---

## Firestore Security Rules

Deploy or copy the contents of `firestore.rules` into your Firebase Console -> Firestore -> Rules tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Users collection: users can read and write only their own document
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }

    // Assessments collection: users can read and create only their own assessments
    match /assessments/{assessmentId} {
      allow read, update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## Local Development & Startup

### Option A: Unified Launcher (Starts Both Frontend & Backend)

Run a single command from the project root:

```bash
npm run start
```
*or double-click / run:*
```bash
.\start.bat
```
*or via Python:*
```bash
python start.py
```

This concurrently launches:
- 🟢 **Frontend**: `http://localhost:3000` (or `http://localhost:5173`)
- 🔷 **Backend API**: `http://127.0.0.1:8000`

---

### Option B: Manual Separate Startup

#### 1. Frontend Startup

Install dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```

---

#### 2. Backend Startup

Navigate to backend dependencies or use python virtual environment:
```bash
pip install -r backend/requirements.txt
```

Run the FastAPI server with Uvicorn:
```bash
python -m uvicorn backend.main:app --reload --port 8000
```

Test endpoints:
- Health check: `GET http://localhost:8000/api/health`
- Sustainability roadmap: `GET http://localhost:8000/api/sustainability/status`

---

## Verification & Testing Checklist

- [x] `npm install` runs cleanly without dependency conflicts.
- [x] Vite dev server compiles without errors.
- [x] Landing page loads with proper responsive layouts and typography.
- [x] Email/password registration creates user in Auth & Firestore `users/{uid}`.
- [x] Sign in / Sign out flows redirect cleanly.
- [x] Authentication state survives browser refresh.
- [x] Protected routes redirect unauthenticated users to `/login`.
- [x] Dashboard metric cards and Recharts load cleanly.
- [x] Assessment form saves documents to Firestore `assessments` collection.
- [x] Profile page permits editing Full Name and Organization.
- [x] FastAPI starts and `/api/health` returns status `ok`.

---

## Multi-Phase Future Roadmap

| Phase | Target Scope | Status |
| :--- | :--- | :--- |
| **Phase 1** | **Foundation**: React, Vite, Tailwind, Firebase Auth & Firestore, FastAPI, Dashboard & Assessments Baseline | ✅ **Completed** |
| **Phase 2** | **Sustainability Analytics Engine**: Detailed metric aggregation, PDF reporting & automated score calculation | ⏳ Upcoming |
| **Phase 3** | **RAG Knowledge Base**: Document ingestion (AASHE STARS, LEED, campus energy plans) & vector embeddings | ⏳ Upcoming |
| **Phase 4** | **IBM Granite AI Integration**: Fine-tuned LLM recommendation engine for campus decarbonization | ⏳ Upcoming |
| **Phase 5** | **Agentic AI Optimization**: Multi-agent collaborative workflows for automated campus decision scenarios | ⏳ Upcoming |
| **Phase 6** | **Deployment & Final Presentation**: Cloud deployment, monitoring, and live presentation | ⏳ Upcoming |

---

## 1M1B – IBM SkillsBuild Internship Project Documentation

### 1. UN Sustainable Development Goals (SDG) Alignment
- **SDG 11: Sustainable Cities & Communities** (Primary): Holistic campus sustainability intelligence and score calculation.
- **SDG 12: Responsible Consumption & Production** (Primary): Waste diversion tracking (kg, recycling %, composting) and food waste management.
- **SDG 13: Climate Action** (Primary): AI-generated decarbonization recommendations, trend analysis, and monthly reports.
- **SDG 6: Clean Water & Sanitation** (Secondary): Water consumption tracking (liters, recycled water %).
- **SDG 7: Affordable & Clean Energy** (Secondary): Electricity usage monitoring (kWh, renewable energy share %).

### 2. Problem Statement
> *"How might we use AI and data analytics to help higher-education campuses measure, analyze, and improve sustainability performance across Energy, Water, Waste, Transportation, and Food, so that institutions can make evidence-grounded decarbonization decisions?"*

### 3. Design Thinking Process
1. **Empathize**: Observed university campus sustainability challenges where facility managers and administrators face fragmented data across energy, water, and waste with no unified AI guidance.
2. **Define**: Defined target users (campus facility managers, sustainability officers, university leadership) and identified the gap in actionable, evidence-grounded sustainability recommendations.
3. **Ideate**: Designed a hybrid solution combining deterministic analytics (11 KPIs, hotspot detection, period trends) with Groq LLM + RAG vector retrieval over sustainability standards.
4. **Prototype**: Developed a production-quality full-stack application using React, FastAPI, Cloud Firestore, sentence-transformers, FAISS vector index, and Groq Llama 3.3 70B.
5. **Test & Refine**: Validated scoring algorithms with real campus metrics, verified RAG evidence citations, added multi-sheet Excel export, and integrated Responsible AI guidelines directly into the application interface.

### 4. Responsible AI Considerations
- **Fairness**: Uniform scoring formulas applied without demographic or institutional bias.
- **Transparency**: All AI outputs labeled with model attribution (`Groq Llama 3.3 70B`) and RAG source citations.
- **Ethics**: Advisory-only decision support; no automated campus actions executed without human verification; prototype disclaimer included.
- **Privacy**: Firebase Authentication, Firestore security rules, zero PII transmitted to LLMs, and complete user ownership of assessment data.

### 5. Expected Impact
- **Environmental**: Identified hotspots enable 15–25% estimated potential improvement in campus sustainability metrics.
- **Economic**: Energy efficiency and water conservation recommendations reduce operational utility bills.
- **Social**: Empowers students, faculty, and administrators with transparent, actionable campus sustainability data.

