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
        "Searches the course database. IMPORTANT: Use the 'keyword' parameter to search for general topics (like 'math', 'art', 'history', 'physics', 'computer science') within course names/descriptions. ONLY use the 'subject' parameter if the user explicitly asks to filter by one of the exact, valid subject categories.",
      parameters: {
        type: "object",
        properties: {
          keyword: {
            type: "string",
            description:
              "A topic or term (e.g., 'physics', 'calculus', 'animation', 'video game') to search within course names and descriptions. Use this for most topic-based searches.",
          },
          subject: {
            type: "string",
            description:
              "Filter courses ONLY by these exact subject categories: '2024-2025', 'Child Development And Family Services', 'Engineering And Architecture', 'Health Services And Medical Technology', 'Media And Entertainment', 'Other English Courses', 'Performing Arts', 'Public Services', 'Sales And Service', 'Senior English Courses', 'Tourism And Recreation', 'Transportation Technology'. Do not use for general topics like 'math' or 'science'.",
          },
          level: {
            type: "string",
            description: "Filter courses by level (P or HP).",
          },
        },
        required: [],
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

    // Define the system prompt for the chat functionality
    this.systemPrompt = `You are CourseView AI, a friendly and knowledgeable course scheduling assistant for students at a high school in Pleasanton, CA. Your goal is to help students explore course options and find classes that fit their interests and academic path.

You have access to a tool called \`searchCourses\` to look up courses in the school's database.

Reasoning Process:
1.  **Understand the Request:** Carefully analyze the student's message to understand their needs, interests, and any specific constraints (like prerequisites, desired subjects, levels, or keywords).
2.  **Plan Tool Use:** If the student asks about specific courses, subjects, or general topics, plan to use the \`searchCourses\` tool.
3.  **Formulate Tool Query:**
    *   Use the \`keyword\` parameter for general topics (e.g., 'biology', 'programming', 'art history', 'creative writing'). Search broadly within course names and descriptions.
    *   Use the \`subject\` parameter ONLY if the student explicitly mentions one of the exact, predefined subject categories (like 'Engineering And Architecture', 'Performing Arts', 'Health Services And Medical Technology'). Do NOT use \`subject\` for general topics like 'math' or 'science'.
    *   Use the \`level\` parameter ('P' or 'HP') if the student specifies a desired level.
    *   Briefly explain *why* you are searching with specific parameters before making the call (e.g., "Okay, I'll search for courses with the keyword 'physics' to find relevant options.").
4.  **Synthesize Results:** Once you receive the search results from the tool, do not just list them raw. Synthesize the information clearly. Highlight 1-3 relevant courses, summarize their descriptions briefly, and mention their codes or levels if pertinent. Explain *why* these courses match the student's request based on the tool results.
5.  **Ask Clarifying Questions:** If the request is ambiguous or needs more detail (e.g., "What kind of science?"), ask clarifying questions before using the tool.
6.  **Handle Off-Topic Questions:** If the question is unrelated to course selection or the school's offerings, politely decline to answer and redirect the conversation back to course scheduling.

Maintain a helpful, encouraging, and clear communication style.`;

    console.log(
      "[Chatbot] Initialized using OpenAI v4+ SDK with DB connection and system prompt."
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
   * @returns {Promise<string>} - The chatbot's final response message.
   */
  async sendMessage(userMessage) {
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

    // Use the system prompt defined in the constructor
    const baseSystemPrompt = this.systemPrompt;

    // --- Manage Conversation History (Simplified) ---
    // In a real app, history should be tied to a user session.
    // For now, we append to the single history array.
    const currentMessages = [...this.conversationHistory]; // Copy history for this turn
    currentMessages.push({ role: "user", content: userMessage });

    // Add system prompt if needed (only for the *very first* message potentially)
    if (this.conversationHistory.length === 0) {
      // Use the prompt from the constructor
      currentMessages.unshift({ role: "system", content: baseSystemPrompt });
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
        // Add the assistant's request to use tools to the history for the next call
        currentMessages.push(responseMessage);

        const availableTools = {
          searchCourses: this.searchCourses.bind(this),
        };

        // Array to hold the results of all tool calls in this turn
        const toolResults = [];

        // Process all tool calls requested in parallel
        for (const toolCall of responseMessage.tool_calls) {
          const functionName = toolCall.function.name;
          const functionToCall = availableTools[functionName];
          let toolResultContent;

          console.log(
            `[Tool Call] Processing tool call ID: ${toolCall.id}, Function: ${functionName}`
          );

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
                `[Tool Call] Tool '${functionName}' (ID: ${toolCall.id}) executed successfully. Result preview:`,
                toolResultContent.substring(0, 200) +
                  (toolResultContent.length > 200 ? "..." : "")
              );
            } catch (toolError) {
              console.error(
                `[Tool Call] Error executing tool '${functionName}' (ID: ${toolCall.id}):`,
                toolError
              );
              toolResultContent = JSON.stringify({
                error: `Failed to execute tool ${functionName}.`,
              });
            }
          } else {
            console.warn(
              `[Tool Call] Unknown tool requested: ${functionName} (ID: ${toolCall.id})`
            );
            toolResultContent = JSON.stringify({
              error: `Unknown tool: ${functionName}`,
            });
          }

          // Add the result for this specific tool call
          toolResults.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: functionName,
            content: toolResultContent,
          });
        }

        // Add all tool results to the message history for the next API call
        currentMessages.push(...toolResults);

        // Make *another* API call with all tool results included
        console.log("[Chatbot] Sending all tool results back to OpenAI...");
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
