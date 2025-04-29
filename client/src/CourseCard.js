import React from "react";
import { Link } from "react-router-dom";
import "./CourseCard.css";

export default function CourseCard({ course }) {
  const {
    id,
    code,
    name,
    subject,
    level,
    description,
    prerequisites,
    difficulty,
  } = course;

  // Create dots for difficulty rating
  const renderDifficultyDots = () => {
    const dots = [];
    for (let i = 1; i <= 5; i++) {
      dots.push(
        <span
          key={i}
          className={`dot ${i <= difficulty ? "filled" : ""}`}
          title={`${i}/5 difficulty`}
        />
      );
    }
    return dots;
  };

  return (
    <div className="card">
      {/* Course title with code */}
      <h3 className="card-title">
        {code} — {name}
      </h3>

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
      {prerequisites && prerequisites.trim() !== "" && (
        <p className="card-meta">
          <strong>Prerequisites:</strong> {prerequisites}
        </p>
      )}

      {/* Difficulty rating with visual indicator */}
      {/* <p className="card-meta">
        <strong>Difficulty:</strong>
        <span className="difficulty-rating">
          {renderDifficultyDots()}
          <span className="difficulty-text">{difficulty}/5</span>
        </span>
      </p> */}

      {/* Action button linked to details page */}
      <Link to={`/course/${id}`} className="card-button">
        Learn more
      </Link>
    </div>
  );
}
