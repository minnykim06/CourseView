import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import './App.css';

function App() {
  // State
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all courses once
  useEffect(() => {
    setLoading(true);
  
    fetch('http://localhost:5001/api/courses')
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(data => {
        setCourses(data);
        setFilteredCourses(data);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load courses');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Re‑filter whenever filters or courses change
  useEffect(() => {
    let temp = [...courses];

    if (subjectFilter !== 'All') {
      temp = temp.filter((c) => c.subject === subjectFilter);
    }

    if (levelFilter !== 'All') {
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

      <div className="controls">
        <div className="control-group">
          <label>Choose Subject</label>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Career and Technical Education">
              Career and Technical Education
            </option>
            <option value="English">English</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physical Education">Physical Education</option>
            <option value="Science">Science</option>
            <option value="Social Science">Social Science</option>
            <option value="Special Education">Special Education</option>
            <option value="Visual and Performing Arts">
              Visual and Performing Arts
            </option>
            <option value="World Languages">World Languages</option>
            <option value="Additional Courses">Additional Courses</option>
          </select>
        </div>

        <div className="control-group">
          <label>Choose Level</label>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Regular">Regular</option>
            <option value="Honors">Honors</option>
            <option value="AP">AP</option>
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

      {!loading && !error && (
        filteredCourses.length === 0 ? (
          <p className="status">No classes are shown</p>
        ) : (
          <div className="courses-grid">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default App;
