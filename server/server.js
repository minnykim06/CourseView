const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = path.join(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database", err);
  } else {
    console.log("Connected to SQLite database");
    //TODO: DELETE THIS - BAD PRACTICE
    db.serialize(() => {
      // Commented code is database initialization - it can be deleted now that I have the db created

      // db.run(`CREATE TABLE IF NOT EXISTS courses (
      //   id INTEGER PRIMARY KEY,
      //   code TEXT,
      //   name TEXT,
      //   subject TEXT,
      //   level TEXT,
      //   description TEXT,
      //   prerequisites TEXT,
      //   difficulty INTEGER
      // )`);

      // db.run(`CREATE TABLE IF NOT EXISTS comments (
      //   id INTEGER PRIMARY KEY,
      //   courseId INTEGER,
      //   userName TEXT,
      //   text TEXT,
      //   date TEXT,
      //   FOREIGN KEY (courseId) REFERENCES courses(id)
      // )`);
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
app.post("/api/courses/:id/comments", (req, res) => {
  const courseId = parseInt(req.params.id);
  db.get("SELECT * FROM courses WHERE id = ?", [courseId], (err, row) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
      return;
    }
    if (!row) {
      return res.status(404).json({ error: "Course not found" });
    }

    const comment = {
      id: Date.now(), // Using timestamp as ID for simplicity
      courseId,
      userName: req.body.userName,
      text: req.body.text,
      date: req.body.date || new Date().toISOString(),
    };

    const stmt = db.prepare(
      "INSERT INTO comments (id, courseId, userName, text, date) VALUES (?, ?, ?, ?, ?)"
    );
    stmt.run(
      comment.id,
      comment.courseId,
      comment.userName,
      comment.text,
      comment.date,
      (err) => {
        if (err) {
          res.status(500).json({ error: "Database error" });
          return;
        }
        res.status(201).json(comment);
      }
    );
    stmt.finalize();
  });
});

// ---------------------
// Start the Server
// ---------------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
