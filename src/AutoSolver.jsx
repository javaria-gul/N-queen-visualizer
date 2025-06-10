import React, { useState } from "react";
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

  const codeSnippets = {
    python: [
      "def solve(board, row):",
      "    if row == N:",
      "        print(board)",
      "        return",
      "    for col in range(N):",
      "        if is_valid(board, row, col):",
      "            board[row] = col",
      "            solve(board, row + 1)",
      "            board[row] = -1",
    ],
    cpp: [
      "void solve(int row) {",
      "  if (row == N) { print(); return; }",
      "  for (int col = 0; col < N; ++col) {",
      "    if (isValid(row, col)) {",
      "      board[row] = col;",
      "      solve(row + 1);",
      "      board[row] = -1;",
      "    }",
      "  }",
      "}"
    ],
    java: [
      "void solve(int row) {",
      "  if (row == N) { printBoard(); return; }",
      "  for (int col = 0; col < N; col++) {",
      "    if (isValid(row, col)) {",
      "      board[row] = col;",
      "      solve(row + 1);",
      "      board[row] = -1;",
      "    }",
      "  }",
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

  const solveAll = async () => {
    setRunning(true);
    setLog([]);
    setBoard(Array(size).fill(null));

    const backtrack = async (r, b) => {
      if (r === size) {
        setBoard([...b]);
        setRunning(false);
        return true;
      }

      for (let c = 0; c < size; c++) {
        setHighlightLine(5);
        await delay(600);

        if (isValid(b, r, c)) {
          setHighlightLine(6);
          const newBoard = [...b];
          newBoard[r] = c;
          setBoard(newBoard);
          setLog(prev => [`Placed queen at row ${r + 1}, col ${c + 1}`, ...prev]);

          setHighlightLine(7);
          const found = await backtrack(r + 1, newBoard);
          if (found) return true;

          setHighlightLine(8);
          newBoard[r] = null;
          setBoard(newBoard);
          setLog(prev => [`Backtracked from row ${r + 1}, col ${c + 1}`, ...prev]);
          await delay(100);
        }
      }
      return false;
    };

    await backtrack(0, Array(size).fill(null));
  };

  return (
    <div className="visualizer-container">

      {!showMobilePanel && (
        <div className="hamburger" onClick={() => setShowMobilePanel(true)}>☰</div>
      )}


      {showMobilePanel && (
        <div className="right-panel-mobile">
          <button className="close-btn" onClick={() => setShowMobilePanel(false)}>×</button>
          {/* ... rest of mobile panel content ... */}
        </div>
      )}

      <div className="left-panel">
        <div className="solver-controls">
          <button onClick={solveAll} disabled={running} className="solve-btn">
            ▶ Start Solving
          </button>
          <button className="back-btn" onClick={() => window.location.reload()}>
            ↩ Back to Start
          </button>
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

      <div className="right-panel">
        <div className="right-panel-content">
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