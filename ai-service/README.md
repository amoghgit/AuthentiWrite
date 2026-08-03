# AuthentiWrite AI Microservice (Phase 3)

Transparent AI Writing Analysis engine for College Admission Essays.

This is an **independent, standalone Python AI microservice** built with FastAPI, spaCy, NLTK, textstat, sentence-transformers, and scikit-learn. It analyzes essay text to produce transparent, explainable JSON evidence without relying on raw percentage predictions.

---

## 🏗 Architecture & Overview

```
ai-service/
├── app.py                  # FastAPI Application Entry Point & CORS Setup
├── requirements.txt        # Python 3.12 Dependencies
├── models/                 # Pydantic Schemas & Integration Contracts
│   └── schemas.py
├── analysis/               # Feature Extraction Engine (Burstiness, Readability, TTR, Coherence)
│   └── nlp_engine.py
├── services/               # Orchestration & Explainable Reasoning Engine
│   └── analysis_service.py
├── prompts/                # Prompt Templates & Lexical Indicator Dictionaries
│   └── templates.py
├── routes/                 # FastAPI Routers (/analyze, /health)
│   ├── analyze.py
│   └── health.py
├── utils/                  # Text processing & Tokenization Utilities
│   └── text_processing.py
└── tests/                  # Pytest Unit & End-to-End API Test Suite
    ├── sample_essays.py
    ├── test_health.py
    ├── test_nlp_engine.py
    └── test_analyze.py
```

### Key Analytical Features Computed:
- **Burstiness**: Variance of sentence lengths normalized by mean sentence length (flat length distribution indicates AI generation).
- **Lexical Richness & Vocabulary**: Type-Token Ratio (TTR), Root TTR, and rare word ratios.
- **Readability & Complexity**: Flesch Reading Ease, Flesch-Kincaid Grade level via `textstat`.
- **Syntactic & Grammar Metrics**: POS tag distribution, noun chunks, and clauses parsing via `spaCy` (`en_core_web_sm`).
- **Formulaic Language & Cliché Detection**: Identification of LLM boilerplate transitions (*Furthermore, In conclusion, pivotal role, tapestry of life, delve into*).
- **Narrative Coherence**: Sentence-to-sentence semantic similarity matrix computed via dense embeddings from `sentence-transformers` (`all-MiniLM-L6-v2`).
- **Explainable Reasoning**: Local LLM pipeline using `transformers` (`google/flan-t5-small`) to dynamically generate natural language explanations for sentence classifications.

> **Note on First Run**: The microservice will automatically download the `spaCy`, `sentence-transformers`, and `transformers` models (~1GB total) into memory during startup (`uvicorn` lifecycle event).

---

## 🚀 Installation

### 1. Prerequisites
- Python 3.12+ installed

### 2. Create Virtual Environment & Install Dependencies

```bash
cd ai-service

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS / Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

---

## 🏃 Running the Microservice

To launch the microservice locally:

```bash
uvicorn app:app --reload --port 8000
```

The API server will start at `http://localhost:8000`.

- **Swagger Interactive API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc API Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📌 API Endpoints

### 1. `GET /health`
Health check endpoint verifying microservice status.

**Response `200 OK`**:
```json
{
  "status": "healthy",
  "service": "AuthentiWrite AI Microservice",
  "version": "1.0.0",
  "model_loaded": true
}
```

---

### 2. `POST /analyze`
Analyzes an essay for writing authenticity and returns sentence-by-sentence explainable evidence.

**Request Payload**:
```json
{
  "text": "Leadership has always been important to me. When I was fifteen, my town experienced a flash flood that submerged our community center. I spent three days helping my uncle clean out supplies."
}
```

**Response `200 OK` (Integration Contract)**:
```json
{
  "overallAssessment": "Mixed indicators of AI assistance. Some sections exhibit natural human phrasing and personal detail, while others show uniform sentence lengths and predictable transitions.",
  "confidence": "Moderate",
  "overallScore": 79,
  "metrics": {
    "readability": 80,
    "vocabulary": 74,
    "complexity": 70,
    "grammar": 94,
    "originality": 68
  },
  "essay": [
    {
      "text": "Leadership has always been important to me.",
      "classification": "Likely Human",
      "confidence": "High",
      "reason": "High lexical diversity and varied sentence structure with authentic personal details",
      "evidence": [
        "High burstiness and length variation",
        "Specific personal perspective / voice",
        "High lexical diversity"
      ]
    }
  ]
}
```

---

## 🧪 Running Automated Tests

Run the full test suite using `pytest`:

```bash
pytest
```
