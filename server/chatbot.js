const { OpenAI } = require("openai");
const fs = require("fs");
const express = require("express");

// Use a more robust way to load API key, perhaps from a .env file
// require('dotenv').config(); // Uncomment if using dotenv
const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
  console.error("FATAL: OPENAI_API_KEY environment variable is not set.");
  process.exit(1);
}

// Initialize the OpenAI client with the modern syntax
const openaiClient = new OpenAI({
  apiKey: openaiApiKey,
});

class Chatbot {
  constructor() {
    // Use the globally initialized openaiClient
    this.client = openaiClient;
    this.conversationHistory = []; // Stores chat history { role: 'user' | 'assistant', content: string }[]
    console.log("Chatbot class initialized using OpenAI v4+ SDK.");
  }

  /**
   * Sends a message to the OpenAI API and returns the response, managing conversation history.
   * @param {string} userMessage - The message from the user.
   * @param {string} [systemPrompt="You are a helpful assistant."] - An optional system prompt.
   * @returns {Promise<string>} - The chatbot's response message or an error message.
   */
  async sendMessage(
    userMessage,
    systemPrompt = "You are a helpful assistant."
  ) {
    if (
      !userMessage ||
      typeof userMessage !== "string" ||
      userMessage.trim() === ""
    ) {
      console.warn("sendMessage called with empty or invalid message.");
      return "Please provide a valid message.";
    }

    this.conversationHistory.push({ role: "user", content: userMessage });

    const messages = [];
    // Add system prompt if it's the first message OR if a specific one was provided for this call
    // Consider if the system prompt should *always* be the first message regardless of history.
    if (
      this.conversationHistory.length === 1 ||
      (systemPrompt && systemPrompt !== "You are a helpful assistant.")
    ) {
      messages.push({ role: "system", content: systemPrompt });
    }

    // Add the conversation history (including the latest user message)
    messages.push(...this.conversationHistory);

    try {
      // Use the modern chat completion method
      const completion = await this.client.chat.completions.create({
        model: "gpt-4o", // Or specify another model like gpt-4o
        messages: messages,
      });

      // Validate the response structure
      const botMessage = completion.choices?.[0]?.message;
      if (botMessage?.content) {
        // Add the bot's response (which includes the role) to the history
        this.conversationHistory.push(botMessage);
        return botMessage.content;
      } else {
        console.error(
          "sendMessage: Invalid response structure from OpenAI API:",
          completion
        );
        // Remove the user message that failed
        this.conversationHistory.pop();
        return "Sorry, I received an unexpected response from the chatbot.";
      }
    } catch (error) {
      console.error("sendMessage: Error sending message to OpenAI:", error);
      // Remove the user message that failed
      if (
        this.conversationHistory[this.conversationHistory.length - 1]?.role ===
        "user"
      ) {
        this.conversationHistory.pop();
      }
      return "Sorry, there was an error communicating with the chatbot. Please try again later.";
    }
  }

  /**
   * Moderates a given comment using the OpenAI API with JSON mode.
   * @param {string} comment - The comment text to moderate.
   * @returns {Promise<{decision: 'allow'|'block', reason: string|null}>} - The moderation decision and reason.
   */
  async moderate(comment) {
    if (!comment || typeof comment !== "string" || comment.trim() === "") {
      console.warn("moderate called with empty or invalid comment.");
      return {
        decision: "block",
        reason: "Invalid input provided for moderation.",
      };
    }

    // System prompt explicitly requests JSON output
    const systemPrompt = `You are a strict moderation assistant for student course feedback.
Only allow feedback that is relevant, helpful, and focused on the course content, structure, or teaching methods in a constructive way.
Block feedback that:
- Compares teachers (e.g., 'better than', 'worse than', 'more than', 'less than')
- Mentions personal likes unrelated to the course (e.g., 'I like apples')
- Contains vague words ('idk', 'meh', 'lol', 'okay')
- Uses only emojis or slang
- Is random, irrelevant, or not informative

Respond ONLY with a valid JSON object adhering to this schema:
{
  "decision": "'allow' or 'block'",
  "reason": "A brief explanation for the decision."
}
Do not include any text outside the JSON object.`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Feedback: ${comment}` },
    ];

    try {
      // Use modern chat completion with JSON mode enabled
      const completion = await this.client.chat.completions.create({
        model: "gpt-4o", // gpt-4o is good for following JSON instructions
        messages: messages,
        response_format: { type: "json_object" }, // Enable JSON mode
      });

      const responseContent = completion.choices?.[0]?.message?.content;
      if (!responseContent) {
        console.error(
          "moderate: Empty response content from OpenAI API",
          completion
        );
        return {
          decision: "block",
          reason: "Received empty response from moderation service.",
        };
      }

      try {
        // Parse the JSON response (should be guaranteed by response_format)
        const decisionJson = JSON.parse(responseContent);
        const decision =
          decisionJson.decision?.toLowerCase() === "allow" ? "allow" : "block";
        const reason = decisionJson.reason || "No reason provided.";

        console.log(`Moderation Decision: ${decision}, Reason: ${reason}`); // Log details
        return { decision, reason };
      } catch (parseError) {
        // This should ideally not happen with response_format: { type: "json_object" }
        console.error(
          `moderate: Failed to parse JSON response: ${responseContent}`,
          parseError
        );
        return {
          decision: "block",
          reason: "Failed to interpret moderation service response.",
        };
      }
    } catch (error) {
      console.error("moderate: Error during OpenAI API call:", error);
      return {
        decision: "block",
        reason: "Error communicating with moderation service.",
      }; // Default to blocking on API error
    }
  }

  /**
   * Clears the current conversation history.
   */
  clearHistory() {
    this.conversationHistory = [];
    console.log("Conversation history cleared.");
  }
}

// Export the class for use in other modules
module.exports = Chatbot;
