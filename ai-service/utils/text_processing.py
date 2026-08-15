import re
from typing import List


def split_sentences(text: str) -> List[str]:
    """
    Split input text into clean sentences using regex sentence boundary detection.
    Preserves original sentence text trimmed of surrounding whitespace.
    """
    if not text or not text.strip():
        return []
    
    # Sentence splitting using lookbehind regex for sentence terminators (. ! ?)
    raw_sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    sentences = [s.strip() for s in raw_sentences if s and len(s.strip()) > 0]
    
    # Fallback if no punctuation boundaries were found
    if not sentences and text.strip():
        sentences = [text.strip()]
        
    return sentences


def extract_paragraphs(text: str) -> List[str]:
    """
    Split text into distinct paragraphs separated by blank lines or newlines.
    """
    if not text:
        return []
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n|\n", text) if p.strip()]
    return paragraphs if paragraphs else [text.strip()]


def clean_token(token: str) -> str:
    """
    Normalize token to lowercase alphanumeric characters.
    """
    return re.sub(r"[^\w]", "", token.lower()).strip()


def get_ngrams(tokens: List[str], n: int) -> List[str]:
    """
    Generate list of n-grams from a sequence of word tokens.
    """
    if len(tokens) < n:
        return []
    return [" ".join(tokens[i : i + n]) for i in range(len(tokens) - n + 1)]
