from typing import List, Tuple
from models.schemas import (
    AnalyzeResponse,
    MetricsModel,
    EssaySegmentModel,
)
from analysis.nlp_engine import NLPEngine, NLPFeatures, SentenceFeature


class AnalysisService:
    """
    Main Analysis Service for AuthentiWrite AI Microservice.
    Combines NLP feature extraction with explainable reasoning rules to classify
    essays and individual sentence segments.
    """

    def __init__(self):
        self.nlp_engine = NLPEngine()

    def analyze_essay(self, text: str) -> AnalyzeResponse:
        # Extract features across text
        features: NLPFeatures = self.nlp_engine.extract_features(text)

        # Analyze each sentence segment
        essay_segments = self._classify_sentences(features)

        # Compute composite scores & overall assessment
        overall_score, metrics = self._compute_scores_and_metrics(features, essay_segments)
        overall_assessment, overall_confidence = self._generate_overall_assessment(
            overall_score, features, essay_segments
        )

        return AnalyzeResponse(
            overallAssessment=overall_assessment,
            confidence=overall_confidence,
            overallScore=overall_score,
            metrics=metrics,
            essay=essay_segments,
        )

    def _classify_sentences(self, features: NLPFeatures) -> List[EssaySegmentModel]:
        segments: List[EssaySegmentModel] = []

        for s_feat in features.sentences:
            evidence: List[str] = []

            # Scoring factors per sentence
            ai_score = 0
            human_score = 0

            # 1. Burstiness / Sentence length uniformity check
            word_len = s_feat.word_count
            avg_len = features.avg_sentence_length
            if abs(word_len - avg_len) < 3.0 and features.sentence_length_stdev < 4.0:
                ai_score += 2
                evidence.append("Uniform sentence length")
            elif abs(word_len - avg_len) > 8.0 or features.sentence_length_stdev > 8.0:
                human_score += 2
                evidence.append("High burstiness and length variation")

            # 2. Formulaic AI Transitions
            if s_feat.transition_found:
                ai_score += 3
                evidence.append(f"Predictable transition phrase: '{s_feat.transition_found[0]}'")

            # 3. Filler and Cliché Vocabulary
            if s_feat.filler_found or s_feat.cliches_found:
                ai_score += 3
                found_terms = s_feat.filler_found + s_feat.cliches_found
                evidence.append(f"Generic or formulaic wording: '{found_terms[0]}'")

            # 4. Personal Voice & Personal Pronouns
            if s_feat.personal_pronouns > 0:
                human_score += 3
                evidence.append("Specific personal perspective / voice")

            # 5. Lexical Diversity & Complexity
            if features.vocabulary_diversity > 0.65:
                human_score += 1
                evidence.append("High lexical diversity")
            elif features.vocabulary_diversity < 0.45:
                ai_score += 1
                evidence.append("Low perplexity / uniform vocabulary distribution")

            # Determine Classification, Confidence, and Primary Reason
            if ai_score >= 3:
                classification = "Likely AI-Generated" if ai_score >= 5 else "Possibly AI-Assisted"
                confidence = "High" if ai_score >= 5 else "Moderate"
                
                if s_feat.transition_found:
                    reason = "Contains formulaic LLM transition structures and predictable phrasing"
                elif s_feat.filler_found or s_feat.cliches_found:
                    reason = "Uses generic filler wording and repetitive language model tropes"
                else:
                    reason = "Uniform sentence structure with low perplexity distribution"
            elif human_score > ai_score:
                classification = "Likely Human"
                confidence = "High" if human_score >= 4 else "Moderate"
                
                if s_feat.personal_pronouns > 0:
                    reason = "High lexical diversity and varied sentence structure with authentic personal details"
                else:
                    reason = "Natural sentence length variation and organic phrasing transitions"
            else:
                classification = "Possibly AI-Assisted"
                confidence = "Moderate"
                reason = "Moderate complexity with neutral stylistic and transition indicators"

            # Default evidence points if none captured
            if not evidence:
                if classification == "Likely Human":
                    evidence = ["Natural transitions", "Varied sentence length", "Authentic register"]
                elif classification == "Likely AI-Generated":
                    evidence = ["Low burstiness", "Predictable wording", "Generic transitions"]
                else:
                    evidence = ["Moderate burstiness", "Consistent complexity", "Common phrasing"]

            segments.append(
                EssaySegmentModel(
                    text=s_feat.text,
                    classification=classification,
                    confidence=confidence,
                    reason=reason,
                    evidence=evidence,
                )
            )

        return segments

    def _compute_scores_and_metrics(
        self, features: NLPFeatures, segments: List[EssaySegmentModel]
    ) -> Tuple[int, MetricsModel]:

        readability = int(min(100, max(0, features.readability_score)))
        vocabulary = int(min(100, max(0, features.vocabulary_diversity * 100 * 0.9 + 20)))
        complexity = int(min(100, max(0, features.complexity_score)))
        grammar = int(min(100, max(0, features.grammar_score)))
        originality = int(min(100, max(0, features.originality_score)))

        metrics = MetricsModel(
            readability=readability,
            vocabulary=vocabulary,
            complexity=complexity,
            grammar=grammar,
            originality=originality,
        )

        # Composite Overall Score (weighted average of authenticity indicators)
        human_seg_count = sum(1 for s in segments if s.classification == "Likely Human")
        total_segs = len(segments) if segments else 1
        segment_ratio = (human_seg_count / total_segs) * 100

        overall_score = int(
            0.4 * originality + 0.3 * segment_ratio + 0.15 * vocabulary + 0.15 * readability
        )
        overall_score = min(100, max(0, overall_score))

        return overall_score, metrics

    def _generate_overall_assessment(
        self, overall_score: int, features: NLPFeatures, segments: List[EssaySegmentModel]
    ) -> Tuple[str, str]:
        
        if overall_score >= 80:
            assessment = (
                "The essay exhibits strong indicators of authentic human writing, characterized by "
                "varied sentence structures, high burstiness, and personal voice."
            )
            confidence = "High"
        elif overall_score >= 60:
            assessment = (
                "Mixed indicators of AI assistance. Some sections exhibit natural human phrasing "
                "and personal detail, while others show uniform sentence lengths and predictable transitions."
            )
            confidence = "Moderate"
        elif overall_score >= 40:
            assessment = (
                "Moderate indicators of AI assistance detected. Multiple passages contain "
                "formulaic transitions, generic filler vocabulary, and low burstiness."
            )
            confidence = "Moderate"
        else:
            assessment = (
                "Strong indicators of AI-generated content. The essay relies heavily on formulaic "
                "sentence structures, predictable transition boilerplate, and uniform sentence lengths."
            )
            confidence = "High"

        return assessment, confidence
