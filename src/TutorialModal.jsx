import React, { useState } from "react";
import "./App.css";

const steps = [
  "Welcome to the N-Queens Puzzle!",
  "The goal is to place N queens on the board such that no two queens attack each other.",
  "Queens can move horizontally, vertically, and diagonally.",
  "Try placing one queen per row, and avoid conflicts.",
  "Let’s start solving step by step!"
];

export default function TutorialModal({ onClose }) {
  const [stepIndex, setStepIndex] = useState(0);

  const nextStep = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onClose(true); // ✅ Only start game if tutorial finished
    }
  };

  const handleCancel = () => {
    onClose(false); // ✅ Just close modal, don't start game
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2 className="modal-title">📘 Tutorial</h2>
        <p className="modal-step">{steps[stepIndex]}</p>

        <div className="modal-buttons">
          <button onClick={nextStep} className="modal-button">
            {stepIndex === steps.length - 1 ? "Start Playing" : "Next"}
          </button>
          <button onClick={handleCancel} className="modal-button cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
