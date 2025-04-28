import openai
import logging
import json


def moderate_feedback(feedback):
    try:
        response = openai.chat.completions.create(
            model="gpt-4o",
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a strict moderation assistant for student course feedback. "
                        "Only allow feedback that is relevant, helpful, and focused on the course content, structure, or teaching methods in a constructive way. "
                        "Block feedback that:\n"
                        "- Compares teachers (e.g., 'better than', 'worse than', 'more than', 'less than')\n"
                        "- Mentions personal likes unrelated to the course (e.g., 'I like apples')\n"
                        "- Contains vague words ('idk', 'meh', 'lol', 'okay')\n"
                        "- Uses only emojis or slang\n"
                        "- Is random, irrelevant, or not informative\n"
                        "\n"
                        "Response with a JSON block containing two things:"
                        "{'decision': 'allow' or 'block', "
                        "'reason': 'explanation of why the feedback was allowed or blocked'}.\n"
                    ),
                },
                {"role": "user", "content": f"Feedback: {feedback}"},
            ],
        )

        response_content = response.choices[0].message.content
        try:
            decision_json = json.loads(response_content)
            print(
                json.dumps(response_content, indent=2)
            )  # Print the JSON response for debugging
            decision = decision_json.get("decision", "block").lower()
        except json.JSONDecodeError:
            logging.error(f"Failed to decode JSON response: {response_content}")
            decision = "block"

        return decision if decision in ["allow", "block"] else "block"

    except Exception as e:
        logging.error(f"LLM moderation failed: {e}")
        return "block"


# Example loop
while True:
    user_input = input("Please enter your feedback (or type 'exit'): ")
    if user_input.lower() == "exit":
        break

    result = moderate_feedback(user_input)
    if result == "allow":
        print("✅ Feedback allowed.")
    else:
        print("❌ Feedback blocked: Not useful.")
