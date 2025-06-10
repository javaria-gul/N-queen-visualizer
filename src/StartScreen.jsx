import React, { useState } from "react";
import "./App.css";

export default function StartScreen({ onStart }) {
  const [size, setSize] = useState(8);
  const [mode, setMode] = useState("manual");
  const [error, setError] = useState("");

  const handleSizeChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      setSize("");
      setError("");
      return;
    }
    
    if (value < 4 || value > 8) {
      setError("Please enter a number between 4 and 8");
    } else {
      setError("");
    }
    setSize(value);
  };

  const handleStart = (selectedMode) => {
    if (size < 4 || size > 8 || isNaN(size)) {
      setError("Please enter a valid board size (4-8)");
      return;
    }
    setError("");
    onStart(size, selectedMode);
  };

  return (
    <div className="start-screen">
      <div className="start-card">
        <div>
          <h1>Select Board Size</h1>
          <input
            type="number"
            min="4"
            max="8"
            value={size}
            onChange={handleSizeChange}
            onBlur={() => {
              if (size < 4) setSize(4);
              if (size > 8) setSize(8);
            }}
          />
          {error && <p className="error-message">{error}</p>}

          <div className="start-buttons">
            <button 
              className="manual" 
              onClick={() => handleStart("manual")}
            >
              Play Yourself
            </button>
            <button 
              className="auto" 
              onClick={() => handleStart("auto")}
            >
              Auto Solve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}