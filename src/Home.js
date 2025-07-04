import React from "react";
import { Link } from "react-router-dom";

function Home() {
  const quote = "You’ve survived 100% of your worst days so far.";

  return (
    <div style={{
      textAlign: "center",
      padding: "4rem",
      fontFamily: "Inter, sans-serif",
      backgroundColor: "#f0f4f8",
      minHeight: "100vh"
    }}>
      <h1>MediMind</h1>
      <blockquote style={{
        fontStyle: "italic",
        background: "#fff",
        padding: "1rem",
        margin: "2rem auto",
        maxWidth: "500px",
        borderLeft: "5px solid #4f46e5"
      }}>
        “{quote}”
      </blockquote>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
        Take a mental health screener to learn more about how you're feeling.
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <Link to="/gad7">
          <button style={buttonStyle}>Take GAD-7 (Anxiety)</button>
        </Link>
        <Link to="/phq9">
          <button style={buttonStyle}>Take PHQ-9 (Depression)</button>
        </Link>
      </div>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: "#4f46e5",
  color: "white",
  padding: "1rem 1.5rem",
  borderRadius: "0.5rem",
  fontSize: "1rem",
  border: "none",
  cursor: "pointer",
  transition: "background 0.3s",
};

export default Home;
