import React from 'react';
import './CourseCard.css';

export default function CourseCard({ course }) {
  const {
    code,
    name,
    subject,
    level,
    description,
    prerequisites,
    difficulty,
  } = course;

  return (
    <div className="card">
      {/* Course title with code */}
      <h3 className="card-title">{code} — {name}</h3>

      {/* Course metadata */}
      <p className="card-meta">
        <strong>Subject:</strong> {subject}
      </p>
      <p className="card-meta">
        <strong>Level:</strong> {level}
      </p>

      {/* Detailed description */}
      <div className="card-description">
        <strong>Description:</strong>
        <p>{description}</p>
      </div>

      {/* Prerequisites (only if provided) */}
      {prerequisites && prerequisites.trim() !== '' && (
        <p className="card-meta">
          <strong>Prerequisites:</strong> {prerequisites}
        </p>
      )}

      {/* Difficulty rating */}
      <p className="card-meta">
        <strong>Difficulty:</strong> {difficulty}/5
      </p>

      {/* Action button */}
      <button className="card-button">Learn more</button>
    </div>
  );
}