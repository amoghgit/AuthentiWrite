import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from analysis.nlp_engine import NLPEngine
from tests.sample_essays import HUMAN_ESSAY, AI_GENERATED_ESSAY


def test_feature_extraction_human_essay():
    engine = NLPEngine()
    features = engine.extract_features(HUMAN_ESSAY)

    assert features.total_sentences > 0
    assert features.total_words > 0
    assert features.burstiness >= 0.0
    assert features.readability_score >= 0.0
    assert len(features.sentences) == features.total_sentences


def test_burstiness_and_cliches():
    engine = NLPEngine()
    human_feats = engine.extract_features(HUMAN_ESSAY)
    ai_feats = engine.extract_features(AI_GENERATED_ESSAY)

    # Human essay should have higher originality score than AI generated essay
    assert human_feats.originality_score > ai_feats.originality_score
    # AI generated essay should have higher transition density
    assert ai_feats.transition_density > human_feats.transition_density
