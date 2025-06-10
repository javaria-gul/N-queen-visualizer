import React, { useState, useEffect } from "react";
import "./App.css";
import queenImg from "./assets/queen.png";

const NQueensVisualizer = ({ size = 8 }) => {
  const [board, setBoard] = useState(Array(size).fill(null));
  const [log, setLog] = useState([]);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [highlightLine, setHighlightLine] = useState(null);
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  const [language, setLanguage] = useState("python");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [speed, setSpeed] = useState(500); // Animation speed in ms

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const codeSnippets = {
    python: [
      "def solve(board, row):",
      "    if row == N:",
      "        print(board)",
      "        return True",
      "    for col in range(N):",
      "        if is_valid(board, row, col):",
      "            board[row] = col",
      "            if solve(board, row + 1):",
      "                return True",
      "            board[row] = -1",
      "    return False"
    ],
    cpp: [
      "bool solve(int row) {",
      "  if (row == N) return true;",
      "  for (int col = 0; col < N; ++col) {",
      "    if (isValid(row, col)) {",
      "      board[row] = col;",
      "      if (solve(row + 1)) return true;",
      "      board[row] = -1;",
      "    }",
      "  }",
      "  return false;",
      "}"
    ],
    java: [
      "boolean solve(int row) {",
      "  if (row == N) return true;",
      "  for (int col = 0; col < N; col++) {",
      "    if (isValid(row, col)) {",
      "      board[row] = col;",
      "      if (solve(row + 1)) return true;",
      "      board[row] = -1;",
      "    }",
      "  }",
      "  return false;",
      "}"
    ]
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const isValid = (b, r, c) => {
    for (let i = 0; i < r; i++) {
      const qCol = b[i];
      if (qCol === c || Math.abs(qCol - c) === r - i) return false;
    }
    return true;
  };

  const resetBoard = () => {
    setBoard(Array(size).fill(null));
    setLog([]);
    setRunning(false);
    setPaused(false);
  };

  const togglePause = () => {
    setPaused(!paused);
  };

  const solveAll = async () => {
    if (running) {
      if (paused) {
        setPaused(false);
      } else {
        togglePause();
      }
      return;
    }

    setRunning(true);
    setLog([]);
    resetBoard();
    
    const backtrack = async (r, b) => {
      if (paused) {
        await new Promise(resolve => {
          const checkPause = () => {
            if (!paused) return resolve();
            setTimeout(checkPause, 100);
          };
          checkPause();
        });
      }

      if (r === size) {
        setBoard([...b]);
        setRunning(false);
        setLog(prev => [...prev, "Solution found!"]);
        return true;
      }

      for (let c = 0; c < size; c++) {
        setHighlightLine(5);
        await delay(speed);
        
        if (isValid(b, r, c)) {
          setHighlightLine(6);
          const newBoard = [...b];
          newBoard[r] = c;
          setBoard(newBoard);
          setLog(prev => [`Placed queen at row ${r+1}, col ${c+1}`, ...prev]);
          await delay(speed);

          setHighlightLine(7);
          const found = await backtrack(r + 1, newBoard);
          if (found) return true;

          setHighlightLine(8);
          newBoard[r] = null;
          setBoard(newBoard);
          setLog(prev => [`Backtracked from row ${r+1}, col ${c+1}`, ...prev]);
          await delay(speed/2);
        }
      }
      return false;
    };

    await backtrack(0, Array(size).fill(null));
    if (!board.some(col => col !== null)) {
      setLog(prev => [...prev, "No solution exists for this configuration"]);
    }
    setRunning(false);
  };

  return (
    <div className="visualizer-container">
      {/* Mobile Hamburger Menu */}
      {isMobile && !showMobilePanel && (
        <div className="hamburger" onClick={() => setShowMobilePanel(true)}>☰</div>
      )}

      <div className="left-panel">
        <div className="solver-controls">
          <button onClick={solveAll} className={`solve-btn ${running ? (paused ? 'paused' : 'running') : ''}`}>
            {running ? (paused ? '▶ Resume' : '⏸ Pause') : '▶ Start Solving'}
          </button>
          <button className="back-btn" onClick={() => window.location.reload()}>
            ↩ Back to Start
          </button>
          <button className="reset-btn" onClick={resetBoard} disabled={running && !paused}>
            🔁 Reset
          </button>
          <div className="speed-control">
            <label>Speed:</label>
            <input 
              type="range" 
              min="50" 
              max="1000" 
              step="50"
              value={speed} 
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              disabled={running && !paused}
            />
          </div>
        </div>

        <div className="board" style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`
        }}>
          {Array(size).fill().map((_, row) =>
            Array(size).fill().map((_, col) => (
              <div key={`${row}-${col}`} className={`cell ${(row + col) % 2 ? "black" : "white"}`}>
                {board[row] === col && <img src={queenImg} className="queen-symbol" alt="queen" />}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Desktop Right Panel */}
      <div className="right-panel">
        <div className="right-panel-content">
          <div className="code-box">
            <div className="code-header">
              <span>Code ({language.toUpperCase()})</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="language-selector"
                disabled={running && !paused}
              >
                {Object.keys(codeSnippets).map(lang => (
                  <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div className="code-content">
              {codeSnippets[language].map((line, idx) => (
                <div
                  key={idx}
                  className={`code-line ${highlightLine === idx ? "highlight" : ""}`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
          
          <div className="log-box">
            <div className="log-header">
              Backtracking Log
              <button onClick={() => setLog([])} className="clear-log">
                Clear
              </button>
            </div>
            <div className="log-content">
              {log.map((entry, i) => <div key={i} className="log-entry">{entry}</div>)}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Right Panel */}
      {showMobilePanel && (
        <div className="right-panel-mobile">
          <div className="mobile-panel-content">
            <button className="close-btn" onClick={() => setShowMobilePanel(false)}>×</button>
            <div className="code-box">
              <div className="code-header">
                <span>Code ({language.toUpperCase()})</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="language-selector"
                >
                  {Object.keys(codeSnippets).map(lang => (
                    <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div className="code-content">
                {codeSnippets[language].map((line, idx) => (
                  <div
                    key={idx}
                    className={`code-line ${highlightLine === idx ? "highlight" : ""}`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
            <div className="log-box">
              <div className="log-header">Backtracking Log</div>
              <div className="log-content">
                {log.map((entry, i) => <div key={i} className="log-entry">{entry}</div>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NQueensVisualizer;