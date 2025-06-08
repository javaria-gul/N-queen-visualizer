import React, { useState } from "react";
import "./App.css";

export default function StartScreen({ onStart }) {
  const [size, setSize] = useState(8);
  const [mode, setMode] = useState("manual");

  return (
    <div className="start-screen">
      <h1>Select Board Size</h1>
      <input
        type="number"
        min="4"
        max="20"
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
      />

      <div className="start-buttons">
        <button className="manual" onClick={() => onStart(size, "manual")}>
          Play Yourself
        </button>
        <button className="auto" onClick={() => onStart(size, "auto")}>
          Auto Solve
        </button>
      </div>
    </div>
  );
}
