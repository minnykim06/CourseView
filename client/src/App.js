import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CourseCard from "./CourseCard";
import CourseDetail from "./CourseDetail";
import ChatbotWidget from "./ChatbotWidget";
import "./App.css";

// Home page component with course listings
function CoursesList() {
  // State
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all courses once
  useEffect(() => {
    setLoading(true);

    fetch("http://localhost:5001/api/courses")
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        setCourses(data);
        setFilteredCourses(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load courses");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Re‑filter whenever filters or courses change
  useEffect(() => {
    let temp = [...courses];

    if (subjectFilter !== "All") {
      temp = temp.filter((c) => c.subject === subjectFilter);
    }

    if (levelFilter !== "All") {
      temp = temp.filter((c) => c.level === levelFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      temp = temp.filter((c) => c.name.toLowerCase().includes(term));
    }

    setFilteredCourses(temp);
  }, [courses, subjectFilter, levelFilter, searchTerm]);

  return (
    <div className="container">
      <h1 className="title">CourseView @ PUSD</h1>
      <p className="subtitle">
        Find and explore courses available at Pleasanton Unified School District
      </p>

      <div className="controls">
        <div className="control-group">
          <label>Choose Subject</label>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Media And Entertainment">
              Media And Entertainment
            </option>
            <option value="Child Development And Family Services">
              Child Development And Family Services
            </option>
            <option value="Engineering And Architecture">
              Engineering And Architecture
            </option>
            <option value="Health Services And Medical Technology">
              Health Services And Medical Technology
            </option>
            <option value="Tourism And Recreation">
              Tourism And Recreation
            </option>
            <option value="Sales And Service">Sales And Service</option>
            <option value="Public Services">Public Services</option>
            <option value="Transportation Technology">
              Transportation Technology
            </option>
            <option value="Senior English Courses">
              Senior English Courses
            </option>
            <option value="Other English Courses">Other English Courses</option>
            <option value="Performing Arts">Performing Arts</option>
          </select>
        </div>

        <div className="control-group">
          <label>Choose Level</label>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="P">Regular (P)</option>
            <option value="HP">Honors (HP)</option>
          </select>
        </div>

        <div className="control-group">
          <label>Search by Name</label>
          <input
            type="text"
            placeholder="Type a course name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading && <p className="status">Loading courses…</p>}
      {error && <p className="status error">{error}</p>}

      {!loading &&
        !error &&
        (filteredCourses.length === 0 ? (
          <p className="status">No classes are shown</p>
        ) : (
          <div className="courses-grid">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ))}
    </div>
  );
}

// Main App component with routing setup
function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<CoursesList />} />
          <Route path="/course/:courseId" element={<CourseDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ChatbotWidget />
      </div>
    </Router>
  );
}

export default App;
