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

// Define the tool structure for the OpenAI API
const tools = [
  {
    type: "function",
    function: {
      name: "searchCourses",
      description:
        "Search the course database for specific topics, course names, subjects, or levels. Use the 'keyword' parameter for searching topics or names within course titles and descriptions.",
      parameters: {
        type: "object",
        properties: {
          keyword: {
            type: "string",
            description:
              "A topic or keyword (like 'physics', 'art', 'programming') to search for within course names and descriptions. Use this if the user asks about a specific topic not listed as a formal subject category.",
          },
          subject: {
            type: "string",
            description:
              "Filter courses by a specific formal subject category (e.g., 'Engineering And Architecture', 'Performing Arts').",
          },
          level: {
            type: "string",
            description: "Filter courses by level (e.g., P, HP).",
          },
        },
        required: [], // Make parameters optional, model can decide which to use
      },
    },
  },
];

class Chatbot {
  constructor(db) {
    // Accept db connection
    if (!db) {
      console.error("FATAL: Chatbot requires a database connection.");
      process.exit(1);
    }
    this.db = db; // Store the db connection
    this.client = openaiClient;
    this.conversationHistory = []; // Stores { role: 'user' | 'assistant' | 'tool', content: string, tool_call_id?: string, name?: string }[]
    console.log(
      "[Chatbot] Initialized using OpenAI v4+ SDK with DB connection."
    );
  }

  /**
   * Searches the course database.
   * @param {object} params - Search parameters.
   * @param {string} [params.keyword] - Keyword to search in name/description.
   * @param {string} [params.subject] - Subject to filter by.
   * @param {string} [params.level] - Level to filter by.
   * @returns {Promise<object[]>} - Array of matching course objects.
   */
  async searchCourses({ keyword, subject, level } = {}) {
    return new Promise((resolve, reject) => {
      let query =
        "SELECT id, code, name, subject, level, description FROM courses WHERE 1=1";
      const queryParams = [];

      if (keyword) {
        query += " AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ?)";
        const keywordLike = `%${keyword.toLowerCase()}%`;
        queryParams.push(keywordLike, keywordLike);
      }
      if (subject) {
        query += " AND LOWER(subject) = ?";
        queryParams.push(subject.toLowerCase());
      }
      if (level) {
        query += " AND LOWER(level) = ?";
        queryParams.push(level.toLowerCase());
      }

      query += " LIMIT 10"; // Limit results to avoid overwhelming the model/user

      console.log(
        `[DB Query] Executing: ${query} with params: ${JSON.stringify(
          queryParams
        )}`
      );

      this.db.all(query, queryParams, (err, rows) => {
        if (err) {
          console.error("[DB Query] Error:", err);
          reject(new Error("Failed to search courses."));
        } else {
          console.log(
            `[DB Query] Found ${rows.length} courses matching criteria.`
          );
          // Format results slightly for better readability if needed
          const results = rows.map((row) => ({
            name: row.name,
            code: row.code,
            subject: row.subject,
            level: row.level,
            description: row.description
              ? row.description.substring(0, 100) + "..."
              : "No description", // Truncate description
          }));
          resolve(results);
        }
      });
    });
  }

  /**
   * Sends a message to the OpenAI API, handling potential tool calls.
   * @param {string} userMessage - The message from the user.
   * @param {string} [systemPrompt="..."] - System prompt.
   * @returns {Promise<string>} - The chatbot's final response message.
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
      console.warn(
        "[Chatbot] sendMessage called with empty or invalid message."
      );
      return "Please provide a valid message.";
    }
    console.log(`[Chatbot] Received user message: "${userMessage}"`);

    // --- Manage Conversation History (Simplified) ---
    // In a real app, history should be tied to a user session.
    // For now, we append to the single history array.
    const currentMessages = [...this.conversationHistory]; // Copy history for this turn
    currentMessages.push({ role: "user", content: userMessage });

    // Add system prompt if needed (only for the *very first* message potentially)
    if (this.conversationHistory.length === 0) {
      currentMessages.unshift({ role: "system", content: systemPrompt });
    }
    // -----------------------------------------------

    try {
      console.log(
        "[Chatbot] Sending message to OpenAI with potential tools..."
      );
      let response = await this.client.chat.completions.create({
        model: "gpt-4o",
        messages: currentMessages,
        tools: tools, // Provide the tool definition
        tool_choice: "auto", // Let the model decide whether to use tools
      });

      let responseMessage = response.choices[0].message;

      // --- Tool Call Handling ---
      while (responseMessage.tool_calls) {
        console.log(
          "[Tool Call] OpenAI requested tool call(s):",
          JSON.stringify(responseMessage.tool_calls)
        );
        currentMessages.push(responseMessage);

        // --- Execute Tool Calls (Simplified: handles first tool call only) ---
        const availableTools = {
          searchCourses: this.searchCourses.bind(this), // Bind `this` context
        };

        const toolCall = responseMessage.tool_calls[0];
        const functionName = toolCall.function.name;
        const functionToCall = availableTools[functionName];

        let toolResultContent;
        if (functionToCall) {
          try {
            const functionArgs = JSON.parse(toolCall.function.arguments);
            console.log(
              `[Tool Call] Executing tool '${functionName}' with args:`,
              functionArgs
            );
            const toolResult = await functionToCall(functionArgs);
            toolResultContent = JSON.stringify(toolResult);
            console.log(
              `[Tool Call] Tool '${functionName}' executed successfully. Result preview:`,
              toolResultContent.substring(0, 200) +
                (toolResultContent.length > 200 ? "..." : "")
            );
          } catch (toolError) {
            console.error(
              `[Tool Call] Error executing tool '${functionName}':`,
              toolError
            );
            toolResultContent = JSON.stringify({
              error: `Failed to execute tool ${functionName}.`,
            });
          }
        } else {
          console.warn(`[Tool Call] Unknown tool called: ${functionName}`);
          toolResultContent = JSON.stringify({
            error: `Unknown tool: ${functionName}`,
          });
        }
        // --- End Tool Execution ---

        // Add the tool's response to the history for the *next* call
        currentMessages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: toolResultContent,
        });

        // Make *another* API call with the tool result included
        console.log("[Chatbot] Sending tool results back to OpenAI...");
        response = await this.client.chat.completions.create({
          model: "gpt-4o",
          messages: currentMessages,
          tools: tools,
          tool_choice: "auto",
        });
        responseMessage = response.choices[0].message;
      }
      // --- End Tool Call Handling ---

      // --- Process Final Response ---
      if (responseMessage.content) {
        console.log(
          `[Chatbot] OpenAI provided final text response: "${responseMessage.content.substring(
            0,
            100
          )}..."`
        );
        // Update the persistent conversation history
        this.conversationHistory.push({ role: "user", content: userMessage }); // Add the initial user message
        this.conversationHistory.push(responseMessage); // Add the final assistant response
        // Note: Tool call/result messages are *not* added to the main history here,
        // only the initial user message and the final assistant text response.
        // The `currentMessages` array handled the temporary context for the multi-turn tool call.
        return responseMessage.content;
      } else {
        // Check if it was a tool call loop that didn't result in content
        if (response.choices[0].finish_reason === "tool_calls") {
          console.error(
            "[Chatbot] Error: Tool call loop did not produce a final text response."
          );
          return "Sorry, I got stuck trying to use my tools. Could you try phrasing your request differently?";
        } else {
          console.error(
            "[Chatbot] sendMessage: Invalid response structure (no content):",
            response
          );
          return "Sorry, I couldn't process that request properly.";
        }
      }
    } catch (error) {
      console.error(
        "[Chatbot] sendMessage: Error during OpenAI API call or tool execution:",
        error
      );
      // Don't add the failed turn to history
      return "Sorry, there was an error communicating with the chatbot or executing its tools. Please try again later.";
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
- Talks about academic dishonesty or cheating

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
      console.log(
        `[Moderation] Sending comment for moderation: "${comment.substring(
          0,
          50
        )}..."`
      );
      const completion = await this.client.chat.completions.create({
        model: "gpt-4o", // gpt-4o is good for following JSON instructions
        messages: messages,
        response_format: { type: "json_object" }, // Enable JSON mode
      });

      const responseContent = completion.choices?.[0]?.message?.content;
      if (!responseContent) {
        console.error(
          "[Moderation] Empty response content from OpenAI API:",
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

        console.log(`[Moderation] Decision: ${decision}, Reason: ${reason}`);
        return { decision, reason };
      } catch (parseError) {
        // This should ideally not happen with response_format: { type: "json_object" }
        console.error(
          `[Moderation] Failed to parse JSON response: ${responseContent}`,
          parseError
        );
        return {
          decision: "block",
          reason: "Failed to interpret moderation service response.",
        };
      }
    } catch (error) {
      console.error("[Moderation] Error during OpenAI API call:", error);
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
    console.log("[Chatbot] Conversation history cleared.");
  }
}

// Export the class for use in other modules
module.exports = Chatbot;
