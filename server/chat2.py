import openai
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


def get_embeddings(text):
    response = openai.Embedding.create(model="text-embedding-ada-002", input=text)
    return response["data"][0]["embedding"]


def cosine_similarity_fn(vec1, vec2):
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))


all_chunks = ["Chunk 1 text", "Chunk 2 text", "Chunk 3 text", "Chunk 4 text"]

chunk_embeddings = [get_embeddings(chunk) for chunk in all_chunks]


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


print("CourseView ready!")
while True:
    user_input = input("\nYou: ")
    if user_input.lower() in ["exit", "quit"]:
        print("Goodbye!")
        break
    reply = ask_bot(user_input)
    print("\nCourseView:", reply)
