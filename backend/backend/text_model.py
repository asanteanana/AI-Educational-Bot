from transformers import pipeline

generator = pipeline("text-generation", model="google/gemini")

def generate_text(query):
    response = generator(query, max_length=100, num_return_sequences=1)
    return response[0]["generated_text"]
