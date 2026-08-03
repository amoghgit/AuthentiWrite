import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient
from app import app
from tests.sample_essays import HUMAN_ESSAY, AI_GENERATED_ESSAY, MIXED_ESSAY

client = TestClient(app)


def test_analyze_empty_payload():
    response = client.post("/analyze", json={"text": ""})
    assert response.status_code == 422 or response.status_code == 400


def test_analyze_human_essay_schema_contract():
    response = client.post("/analyze", json={"text": HUMAN_ESSAY})
    assert response.status_code == 200
    data = response.json()

    # Validate exact integration contract keys
    assert "overallAssessment" in data
    assert "confidence" in data
    assert "overallScore" in data
    assert "metrics" in data
    assert "essay" in data

    # Confidence must strictly be Low, Moderate, or High
    assert data["confidence"] in ["Low", "Moderate", "High"]

    # Check metrics keys
    metrics = data["metrics"]
    for key in ["readability", "vocabulary", "complexity", "grammar", "originality"]:
        assert key in metrics
        assert 0 <= metrics[key] <= 100

    # Check essay array structure
    assert len(data["essay"]) > 0
    first_seg = data["essay"][0]
    assert "text" in first_seg
    assert "classification" in first_seg
    assert "confidence" in first_seg
    assert first_seg["confidence"] in ["Low", "Moderate", "High"]
    assert "reason" in first_seg
    assert "evidence" in first_seg
    assert isinstance(first_seg["evidence"], list)


def test_analyze_ai_generated_essay():
    response = client.post("/analyze", json={"text": AI_GENERATED_ESSAY})
    assert response.status_code == 200
    data = response.json()
    assert data["overallScore"] < 70
    assert len(data["essay"]) > 0
