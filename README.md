# AuthentiWrite

AuthentiWrite is a premium SaaS platform offering transparent AI writing analysis for college admission essays. It detects AI-generated content, analyzes structural complexity, and provides actionable insights.

This repository uses a three-tier architecture:
- **Frontend**: Next.js 15 (App Router), Tailwind CSS v4, shadcn/ui, Framer Motion
- **Backend**: Node.js, Express, MongoDB (for authentication and storing results)
- **AI Service**: Python FastAPI, spaCy, Transformers (for ML/NLP text analysis)

---

## 🚀 Quick Start / Installation Guide

To run this project locally, you will need to start all three services.

### 1. Setup Environment Variables
At the root of the project, copy the example environment file:
```bash
cp .env.example .env
```
Ensure you have MongoDB running locally or provide a remote MongoDB URI in `.env`.

---

### 2. Frontend (Next.js)

The frontend handles the UI and user interactions.

```bash
cd frontend
# Install dependencies
npm install

# Start the development server (runs on port 3000)
npm run dev
```

---

### 3. Backend (Node.js & Express)

The backend handles user authentication, database operations, and proxying requests to the AI service.

```bash
cd backend
# Install dependencies
npm install

# Start the development server (runs on port 5000)
npm run dev
```

---

### 4. AI Service (Python FastAPI)

The AI service handles heavy ML processing and text analysis.

```bash
cd ai-service
# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
# On Windows:
.venv\Scripts\activate
# On Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server (runs on port 8000)
uvicorn app:app --reload --port 8000
```

---

## 🛠️ Useful Commands

**Frontend:**
- `npm run dev`: Start Next.js dev server
- `npm run build`: Build for production
- `npm run typecheck`: Check TypeScript typings

**Backend:**
- `npm run dev`: Start Express dev server (nodemon)
- `npm run build`: Compile TypeScript to `dist/`
- `npm run typecheck`: Check TypeScript typings

**AI Service:**
- `uvicorn app:app --reload --port 8000`: Run development server
- `pytest`: Run python test suite

---

## Architecture Overview

1. **User** interacts with the **Next.js Frontend**.
2. **Frontend** sends API requests (auth, history, analyze requests) to the **Express Backend**.
3. For text analysis, the **Express Backend** forwards the essay text to the **Python AI Service**.
4. The **AI Service** runs NLP models and returns probability scores.
5. The **Backend** saves these results to **MongoDB** and returns them to the **Frontend** for visualization.
