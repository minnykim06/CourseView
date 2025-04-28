import openai
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from pdfminer.high_level import extract_text
import os


# === Functions ===


def get_embeddings(text):
    response = openai.Embedding.create(model="text-embedding-ada-002", input=text)
    return response["data"][0]["embedding"]


def cosine_similarity_fn(vec1, vec2):
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))


def load_and_chunk_pdfs(pdf_paths, chunk_size=1000, overlap=100):
    all_chunks = []
    for pdf_path in pdf_paths:
        if os.path.exists(pdf_path):
            text = extract_text(pdf_path)
            start = 0
            while start < len(text):
                end = start + chunk_size
                chunk = text[start:end]
                all_chunks.append(chunk)
                start = end - overlap  # add small overlap for continuity
        else:
            print(f"Warning: {pdf_path} does not exist.")
    return all_chunks


# === Load PDFs ===

pdf_files = [
    "pdf1.pdf",
    "pdf2.pdf",
    "pdf3.pdf",
    "pdf4.pdf",
]

print("Loading and chunking PDFs...")
all_chunks = load_and_chunk_pdfs(pdf_files)

print(f"Loaded {len(all_chunks)} chunks from PDFs.")

# === Generate Embeddings ===

print("Generating embeddings (this may take a minute)...")
chunk_embeddings = [get_embeddings(chunk) for chunk in all_chunks]
print("Embeddings ready!")

# === Chatbot ===


def ask_bot(question):
    question_embedding = get_embeddings(question)

    similarities = []
    for chunk_emb in chunk_embeddings:
        sim = cosine_similarity_fn(question_embedding, chunk_emb)
        similarities.append(sim)

    top_5_indices = np.argsort(similarities)[::-1][:5]

    relevant_texts = [all_chunks[i] for i in top_5_indices]

    system_prompt = "You are a knowledgeable high-school counselor for Amador Valley HS. Use the provided PDFs (catalogue + sheets) to answer student questions."
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": "\n\n".join(relevant_texts)},
        {"role": "user", "content": question},
    ]

    response = openai.ChatCompletion.create(model="gpt-4", messages=messages)

    return response.choices[0].message["content"]


# === Main ===

print("CourseView ready! Ask your questions below.")
while True:
    user_input = input("\nYou: ")
    if user_input.lower() in ["exit", "quit"]:
        print("Goodbye!")
        break
    reply = ask_bot(user_input)
    print("\nCourseView:", reply)
