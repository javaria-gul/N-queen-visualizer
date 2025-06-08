import React, { useState } from "react";
import StartScreen from "./StartScreen";
import TutorialModal from "./TutorialModal";
import Board from "./board.jsx";
import "./App.css";

function App() {
  const [started, setStarted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [size, setSize] = useState(8);
  const [mode, setMode] = useState("manual");

  const handleStart = (selectedSize, selectedMode) => {
    setSize(selectedSize);
    setMode(selectedMode);
    if (selectedMode === "manual") {
      setShowTutorial(true);
    } else {
      setStarted(true);
    }
  };

  const handleTutorialClose = () => {
    setShowTutorial(false);
    setStarted(true);
  };

  return (
    <>
      {!started ? (
        <StartScreen onStart={handleStart} />
      ) : (
        <div className="app">
          <h1 className="title">
            N-Queens ({size}x{size}) - Mode: {mode}
          </h1>
          {mode === "manual" && <Board size={size} />}
        </div>
      )}

      {showTutorial && <TutorialModal onClose={handleTutorialClose} />}
    </>
  );
}

export default App;
