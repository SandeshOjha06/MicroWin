<![CDATA[# MicroWin 🧠⚡

### _Big Goals. Micro Wins._

> **An AI-powered executive function coach that breaks overwhelming goals into tiny, achievable "Micro-Wins" — personalized for neurodivergent users.**

MicroWin uses **adaptive AI granularity**, **privacy-first encrypted storage**, and **neuro-inclusive design** to help users with ADHD, Autism, Dyslexia, and other cognitive needs overcome **task paralysis** — one micro-win at a time.

---

## 📑 Table of Contents

- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Quick Start (Docker — Recommended)](#-quick-start-docker--recommended)
- [Quick Start (Local Development)](#-quick-start-local-development)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Privacy & Security](#-privacy--security)
- [Neuro-Inclusive Design Principles](#-neuro-inclusive-design-principles)
- [AI Personalization](#-ai-personalization)
- [How to Use MicroWin](#-how-to-use-microwin)
- [Testing](#-testing)
- [Judging Criteria Mapping](#-judging-criteria-mapping)
- [License](#-license)

---

## 🎯 The Problem

- **1 in 5 children are neurodivergent** (ADHD, Autism, Dyslexia)
- Big goals trigger **task paralysis** — they feel impossible to start
- Existing productivity tools are **NOT designed** for neuro-inclusive needs
- Kids lose confidence when they can't break tasks into manageable steps

---

## 💡 Our Solution

MicroWin acts as an **AI-powered executive function coach** that:

1. **Accepts any goal** (even vague or overwhelming ones)
2. **Breaks it into 3–5 sensory-grounded micro-steps** using Google Gemini 2.5 Flash
3. **Presents one step at a time** in a single-task view (reduces overwhelm)
4. **Celebrates every win** with sounds, confetti, streaks, and an animated mascot

All while keeping user data **encrypted** and **masking personal information** before it ever reaches the AI.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🤖 **AI Micro-Win Decomposition** | Goals → 3–5 sensory-grounded action steps via Gemini 2.5 Flash |
| ⚡ **< 5s Latency** | Streaming SSE with time-to-first-token metrics displayed in-app |
| 🧩 **Individualized Neuro-Profiles** | Encrypted struggle areas, preferences, and granularity (1–5 scale) |
| 🛡️ **PII Masking** | spaCy NER scrubs names, locations, and orgs before LLM ingestion |
| 🔐 **Encryption at Rest** | Fernet AES-128 for all stored goals, micro-wins, and profile data |
| 🔤 **Neuro-Inclusive Fonts** | Toggle between Inter, Verdana, OpenDyslexic, and Lexend |
| 🎮 **Gamification** | Streak counter 🔥, completion badges 🏆, confetti, and sound effects |
| 🐻 **Mascot (Polo)** | Animated companion with mood states: idle, thinking, happy, celebrating |
| 👁️ **Single-Task View** | One step at a time with large "I DID IT!" button (reduces overwhelm) |
| 🎵 **Gamma Wave Focus Music** | Built-in binaural beat player for focus enhancement |
| 🌗 **Dark / Light Mode** | Warm brown dark mode with muted, low-stimulation palettes |
| 🔑 **Dual Auth** | Email/password + Google OAuth2 (Implicit Flow) |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 7, TypeScript, Tailwind CSS 4, Framer Motion |
| **Backend** | FastAPI (async), SQLAlchemy 2 (async), PostgreSQL |
| **AI** | Google Gemini 2.5 Flash via `google-genai` SDK |
| **Privacy** | spaCy NER (PII masking), Fernet encryption (AES-128-CBC) |
| **Auth** | JWT (`python-jose`) + Google OAuth2 (Implicit Flow) |
| **Deployment** | Docker multi-stage build |

---

## 📐 Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                  │
│  ┌──────────┐ ┌──────────┐ ┌───────────────────┐    │
│  │ Dashboard │ │ Auth     │ │ Components        │    │
│  │ (Quest UI)│ │ (Login/  │ │ (Mascot, Fonts,   │    │
│  │           │ │  Signup) │ │  Settings, Audio) │    │
│  └─────┬─────┘ └────┬─────┘ └───────────────────┘    │
│        │             │                               │
│        ▼             ▼                               │
│  ┌─────────────────────────────────────────┐         │
│  │         API Layer (api.ts)              │         │
│  │   SSE Streaming  │  REST Endpoints      │         │
│  └──────────────────┼──────────────────────┘         │
└─────────────────────┼────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│                 Backend (FastAPI)                     │
│  ┌──────────────────────────────────────┐            │
│  │  /api/v1/tasks/decompose/stream      │  ◄── SSE  │
│  │  /api/v1/tasks/* (CRUD)              │            │
│  │  /api/v1/auth/* (JWT + OAuth)        │            │
│  │  /api/v1/users/* (Profile)           │            │
│  └───────────┬──────────────────────────┘            │
│              │                                       │
│  ┌───────────▼──────────────────────────┐            │
│  │  Services                             │            │
│  │  ├─ ai_service.py (Gemini + latency)  │            │
│  │  └─ pii_services.py (spaCy NER)      │            │
│  └───────────┬──────────────────────────┘            │
│              │                                       │
│  ┌───────────▼──────────────────────────┐            │
│  │  Security                             │            │
│  │  ├─ Fernet Encryption (AES-128)       │            │
│  │  ├─ bcrypt Password Hashing           │            │
│  │  └─ JWT Token Auth                    │            │
│  └───────────┬──────────────────────────┘            │
│              │                                       │
│  ┌───────────▼──────────────────────────┐            │
│  │  PostgreSQL (Encrypted at Rest)       │            │
│  │  ├─ users (neuro-profiles, streaks)   │            │
│  │  ├─ tasks (encrypted goals)           │            │
│  │  └─ micro_wins (encrypted actions)    │            │
│  └──────────────────────────────────────┘            │
└─────────────────────────────────────────────────────┘
```

**Data Flow for AI Requests:**
```
User Input  →  PII Masking (spaCy NER)  →  Gemini 2.5 Flash  →  SSE Stream  →  UI
                ↓                                                               ↓
         names, orgs, locations                                           Encrypted &
         are scrubbed BEFORE                                              stored in
         reaching the LLM                                                 PostgreSQL
```

---

## 📁 Project Structure

```
MicroWin/
├── Dockerfile                  # Multi-stage Docker build
├── docker-compose.yml          # One-command deployment
├── test_backend.py             # Backend integration tests
│
├── backend/
│   ├── main.py                 # FastAPI app entry point + SPA fallback
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment variables (not in repo)
│   └── app/
│       ├── api/v1/
│       │   ├── tasks.py        # Task decomposition, CRUD, SSE streaming
│       │   ├── auth.py         # Login, signup, Google OAuth, JWT
│       │   └── user.py         # Profile management
│       ├── core/
│       │   ├── config.py       # Pydantic settings
│       │   └── security.py     # Fernet encryption, bcrypt, JWT utils
│       ├── db/
│       │   └── database.py     # Async SQLAlchemy engine + session
│       ├── models/
│       │   ├── task.py         # Task + MicroWin ORM models
│       │   └── user.py         # User ORM model (profiles, streaks)
│       ├── schemas/
│       │   └── task.py         # Pydantic request/response schemas
│       └── services/
│           ├── ai_service.py   # Gemini integration + latency tracking
│           └── pii_services.py # spaCy NER-based PII masking
│
└── frontend/
    ├── index.html              # App shell
    ├── package.json            # Node dependencies
    ├── vite.config.ts          # Vite configuration
    └── src/
        ├── App.tsx             # Router + layout
        ├── main.tsx            # React entry point
        ├── index.css           # Global styles + design tokens
        ├── pages/
        │   ├── LandingPage.tsx # Public landing page
        │   ├── LoginPage.tsx   # Email/password + Google OAuth
        │   ├── SignUpPage.tsx   # Registration form
        │   ├── Dashboard.tsx   # Main app (quests, mascot, stats)
        │   └── AuthCallback.tsx# OAuth callback handler
        ├── components/
        │   ├── Mascot.tsx      # Animated Polo mascot (SVG)
        │   ├── FontSwitcher.tsx# Neuro-inclusive font toggle
        │   ├── GammaWavePlayer.tsx # Binaural beat focus music
        │   ├── SettingsPanel.tsx   # User preferences
        │   └── ...             # Additional UI components
        ├── contexts/
        │   └── AuthContext.tsx  # JWT auth state management
        └── lib/
            └── api.ts          # REST + SSE API client
```

---

## 🚀 Quick Start (Docker — Recommended)

> ⏱️ **Estimated setup time: 5 minutes**

### Prerequisites

- **Docker** & **Docker Compose** installed ([Install Docker](https://docs.docker.com/get-docker/))
- A **Google Gemini API key** ([Get one free](https://aistudio.google.com/apikey))
- A **PostgreSQL database URL** (cloud-hosted, e.g., Supabase, Neon, or local)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-repo/MicroWin.git
cd MicroWin
```

### Step 2 — Configure Environment Variables

Create a `backend/.env` file:

```bash
cat > backend/.env << 'EOF'
# ─── Required ───────────────────────────────────
GEMINI_API_KEY=your-gemini-api-key-here
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/microwin
DB_ENCRYPTION_KEY=your-fernet-key-here
JWT_SECRET_KEY=your-jwt-secret-here

# ─── Optional ───────────────────────────────────
GOOGLE_CLIENT_ID=your-google-oauth-client-id
FRONTEND_URL=http://localhost:8000
EOF
```

> **💡 Tip:** Generate a Fernet encryption key with:
> ```bash
> python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
> ```

If using Google OAuth, also create `frontend/.env`:
```bash
echo "VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id" > frontend/.env
```

### Step 3 — Build & Run

```bash
docker-compose up --build
```

### Step 4 — Open in Browser

Navigate to **http://localhost:8000** — you're all set! 🎉

> The Docker build compiles the React frontend into static files and serves them via the FastAPI backend — everything runs on a single port (`8000`).

---

## 🖥️ Quick Start (Local Development)

> Use this if you prefer running frontend and backend separately with hot-reload.

### Prerequisites

- **Python 3.11+**
- **Node.js 20+** and **npm**
- **PostgreSQL** database (local or cloud)

### Step 1 — Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy NER model (required for PII masking)
python -m spacy download en_core_web_sm

# Configure environment (create .env as described above)

# Start the backend server
uvicorn main:app --reload --port 8000
```

The backend API will be available at **http://localhost:8000**.

Verify it's running:
```bash
curl http://localhost:8000/
# Should return: {"message": "MicroWin Backend is Running"}
```

### Step 2 — Frontend (in a separate terminal)

```bash
cd frontend

# Install dependencies
npm install

# Configure Google OAuth (optional)
echo "VITE_GOOGLE_CLIENT_ID=your-client-id" > .env

# Start the dev server
npm run dev
```

The frontend will be available at **http://localhost:5173** with hot-reload enabled.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | ✅ Yes | — | Google AI Studio API key for Gemini 2.5 Flash |
| `DATABASE_URL` | ✅ Yes | — | PostgreSQL async URL (`postgresql+asyncpg://...`) |
| `DB_ENCRYPTION_KEY` | ✅ Yes | — | Fernet key for encrypting stored data (goals, profiles) |
| `JWT_SECRET_KEY` | ⚠️ Recommended | Has fallback | Secret key for signing JWT authentication tokens |
| `GOOGLE_CLIENT_ID` | ❌ Optional | — | Required only for Google OAuth login |
| `FRONTEND_URL` | ❌ Optional | `http://localhost:5173` | CORS allowed origin |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_GOOGLE_CLIENT_ID` | ❌ Optional | Google OAuth Client ID (for "Sign in with Google" button) |

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/signup` | Register with email + password |
| `POST` | `/api/v1/auth/login` | Login, returns JWT token |
| `GET` | `/api/v1/auth/me` | Get current user profile (requires JWT) |
| `POST` | `/api/v1/auth/google/verify-token` | Exchange Google OAuth access token for JWT |

### Tasks (Quests)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/tasks/decompose/stream` | **AI decomposition** — streams micro-steps via SSE |
| `GET` | `/api/v1/tasks/user/{user_id}` | List all tasks for a user |
| `GET` | `/api/v1/tasks/{task_id}` | Get task details with steps |
| `DELETE` | `/api/v1/tasks/{task_id}` | Delete a task |
| `PATCH` | `/api/v1/tasks/microwins/{step_id}` | Mark a step as completed |

### Users

| Method | Endpoint | Description |
|---|---|---|
| `PATCH` | `/api/v1/users/profile/{user_id}` | Update user profile (name, preferences) |

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/tasks/health` | Backend health check |
| `GET` | `/` | Root endpoint — confirms backend is running |

---

## 🛡️ Privacy & Security

MicroWin is built with a **privacy-first architecture**:

### 1. PII Masking (Pre-AI)
- All user input passes through **spaCy NER** (Named Entity Recognition) before being sent to Gemini
- **Names, locations, and organizations** are scrubbed and replaced with placeholders
- The AI model **never sees real personal data**

### 2. Encryption at Rest
- All stored goals, micro-wins, and neuro-profile data are encrypted with **Fernet AES-128-CBC**
- Encryption key is stored as an environment variable, never hardcoded

### 3. Password Security
- Passwords are hashed with **bcrypt** (with salt) — never stored in plaintext

### 4. Authentication
- **JWT tokens** for session management (stateless, signed)
- **Google OAuth2** (Implicit Flow) for one-click login
- Token-based authorization on all protected endpoints

### 5. Docker Security
- Runs as a **non-root user** (`appuser`) inside the container
- Health checks ensure the service is responsive

```
Data Flow:
User → PII Mask (spaCy) → AI (Gemini) → Encrypted → PostgreSQL
         ↑                                    ↑
    names/orgs/                          Fernet AES-128
    locations removed                    encryption
```

---

## ♿ Neuro-Inclusive Design Principles

| Principle | Implementation |
|---|---|
| **Reduce overwhelm** | Single-task view — only one step visible at a time |
| **Clear actions** | Large "I DID IT!" button — tactile, satisfying interaction |
| **Low stimulation** | Muted color palettes — no flashing, no neon, no eye strain |
| **Reading accessibility** | 4 font options: Inter, Verdana, **OpenDyslexic**, **Lexend** |
| **Emotional support** | Warm, friendly Polo mascot provides visual encouragement |
| **Positive reinforcement** | Sound effects, confetti, streaks, and trophies |
| **Focus support** | Built-in Gamma Wave binaural beat player |
| **Comfortable modes** | Warm brown dark mode with muted pastels |

---

## 🧠 AI Personalization

MicroWin doesn't just decompose tasks — it **personalizes** them:

1. **Neuro-Profile:** Each user has encrypted struggle areas and preferences
2. **Granularity Scale (1–5):** Controls how detailed the micro-steps are
   - `1` = broad steps (e.g., "Organize your desk")
   - `5` = extremely detailed micro-actions (e.g., "Pick up the 3 things closest to your feet and put them on your bed")
3. **Sensory-Grounded Actions:** Steps are concrete and physical, not abstract
4. **Streaming Delivery:** Steps arrive via SSE in < 5 seconds with real-time latency displayed

**Example:**

> **Goal:** _"I want to clean my room but it feels too overwhelming"_
>
> **Micro-Wins Generated:**
> 1. _"Stand in the doorway and look at just the floor area near your feet"_
> 2. _"Pick up the 3 things closest to you and put them on your bed"_
> 3. _"Take the trash items to the bin and come right back"_
> 4. _"Put the bed items where they belong, one at a time"_
> 5. _"Stand back and look at the clear floor — you did that!"_

---

## 🎮 How to Use MicroWin

### 1. **Sign Up / Login**
   - Create an account with email + password, or use **Google OAuth** one-click login
   - All credentials are securely hashed and tokenized

### 2. **Meet Your Dashboard**
   - Greeted by name with your animated mascot **Polo** 🐻
   - See stats at a glance: **Total Quests**, **Current Streak 🔥**, **Completed Tasks**
   - Access your **Mission Log** (sidebar) for past quests

### 3. **Create a Quest**
   - Type any goal or challenge into the input field
   - Press Enter — Polo starts thinking!
   - The AI generates **3–5 personalized micro-steps** streamed in real-time

### 4. **Complete Steps One at a Time**
   - Each step is shown in a **single-task view** with large, readable text
   - Press the **"I DID IT!" button** to complete each step
   - Hear motivating sounds and watch your progress bar fill

### 5. **Celebrate Your Win! 🎉**
   - When all steps are done: **confetti explodes**, Polo celebrates, and your streak updates
   - A **Quest Complete** screen shows your trophy 🏆

### 6. **Customize Your Experience**
   - **Font Switcher** — toggle between 4 neuro-inclusive fonts
   - **Dark / Light Mode** — warm, low-stimulation themes
   - **Gamma Wave Player** — binaural beats for focus
   - **Settings Panel** — update your neuro-profile and preferences

---

## 🧪 Testing

### Run Backend Tests
```bash
# Make sure the backend is running first
python test_backend.py
```

This runs integration tests for:
- ✅ Streaming SSE decomposition endpoint
- ✅ Input validation (min/max instruction length)

### Health Check
```bash
curl http://localhost:8000/api/v1/tasks/health
```

### Manual Testing Checklist

| Test | How to Verify |
|---|---|
| Sign up | Create a new account → should redirect to dashboard |
| Login | Log in with credentials → should see welcome screen |
| Google OAuth | Click "Sign in with Google" → should complete auth flow |
| Create Quest | Type a goal → should see streaming micro-steps appear |
| Complete Steps | Click "I DID IT!" → should hear sound + see progress |
| Full Completion | Complete all steps → should see confetti + celebration |
| Streak Counter | Complete a quest → streak count should increment |
| Font Switcher | Toggle fonts → text should change immediately |
| Dark/Light Mode | Toggle theme → should switch with smooth transition |
| Gamma Wave Player | Click play → should hear binaural beats |
| Mission Log | Sidebar should show all past quests |
| Delete Quest | Delete a quest → should disappear from sidebar |

---

## 🎯 Judging Criteria Mapping

| Criteria | Weight | Our Implementation |
|---|---|---|
| **Technical Execution** | 30% | Streaming SSE, real-time latency metering, async PostgreSQL, Fernet-encrypted storage, multi-stage Docker build |
| **Neuro-Inclusive UX** | 25% | 4 accessible fonts (incl. OpenDyslexic & Lexend), single-task view, muted palettes, animated mascot, gamification sounds |
| **AI Granularity** | 20% | Neuro-profile-personalized prompts, adjustable granularity (1–5), sensory-grounded action steps, PII masking |
| **Innovation** | 15% | spaCy NER PII masking before LLM, streak gamification, Gamma Wave binaural beat player, animated Polo mascot |
| **Feasibility** | 10% | One-command Docker deployment, complete auth (JWT + OAuth), full CRUD, comprehensive README |

---

## 📄 License

Built with ❤️ for the hackathon. MIT License.

---

<div align="center">

**Big goals. Micro wins. Start winning today.** 🧠⚡

</div>
]]>
