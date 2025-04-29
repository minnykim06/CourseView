const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const Chatbot = require("./chatbot.js");

const app = express();

//import chatbot from chatbot.js
// const chattbot = require("./chatbot.js"); // Remove old incorrect import

// Instantiate the Chatbot once
let chatbot; // Define chatbot variable

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = path.join(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database", err);
    process.exit(1); // Exit if DB connection fails
  } else {
    console.log("Connected to SQLite database");
    // Instantiate the Chatbot *after* the DB is connected
    chatbot = new Chatbot(db);

    //TODO: DELETE THIS - BAD PRACTICE
    db.serialize(() => {
      // Commented code is database initialization - it can be deleted now that I have the db created

      db.run(`CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY,
        code TEXT,
        name TEXT,
        subject TEXT,
        level TEXT,
        description TEXT,
        prerequisites TEXT,
        difficulty INTEGER
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY,
        courseId INTEGER,
        userName TEXT,
        text TEXT,
        date TEXT,
        FOREIGN KEY (courseId) REFERENCES courses(id)
      )`);
      // @minsung, this is a local database made mostly just for testing purposes.
      // If you want to use this in a production environment, you should use supabase or some other db platform

      // Check if courses table is empty, if so, load initial data from JSON
      db.get("SELECT COUNT(*) as count FROM courses", (err, row) => {
        if (err) {
          console.error("Error checking courses table", err);
        } else if (row.count === 0) {
          console.log("Loading initial data into database...");
          const dataPath = path.join(__dirname, "data.json");
          const data = fs.readFileSync(dataPath, "utf8");
          const courses = JSON.parse(data);

          const stmt = db.prepare(
            "INSERT INTO courses (id, code, name, subject, level, description, prerequisites, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
          );
          courses.forEach((course) => {
            stmt.run(
              course.id,
              course.code,
              course.name,
              course.subject,
              course.level,
              course.description,
              course.prerequisites,
              course.difficulty
            );
          });
          stmt.finalize();
          console.log("Initial data loaded into database.");
        }
      });
    });
  }
});

// ---------------------
// RESTful Routes
// ---------------------

// GET all courses
app.get("/api/courses", (req, res) => {
  db.all("SELECT * FROM courses", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.json(rows);
  });
});

// GET a specific course by ID
app.get("/api/courses/:id", (req, res) => {
  const courseId = parseInt(req.params.id);
  db.get("SELECT * FROM courses WHERE id = ?", [courseId], (err, row) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
      return;
    }
    if (!row) {
      return res.status(404).json({ error: "Course not found" });
    }
    // Get comments for this course
    db.all(
      "SELECT * FROM comments WHERE courseId = ?",
      [courseId],
      (err, comments) => {
        if (err) {
          res.status(500).json({ error: "Database error" });
          return;
        }
        row.comments = comments;
        res.json(row);
      }
    );
  });
});

// GET comments for a specific course
app.get("/api/courses/:id/comments", (req, res) => {
  const courseId = parseInt(req.params.id);
  db.get("SELECT * FROM courses WHERE id = ?", [courseId], (err, row) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
      return;
    }
    if (!row) {
      return res.status(404).json({ error: "Course not found" });
    }
    db.all(
      "SELECT * FROM comments WHERE courseId = ?",
      [courseId],
      (err, comments) => {
        if (err) {
          res.status(500).json({ error: "Database error" });
          return;
        }
        res.json(comments);
      }
    );
  });
});

// POST a new comment for a course
// Make the handler async to use await
app.post("/api/courses/:id/comments", async (req, res) => {
  const courseId = parseInt(req.params.id);
  // chatbot = new chatbot(); // Remove instantiation from here

  // First, check if course exists (moved this check up)
  db.get("SELECT * FROM courses WHERE id = ?", [courseId], async (err, row) => {
    // Make this callback async too
    if (err) {
      return res.status(500).json({ error: "Database error checking course" });
    }
    if (!row) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Basic validation for incoming data
    const { userName, text } = req.body;
    if (!userName || !text || typeof text !== "string" || text.trim() === "") {
      return res
        .status(400)
        .json({ error: "Missing or invalid userName or text" });
    }
    if (text.length > 500) {
      return res
        .status(400)
        .json({ error: "Comment is too long (max 500 characters)" });
    }

    try {
      // Call the asynchronous moderation function and wait for the result
      const moderationResult = await chatbot.moderate(text);

      if (moderationResult.decision === "block") {
        console.log(
          `Comment blocked: "${text}". Reason: ${moderationResult.reason}`
        );
        // Return a user-friendly message, maybe not always the raw reason
        return res.status(403).json({
          error: moderationResult.reason,
          // reason: moderationResult.reason // Optionally include reason, maybe only for specific block types
        });
      }

      // If allowed, proceed to insert
      console.log(`Comment allowed: "${text}"`);
      const comment = {
        id: Date.now(), // Using timestamp as ID
        courseId,
        userName: userName, // Use validated userName
        text: text, // Use validated text
        date: new Date().toISOString(), // Use server time
      };

      const stmt = db.prepare(
        "INSERT INTO comments (id, courseId, userName, text, date) VALUES (?, ?, ?, ?, ?)"
      );

      // Use a Promise wrapper for db operations for cleaner async/await
      await new Promise((resolve, reject) => {
        stmt.run(
          comment.id,
          comment.courseId,
          comment.userName,
          comment.text,
          comment.date,
          (runErr) => {
            stmt.finalize(); // Finalize statement regardless of error
            if (runErr) {
              console.error("Database insert error:", runErr);
              return reject(new Error("Database error inserting comment"));
            }
            resolve();
          }
        );
      });

      res.status(201).json(comment); // Send back the created comment
    } catch (moderationOrDbError) {
      // Catch errors from moderation or DB insertion
      console.error("Error processing comment:", moderationOrDbError);
      res.status(500).json({
        error: "An internal error occurred while processing your comment.",
      });
    }
  }); // End of db.get callback
});

// ---------------------
// Chatbot Endpoint
// ---------------------

// POST a message to the chatbot
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "Message cannot be empty." });
  }

  try {
    // For now, each request creates a new conversation context.
    // We could enhance this with session management later.
    // Using the single chatbot instance created at the start.
    // Note: The current Chatbot class stores history *within the instance*.
    // If multiple users hit this endpoint concurrently, their histories might mix
    // unless the Chatbot class or this endpoint logic is adapted.
    // For simplicity now, we'll let the chatbot handle its internal state,
    // but a better approach for multi-user would be needed.

    // We'll use a specific system prompt for this endpoint.
    const systemPrompt = `You are a helpful and friendly course counselor chatbot for the Pleasanton Unified School District. 
      Your goal is to assist students in finding suitable courses based on their interests, goals, and academic level. 
      Provide concise and relevant information about courses, prerequisites, and potential pathways. 
      
      **Tool Usage Guidelines:**
      - To search for courses based on topics (e.g., 'physics', 'calculus', 'history', 'animation', 'computer science', 'programming'), use the 'searchCourses' tool with the 'keyword' parameter. This searches within course names and descriptions.
      - Use the 'subject' parameter *only* if the user specifically asks to filter by one of these exact subject categories: 
        '2024-2025', 'Child Development And Family Services', 'Engineering And Architecture', 'Health Services And Medical Technology', 'Media And Entertainment', 'Other English Courses', 'Performing Arts', 'Public Services', 'Sales And Service', 'Senior English Courses', 'Tourism And Recreation', 'Transportation Technology'.
      - Do *not* use the 'subject' parameter for general topic keywords like 'math' or 'science'. Use the 'keyword' parameter instead.
      - For course levels, use 'P' for Regular or 'HP' for Honors. Do not use other level codes.`;

    // Send the message using the chatbot instance
    const botResponse = await chatbot.sendMessage(message, systemPrompt);

    // Assuming sendMessage returns the string response or throws an error
    res.json({ response: botResponse });
  } catch (error) {
    console.error("Error processing chat message:", error);
    // Send a generic error message to the client
    res
      .status(500)
      .json({ error: "Sorry, I encountered an error trying to respond." });
  }
});

// ---------------------
// Start the Server
// ---------------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
