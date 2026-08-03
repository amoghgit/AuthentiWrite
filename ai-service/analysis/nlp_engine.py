import math
import re
from dataclasses import dataclass, field
from typing import List, Dict, Any, Tuple
import textstat
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from utils.text_processing import split_sentences, extract_paragraphs, clean_token, get_ngrams
from prompts.templates import AI_TRANSITION_WORDS, GENERIC_FILLER_PHRASES, AI_CLICHE_VOCABULARY


@dataclass
class SentenceFeature:
    text: str
    word_count: int
    char_count: int
    reading_ease: float
    transition_found: List[str] = field(default_factory=list)
    filler_found: List[str] = field(default_factory=list)
    cliches_found: List[str] = field(default_factory=list)
    personal_pronouns: int = 0
    passive_voice: bool = False
    coherence_score: float = 0.5


@dataclass
class NLPFeatures:
    total_words: int
    total_sentences: int
    total_paragraphs: int
    avg_sentence_length: float
    sentence_length_stdev: float
    burstiness: float  # Variance / mean of sentence length
    vocabulary_diversity: float  # TTR (Type-Token Ratio)
    root_ttr: float
    readability_score: float  # Flesch Reading Ease normalized 0-100
    complexity_score: float  # Syntactic complexity 0-100
    grammar_score: float  # Mechanics/Grammar index 0-100
    originality_score: float  # Organic voice & human markers 0-100
    transition_density: float
    repetition_index: float
    narrative_coherence: float
    sentences: List[SentenceFeature] = field(default_factory=list)


class NLPEngine:
    """
    Feature Extraction Engine for AuthentiWrite AI Microservice.
    Calculates sentence metrics, burstiness, lexical richness, readability,
    grammar scores, transition consistency, repetition, and semantic flow.
    """

    def __init__(self):
        # We try loading optional sentence-transformer model lazily if needed
        self._st_model = None

    def extract_features(self, text: str) -> NLPFeatures:
        sentences_raw = split_sentences(text)
        paragraphs_raw = extract_paragraphs(text)
        
        if not sentences_raw:
            return self._empty_features()

        # Word tokenization
        words_all = [clean_token(w) for w in text.split() if clean_token(w)]
        total_words = len(words_all)
        unique_words = set(words_all)
        
        # 1. Burstiness & Sentence Length Statistics
        sent_lengths = [len([w for w in s.split() if w]) for s in sentences_raw]
        total_sentences = len(sent_lengths)
        avg_sent_len = sum(sent_lengths) / total_sentences if total_sentences > 0 else 0
        
        variance = (
            sum((l - avg_sent_len) ** 2 for l in sent_lengths) / total_sentences
            if total_sentences > 0
            else 0
        )
        stdev = math.sqrt(variance)
        # Normalized burstiness coefficient (Fano factor variant)
        burstiness = variance / (avg_sent_len + 1e-5)

        # 2. Vocabulary Diversity & Lexical Richness
        ttr = len(unique_words) / total_words if total_words > 0 else 0
        root_ttr = len(unique_words) / math.sqrt(total_words) if total_words > 0 else 0
        
        # 3. Readability & Complexity via textstat
        try:
            flesch_ease = textstat.flesch_reading_ease(text)
            readability_score = min(100.0, max(0.0, float(flesch_ease)))
        except Exception:
            readability_score = 65.0
            
        try:
            fk_grade = textstat.flesch_kincaid_grade(text)
            # Complexity score based on grade level and average sentence length
            complexity_score = min(100.0, max(0.0, (fk_grade * 6.5 + (avg_sent_len * 1.5))))
        except Exception:
            complexity_score = 70.0

        # 4. Sentence-by-sentence analysis
        sentence_features = self._analyze_sentences(sentences_raw)

        # 5. Transition Density & Repetition Index
        total_transitions = sum(len(s.transition_found) for s in sentence_features)
        transition_density = total_transitions / total_sentences if total_sentences > 0 else 0.0

        total_cliches = sum(len(s.cliches_found) + len(s.filler_found) for s in sentence_features)

        # Repetition check (3-grams)
        trigrams = get_ngrams(words_all, 3)
        trigram_counts = {}
        for tg in trigrams:
            trigram_counts[tg] = trigram_counts.get(tg, 0) + 1
        repeated_trigrams = sum(1 for count in trigram_counts.values() if count > 1)
        repetition_index = (repeated_trigrams / len(trigrams)) * 100 if trigrams else 0.0

        # 6. Coherence & Narrative Flow using TF-IDF cosine matrix across consecutive sentences
        coherence_scores = self._compute_coherence(sentences_raw)
        for i, s_feat in enumerate(sentence_features):
            s_feat.coherence_score = coherence_scores[i]
        avg_coherence = sum(coherence_scores) / len(coherence_scores) if coherence_scores else 0.5

        # 7. Synthesize Composite Metrics (0-100)
        # Vocabulary Score: penalize cliché tokens, reward root TTR
        vocab_score = min(100, max(0, int(root_ttr * 22.0 - total_cliches * 4)))

        # Grammar Score: base 95 adjusted for extreme sentence lengths or passive overload
        grammar_score = min(100, max(40, int(96 - (stdev > 25) * 5)))

        # Originality Score: high burstiness + personal pronouns + low filler phrasing = high originality
        personal_pronoun_count = sum(s.personal_pronouns for s in sentence_features)
        personal_density = personal_pronoun_count / total_sentences if total_sentences > 0 else 0
        
        # AI indicators reduce originality score; human markers increase it
        burstiness_bonus = min(20, burstiness * 1.5)
        ai_penalty = (transition_density * 25) + (total_cliches * 8) + (stdev < 3.0) * 20
        originality_score = min(100, max(15, int(60 + burstiness_bonus + (personal_density * 15) - ai_penalty)))

        return NLPFeatures(
            total_words=total_words,
            total_sentences=total_sentences,
            total_paragraphs=len(paragraphs_raw),
            avg_sentence_length=round(avg_sent_len, 2),
            sentence_length_stdev=round(stdev, 2),
            burstiness=round(burstiness, 2),
            vocabulary_diversity=round(ttr, 3),
            root_ttr=round(root_ttr, 2),
            readability_score=round(readability_score, 1),
            complexity_score=round(complexity_score, 1),
            grammar_score=round(grammar_score, 1),
            originality_score=round(originality_score, 1),
            transition_density=round(transition_density, 2),
            repetition_index=round(repetition_index, 2),
            narrative_coherence=round(avg_coherence, 2),
            sentences=sentence_features,
        )

    def _analyze_sentences(self, sentences: List[str]) -> List[SentenceFeature]:
        results = []
        pronoun_pattern = re.compile(r"\b(i|my|me|mine|we|our|us)\b", re.IGNORECASE)

        for text in sentences:
            lower = text.lower()
            words = [clean_token(w) for w in text.split() if clean_token(w)]
            word_count = len(words)
            char_count = len(text)

            # Check transitions
            found_transitions = [t for t in AI_TRANSITION_WORDS if t in lower]
            found_fillers = [f for f in GENERIC_FILLER_PHRASES if f in lower]
            found_cliches = [c for c in AI_CLICHE_VOCABULARY if re.search(rf"\b{c}\b", lower)]

            # Check personal pronouns
            pronoun_matches = len(pronoun_pattern.findall(text))

            # Simple passive voice check (was/were/been + past participle ended in ed/en)
            passive = bool(re.search(r"\b(is|was|were|been|being|be)\b\s+\w+(ed|en)\b", lower))

            try:
                ease = textstat.flesch_reading_ease(text)
            except Exception:
                ease = 65.0

            results.append(
                SentenceFeature(
                    text=text,
                    word_count=word_count,
                    char_count=char_count,
                    reading_ease=ease,
                    transition_found=found_transitions,
                    filler_found=found_fillers,
                    cliches_found=found_cliches,
                    personal_pronouns=pronoun_matches,
                    passive_voice=passive,
                )
            )

        return results

    def _compute_coherence(self, sentences: List[str]) -> List[float]:
        """
        Compute sentence-to-sentence semantic coherence score using TF-IDF cosine similarity.
        """
        if len(sentences) < 2:
            return [1.0] * len(sentences)

        try:
            vectorizer = TfidfVectorizer(stop_words="english", max_features=100)
            tfidf_matrix = vectorizer.fit_transform(sentences)
            sim_matrix = cosine_similarity(tfidf_matrix)

            scores = []
            for i in range(len(sentences)):
                prev_sim = sim_matrix[i, i - 1] if i > 0 else sim_matrix[i, i + 1]
                next_sim = sim_matrix[i, i + 1] if i < len(sentences) - 1 else sim_matrix[i, i - 1]
                avg_sim = float((prev_sim + next_sim) / 2.0)
                scores.append(round(avg_sim, 2))
            return scores
        except Exception:
            return [0.5] * len(sentences)

    def _empty_features(self) -> NLPFeatures:
        return NLPFeatures(
            total_words=0,
            total_sentences=0,
            total_paragraphs=0,
            avg_sentence_length=0.0,
            sentence_length_stdev=0.0,
            burstiness=0.0,
            vocabulary_diversity=0.0,
            root_ttr=0.0,
            readability_score=70.0,
            complexity_score=70.0,
            grammar_score=95.0,
            originality_score=70.0,
            transition_density=0.0,
            repetition_index=0.0,
            narrative_coherence=0.5,
            sentences=[],
        )
