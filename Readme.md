# MicroWin 🧠⚡

### Big Goals. Micro Wins.

An AI-powered executive function coach that breaks overwhelming goals into tiny, achievable "Micro-Wins" — personalized for neurodivergent users.

MicroWin uses adaptive AI granularity, privacy-first encrypted storage, and neuro-inclusive design to help users with ADHD, Autism, Dyslexia, and other cognitive needs overcome task paralysis — one micro-win at a time.

---

## The Problem

1 in 5 children are neurodivergent (ADHD, Autism, Dyslexia). Big goals trigger task paralysis — they feel impossible to start. Existing productivity tools are not designed for neuro-inclusive needs, and kids lose confidence when they can't break tasks into manageable steps.

---

## Our Solution

MicroWin acts as an AI-powered executive function coach that:

1. Accepts any goal (even vague or overwhelming ones)
2. Breaks it into 3–5 sensory-grounded micro-steps using Google Gemini 2.5 Flash
3. Presents one step at a time in a single-task view to reduce overwhelm
4. Celebrates every win with sounds, confetti, streaks, and an animated mascot

All while keeping user data encrypted and masking personal information before it ever reaches the AI.

---

## Key Features

- **AI Micro-Win Decomposition** — Goals are broken into 3–5 sensory-grounded action steps via Gemini 2.5 Flash
- **Under 5s Latency** — Streaming SSE with time-to-first-token metrics displayed in-app
- **Individualized Neuro-Profiles** — Encrypted struggle areas, preferences, and granularity (1–5 scale)
- **PII Masking** — spaCy NER scrubs names, locations, and orgs before LLM ingestion
- **Encryption at Rest** — Fernet AES-128 for all stored goals, micro-wins, and profile data
- **Neuro-Inclusive Fonts** — Toggle between Inter, Verdana, OpenDyslexic, and Lexend
- **Gamification** — Streak counter, completion badges, confetti, and sound effects
- **Mascot (Polo)** — Animated companion with mood states: idle, thinking, happy, celebrating
- **Single-Task View** — One step at a time with large "I DID IT!" button (reduces overwhelm)
- **Gamma Wave Focus Music** — Built-in binaural beat player for focus enhancement
- **Dark / Light Mode** — Warm brown dark mode with muted, low-stimulation palettes
- **Dual Auth** — Email/password and Google OAuth2 (Implicit Flow)

---

## Tech Stack

- **Frontend** — React 19, Vite 7, TypeScript, Tailwind CSS 4, Framer Motion
- **Backend** — FastAPI (async), SQLAlchemy 2 (async), PostgreSQL
- **AI** — Google Gemini 2.5 Flash via google-genai SDK
- **Privacy** — spaCy NER (PII masking), Fernet encryption (AES-128-CBC)
- **Auth** — JWT (python-jose) + Google OAuth2 (Implicit Flow)
- **Deployment** — Docker multi-stage build

---

## Architecture

The app is split into two main layers that communicate over REST and SSE.

**Frontend (React)** contains the Dashboard (Quest UI), Auth pages (Login/Signup), and shared components like the Mascot, Font Switcher, Settings Panel, and Gamma Wave Player. All API calls go through a single API layer that handles both SSE streaming and standard REST requests.

**Backend (FastAPI)** exposes endpoints for task decomposition (streaming via SSE), full CRUD on tasks, JWT + OAuth authentication, and user profile management. It connects to two core services: the AI service (Gemini integration with latency tracking) and the PII service (spaCy NER-based masking). All data passes through a security layer (Fernet encryption, bcrypt password hashing, JWT tokens) before being stored in PostgreSQL.

**Data Flow for AI Requests:**
User types a goal → spaCy NER masks any personal info (names, locations, orgs) → masked text is sent to Gemini 2.5 Flash → AI response streams back via SSE in under 5 seconds → steps are encrypted and stored in PostgreSQL.

---

## Project Structure

- **Dockerfile** — Multi-stage Docker build
- **docker-compose.yml** — One-command deployment with bundled PostgreSQL
- **test_backend.py** — Backend integration tests

**backend/** contains:
- main.py — FastAPI app entry point with SPA fallback and auto-migration on startup
- requirements.txt — Python dependencies
- app/api/v1/tasks.py — Task decomposition, CRUD, SSE streaming
- app/api/v1/auth.py — Login, signup, Google OAuth, JWT
- app/api/v1/user.py — Profile management
- app/core/config.py — Pydantic settings
- app/core/security.py — Fernet encryption, bcrypt, JWT utils
- app/db/session.py — Async SQLAlchemy engine and session
- app/models/task.py — Task and MicroWin ORM models
- app/models/user.py — User ORM model (profiles, streaks)
- app/schemas/task.py — Pydantic request/response schemas
- app/services/ai_service.py — Gemini integration with latency tracking
- app/services/pii_services.py — spaCy NER-based PII masking

**frontend/** contains:
- index.html — App shell
- package.json — Node dependencies
- vite.config.ts — Vite configuration
- src/App.tsx — Router and layout
- src/main.tsx — React entry point
- src/index.css — Global styles and design tokens
- src/pages/LandingPage.tsx — Public landing page
- src/pages/LoginPage.tsx — Email/password and Google OAuth login
- src/pages/SignUpPage.tsx — Registration form
- src/pages/Dashboard.tsx — Main app with quests, mascot, and stats
- src/pages/AuthCallback.tsx — OAuth callback handler
- src/components/Mascot.tsx — Animated Polo mascot (SVG)
- src/components/FontSwitcher.tsx — Neuro-inclusive font toggle
- src/components/GammaWavePlayer.tsx — Binaural beat focus music
- src/components/SettingsPanel.tsx — User preferences
- src/contexts/AuthContext.tsx — JWT auth state management
- src/lib/api.ts — REST and SSE API client

---

## Quick Start (Docker — Recommended)

Estimated setup time: about 3 minutes. Only 1 prerequisite: a Gemini API key.

**For Judges:** Docker Compose bundles everything — the app, PostgreSQL database, and frontend — in one command. You do NOT need to install Python, Node.js, or set up a database. Just Docker.

### Prerequisites

- Docker and Docker Compose installed (https://docs.docker.com/get-docker/)
- A Google Gemini API key (https://aistudio.google.com/apikey)

No external PostgreSQL is needed — docker-compose includes a local PostgreSQL 16 container. Database tables are auto-created on first boot.

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-repo/MicroWin.git
cd MicroWin
```

### Step 2 — Add Your Gemini API Key

Open backend/.env and replace the GEMINI_API_KEY value with your own key:

```bash
GEMINI_API_KEY=paste-your-gemini-api-key-here
```

All other environment variables (DB_ENCRYPTION_KEY, JWT_SECRET_KEY, etc.) are pre-configured and will work out of the box.

### Step 3 — Build and Run

```bash
docker-compose up --build
```

This will:
1. Start a PostgreSQL 16 container
2. Build the React frontend (production bundle)
3. Build the FastAPI backend with spaCy NER model
4. Auto-create database tables on first boot
5. Serve everything on port 8000

### Step 4 — Open in Browser

Navigate to http://localhost:8000 — you're all set!

The Docker build compiles the React frontend into static files and serves them via the FastAPI backend — everything runs on a single port (8000).

### Stopping the App

```bash
docker-compose down          # stop containers
docker-compose down -v       # stop and remove database data
```

---

## Quick Start (Local Development)

Use this if you prefer running frontend and backend separately with hot-reload.

### Prerequisites

- Python 3.11+
- Node.js 20+ and npm
- PostgreSQL database (local or cloud)

### Step 1 — Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload --port 8000
```

The backend API will be available at http://localhost:8000.

Verify it's running:
```bash
curl http://localhost:8000/
# Should return: {"message": "MicroWin Backend is Running"}
```

### Step 2 — Frontend (in a separate terminal)

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:5173 with hot-reload enabled.

---

## Environment Variables

### Backend (backend/.env)

- GEMINI_API_KEY (required) — Google AI Studio API key for Gemini 2.5 Flash
- DATABASE_URL (required) — PostgreSQL async URL (postgresql+asyncpg://...)
- DB_ENCRYPTION_KEY (required) — Fernet key for encrypting stored data
- JWT_SECRET_KEY (recommended) — Secret key for signing JWT tokens (has a default fallback)
- GOOGLE_CLIENT_ID (optional) — Required only for Google OAuth login
- FRONTEND_URL (optional) — CORS allowed origin, defaults to http://localhost:5173

### Frontend (frontend/.env)

- VITE_GOOGLE_CLIENT_ID (optional) — Google OAuth Client ID for the "Sign in with Google" button

---

## API Endpoints

### Authentication

- POST /api/v1/auth/signup — Register with email and password
- POST /api/v1/auth/login — Login, returns JWT token
- GET /api/v1/auth/me — Get current user profile (requires JWT)
- POST /api/v1/auth/google/verify-token — Exchange Google OAuth access token for JWT

### Tasks (Quests)

- POST /api/v1/tasks/decompose/stream — AI decomposition, streams micro-steps via SSE
- GET /api/v1/tasks/user/{user_id} — List all tasks for a user
- GET /api/v1/tasks/{task_id} — Get task details with steps
- DELETE /api/v1/tasks/{task_id} — Delete a task
- PATCH /api/v1/tasks/microwins/{step_id} — Mark a step as completed

### Users

- PATCH /api/v1/users/profile/{user_id} — Update user profile (name, preferences)

### Health Check

- GET /api/v1/tasks/health — Backend health check
- GET / — Root endpoint, confirms backend is running

---

## Privacy and Security

MicroWin is built with a privacy-first architecture.

**PII Masking (Pre-AI):** All user input passes through spaCy NER (Named Entity Recognition) before being sent to Gemini. Names, locations, and organizations are scrubbed and replaced with placeholders. The AI model never sees real personal data.

**Encryption at Rest:** All stored goals, micro-wins, and neuro-profile data are encrypted with Fernet AES-128-CBC. The encryption key is stored as an environment variable, never hardcoded.

**Password Security:** Passwords are hashed with bcrypt (with salt) and never stored in plaintext.

**Authentication:** JWT tokens for stateless session management. Google OAuth2 (Implicit Flow) for one-click login. Token-based authorization on all protected endpoints.

**Docker Security:** Runs as a non-root user (appuser) inside the container with health checks.

**Data flow:** User input → PII masking (spaCy removes names/orgs/locations) → Gemini AI → Response encrypted with Fernet AES-128 → Stored in PostgreSQL.

---

## Neuro-Inclusive Design Principles

- **Reduce overwhelm** — Single-task view, only one step visible at a time
- **Clear actions** — Large "I DID IT!" button for a tactile, satisfying interaction
- **Low stimulation** — Muted color palettes with no flashing, no neon, and no eye strain
- **Reading accessibility** — 4 font options including OpenDyslexic and Lexend
- **Emotional support** — Warm, friendly Polo mascot provides visual encouragement
- **Positive reinforcement** — Sound effects, confetti, streaks, and trophies
- **Focus support** — Built-in Gamma Wave binaural beat player
- **Comfortable modes** — Warm brown dark mode with muted pastels

---

## AI Personalization

MicroWin doesn't just decompose tasks — it personalizes them.

**Neuro-Profile:** Each user has encrypted struggle areas and preferences.

**Granularity Scale (1–5):** Controls how detailed the micro-steps are. Level 1 gives broad steps like "Organize your desk." Level 5 gives extremely detailed micro-actions like "Pick up the 3 things closest to your feet and put them on your bed."

**Sensory-Grounded Actions:** Steps are concrete and physical, not abstract.

**Streaming Delivery:** Steps arrive via SSE in under 5 seconds with real-time latency displayed.

**Example:**

Goal: "I want to clean my room but it feels too overwhelming"

Micro-Wins Generated:
1. "Stand in the doorway and look at just the floor area near your feet"
2. "Pick up the 3 things closest to you and put them on your bed"
3. "Take the trash items to the bin and come right back"
4. "Put the bed items where they belong, one at a time"
5. "Stand back and look at the clear floor — you did that!"

---

## How to Use MicroWin

**Step 1 — Sign Up / Login:** Create an account with email and password, or use Google OAuth one-click login. All credentials are securely hashed and tokenized.

**Step 2 — Meet Your Dashboard:** You'll be greeted by name with your animated mascot Polo. See stats at a glance: Total Quests, Current Streak, and Completed Tasks. Access your Mission Log (sidebar) for past quests.

**Step 3 — Create a Quest:** Type any goal or challenge into the input field and press Enter. Polo starts thinking! The AI generates 3–5 personalized micro-steps streamed in real-time.

**Step 4 — Complete Steps One at a Time:** Each step is shown in a single-task view with large, readable text. Press the "I DID IT!" button to complete each step. Hear motivating sounds and watch your progress bar fill.

**Step 5 — Celebrate Your Win:** When all steps are done, confetti explodes, Polo celebrates, and your streak updates. A Quest Complete screen shows your trophy.

**Step 6 — Customize Your Experience:** Use the Font Switcher to toggle between 4 neuro-inclusive fonts. Switch between Dark and Light mode. Play Gamma Wave binaural beats for focus. Update your neuro-profile in the Settings Panel.

---

## Testing

### Run Backend Tests
```bash
python test_backend.py
```

This tests the streaming SSE decomposition endpoint and input validation (min/max instruction length).

### Health Check
```bash
curl http://localhost:8000/api/v1/tasks/health
```

### Manual Testing Checklist

- Sign up — Create a new account, should redirect to dashboard
- Login — Log in with credentials, should see welcome screen
- Google OAuth — Click "Sign in with Google", should complete auth flow
- Create Quest — Type a goal, should see streaming micro-steps appear
- Complete Steps — Click "I DID IT!", should hear sound and see progress
- Full Completion — Complete all steps, should see confetti and celebration
- Streak Counter — Complete a quest, streak count should increment
- Font Switcher — Toggle fonts, text should change immediately
- Dark/Light Mode — Toggle theme, should switch with smooth transition
- Gamma Wave Player — Click play, should hear binaural beats
- Mission Log — Sidebar should show all past quests
- Delete Quest — Delete a quest, should disappear from sidebar

---

## Judging Criteria Mapping

- **Technical Execution (30%)** — Streaming SSE, real-time latency metering, async PostgreSQL, Fernet-encrypted storage, multi-stage Docker build
- **Neuro-Inclusive UX (25%)** — 4 accessible fonts (incl. OpenDyslexic and Lexend), single-task view, muted palettes, animated mascot, gamification sounds
- **AI Granularity (20%)** — Neuro-profile-personalized prompts, adjustable granularity (1–5), sensory-grounded action steps, PII masking
- **Innovation (15%)** — spaCy NER PII masking before LLM, streak gamification, Gamma Wave binaural beat player, animated Polo mascot
- **Feasibility (10%)** — One-command Docker deployment, complete auth (JWT + OAuth), full CRUD, comprehensive README

---

## License

Built with love for the hackathon. MIT License.

---

Big goals. Micro wins. Start winning today.
