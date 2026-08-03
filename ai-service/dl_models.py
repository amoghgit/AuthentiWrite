import spacy
from sentence_transformers import SentenceTransformer
from transformers import pipeline

print("Loading sentence-transformers...")
st = SentenceTransformer('all-MiniLM-L6-v2')

print("Loading transformers pipeline...")
# Use google/flan-t5-small for generation since the requirement was for explainable text generation.
# It's only ~300MB.
llm = pipeline("text2text-generation", model="google/flan-t5-small", max_length=50)

print("Done downloading models!")
