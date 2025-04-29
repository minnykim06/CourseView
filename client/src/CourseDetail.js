import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./CourseDetail.css";

export default function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch course details
  useEffect(() => {
    setLoading(true);

    fetch(`http://localhost:5001/api/courses/${courseId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Course not found");
        return res.json();
      })
      .then((data) => {
        setCourse(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load course details");
      })
      .finally(() => {
        setLoading(false);
      });

    // Also fetch comments for this course
    fetch(`http://localhost:5001/api/courses/${courseId}/comments`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data || []);
      })
      .catch((err) => {
        console.error("Failed to load comments:", err);
      });
  }, [courseId]);

  // Render difficulty dots
  const renderDifficultyDots = (difficulty) => {
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

  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();

    if (!newComment.trim() || !userName.trim()) {
      alert("Please enter your name and comment");
      return;
    }

    setIsSubmitting(true);

    // Optimistically create comment object, but don't add to state yet
    const commentPayload = {
      // No ID needed, server generates it
      userName: userName,
      text: newComment,
      // date: new Date().toISOString(), // Server sets the date
    };

    fetch(`http://localhost:5001/api/courses/${courseId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentPayload), // Send only necessary fields
    })
      .then(async (res) => {
        // Make the callback async to await res.json()
        const responseData = await res.json(); // Try to parse JSON regardless of status
        if (!res.ok) {
          // If response is not OK (e.g., 403, 400, 500), throw an error with the message from server
          const error = new Error(
            responseData.error || `HTTP error! status: ${res.status}`
          );
          error.status = res.status;
          error.data = responseData; // Attach full response data if needed
          throw error;
        }
        return responseData; // If OK (status 201), return the created comment data
      })
      .then((createdComment) => {
        // Success! Add the comment returned by the server to the local state
        setComments((prevComments) => [...prevComments, createdComment]);
        setNewComment("");
        // Optionally clear username too: setUserName('');
      })
      .catch((err) => {
        console.error("Failed to post comment:", err);
        // Display the specific error message from the server, or a generic one
        const errorMessage =
          err.data?.error ||
          err.message ||
          "Sorry, there was an error posting your comment.";
        alert(`Comment not posted: ${errorMessage}`);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (loading)
    return (
      <div className="detail-container">
        <p className="status">Loading course details...</p>
      </div>
    );
  if (error)
    return (
      <div className="detail-container">
        <p className="status error">{error}</p>
      </div>
    );
  if (!course)
    return (
      <div className="detail-container">
        <p className="status error">Course not found</p>
      </div>
    );

  return (
    <div className="detail-container">
      <Link to="/" className="back-button">
        ← Back to Courses
      </Link>
      <div className="detail-header">
        <h1>{course.name}</h1>
        <div className="course-code">{course.code}</div>
      </div>

      <div className="detail-content">
        <div className="course-info-panel">
          <div className="info-section">
            <h2>Course Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <h3>Subject</h3>
                <p>{course.subject}</p>
              </div>
              <div className="info-item">
                <h3>Level</h3>
                <p>{course.level}</p>
              </div>
              <div className="info-item">
                <h3>Difficulty</h3>
                <div className="difficulty-rating">
                  {renderDifficultyDots(course.difficulty)}
                  <span className="difficulty-text">{course.difficulty}/5</span>
                </div>
              </div>
              {course.prerequisites && course.prerequisites.trim() !== "" && (
                <div className="info-item prerequisites">
                  <h3>Prerequisites</h3>
                  <p>{course.prerequisites}</p>
                </div>
              )}
            </div>
          </div>

          <div className="info-section">
            <h2>Description</h2>
            <p className="course-description">{course.description}</p>
          </div>
        </div>

        <div className="comments-panel">
          <h2>
            Student Comments{" "}
            <span className="comment-count">({comments.length})</span>
          </h2>

          <div className="comment-form-container">
            <h3>Add Your Comment</h3>
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <div className="form-group">
                <label htmlFor="userName">Your Name</label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="commentText">Comment</label>
                <textarea
                  id="commentText"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience with this course..."
                  rows="4"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <button
                type="submit"
                className={`submit-button ${isSubmitting ? "loading" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Post Comment"}
              </button>
            </form>
          </div>

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <span className="comment-author">{comment.userName}</span>
                    <span className="comment-date">
                      {new Date(comment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
