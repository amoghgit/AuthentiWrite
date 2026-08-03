"""
Prompt templates and lexical pattern dictionaries for explainable AI writing analysis in AuthentiWrite.
"""

EXPLAINABLE_ANALYSIS_PROMPT = """
You are an expert NLP researcher and admissions writing analyst.
Analyze the following college admission essay for AI assistance or generation.

Do NOT simply output an AI probability or raw percentage (like 99% or 100%).
Instead, evaluate the writing along these dimensions and explain WHY:
1. Burstiness & Sentence Length Variation (Uniform vs Natural burstiness)
2. Personal Voice & Narrative Specificity (Vague generalization vs authentic personal experience)
3. Vocabulary Choice & Clichés (Formulaic LLM tokens vs organic student register)
4. Transition Predictability (Mechanical boilerplate connectors vs natural flow)
5. Syntactic & Structural Consistency (Low perplexity formulaic patterns vs organic flow)

Essay to Analyze:
\"\"\"
{essay_text}
\"\"\"

Return an explainable JSON report following this exact structure:
{{
  "overallAssessment": "<Summary of findings with uncertainty>",
  "confidence": "Low" | "Moderate" | "High",
  "overallScore": <0-100 authenticity score, where 100 is fully authentic human>,
  "metrics": {{
      "readability": <0-100>,
      "vocabulary": <0-100>,
      "complexity": <0-100>,
      "grammar": <0-100>,
      "originality": <0-100>
  }},
  "essay": [
      {{
        "text": "<Sentence text>",
        "classification": "Likely Human" | "Possibly AI-Assisted" | "Likely AI-Generated",
        "confidence": "Low" | "Moderate" | "High",
        "reason": "<Specific explanation of why>",
        "evidence": [
            "<Evidence point 1>",
            "<Evidence point 2>"
        ]
      }}
  ]
}}
"""

SENTENCE_REASON_PROMPT = """
You are an expert NLP analyst. Briefly explain in one sentence WHY the following sentence was classified as {class_label}, given these evidence points: {evidence}.
Sentence: "{sentence}"
Explanation:
"""

AI_TRANSITION_WORDS = [
    "furthermore",
    "in conclusion",
    "moreover",
    "it is important to note",
    "it is essential to remember",
    "in summary",
    "consequently",
    "subsequently",
    "nonetheless",
    "in addition to this",
    "as a result of",
    "in light of this",
    "it worth noting that",
    "on the other hand",
    "to conclude",
]

GENERIC_FILLER_PHRASES = [
    "tapestry of life",
    "beacon of hope",
    "testament to",
    "pivotal role",
    "delve deeper into",
    "delve into",
    "rich tapestry",
    "journey of growth",
    "crucial step towards",
    "in invaluable ways",
    "profound impact",
    "ever-evolving landscape",
    "transformative journey",
    "foster a sense of",
]

AI_CLICHE_VOCABULARY = [
    "delve",
    "tapestry",
    "testament",
    "beacon",
    "pivotal",
    "multifaceted",
    "underscore",
    "paramount",
    "unwavering",
    "resonate",
    "transformative",
    "synergy",
    "holistic",
]
