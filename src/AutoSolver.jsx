import React, { useState } from "react";
import "./App.css";
import queenImg from "./assets/queen.png";

const NQueensVisualizer = ({ size }) => {
  const [board, setBoard] = useState(Array.from({ length: size }, () => null));
  const [log, setLog] = useState([]);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [highlightLine, setHighlightLine] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
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
    ],
    c: [
      "void solve(int row) {",
      "  if (row == N) { print(); return; }",
      "  for (int col = 0; col < N; col++) {",
      "    if (isValid(row, col)) {",
      "      board[row] = col;",
      "      solve(row + 1);",
      "      board[row] = -1;",
      "    }",
      "  }",
      "}"
    ],
    csharp: [
      "void Solve(int row) {",
      "  if (row == N) { Print(); return; }",
      "  for (int col = 0; col < N; col++) {",
      "    if (IsValid(row, col)) {",
      "      board[row] = col;",
      "      Solve(row + 1);",
      "      board[row] = -1;",
      "    }",
      "  }",
      "}"
    ]
  };

  const delay = (ms) =>
  new Promise((resolve) => {
    let elapsed = 0;
    const interval = 50; // ms

    function wait() {
      if (!paused) {
        elapsed += interval;
      }
      if (elapsed >= ms) {
        resolve();
      } else {
        setTimeout(wait, interval);
      }
    }
    wait();
  });


  const isValid = (b, r, c) => {
    for (let i = 0; i < r; i++) {
      const qCol = b[i];
      if (qCol === c || Math.abs(qCol - c) === r - i) return false;
    }
    return true;
  };

  const solveAll = () => {
    const result = [];

    const backtrack = async (r, b) => {
      if (r === size) {
        result.push([...b]);
        setBoard([...b]);
        setRunning(false);
        setHighlightLine(null);
        return true; // stop after first solution
      }

      for (let c = 0; c < size; c++) {
        setHighlightLine(5);
        await delay(600);
        if (isValid(b, r, c)) {
          setHighlightLine(6);
          await delay(600);
          const newBoard = [...b];
          newBoard[r] = c;
          setBoard([...newBoard]);
          setLog((prev) => [`Placed queen at row ${r + 1}, col ${c + 1}`, ...prev]);
          setHighlightLine(7);
          await delay(600);
          const found = await backtrack(r + 1, newBoard);
          if (found) return true;
          setHighlightLine(8);
          newBoard[r] = null;
          setBoard([...newBoard]);
          setLog((prev) => [`Backtracked from row ${r + 1}, col ${c + 1}`, ...prev]);
          await delay(100);
        }
      }
      return false;
    };

    (async () => {
      setRunning(true);
      setLog([]);
      const emptyBoard = Array.from({ length: size }, () => null);
      setBoard(emptyBoard);
      await backtrack(0, [...emptyBoard]);
    })();
  };

  return (
    <div className="visualizer-container full-height">
      <div className="hamburger" onClick={() => setShowPanel(!showPanel)}>
        ☰
      </div>

      <div className="left-panel">
        <div className="solver-controls">
          <button onClick={solveAll} disabled={running} className="solve-btn">
            ▶ Start Solving
          </button>
          <button className="back-btn" onClick={() => window.location.reload()}>
          ↩ Back to Start
        </button>
      
         
        </div>
        <div
          className="board"
          style={{
            gridTemplateColumns: `repeat(${size}, 50px)`,
            gridTemplateRows: `repeat(${size}, 50px)`
          }}
        >
          {[...Array(size)].map((_, row) =>
            [...Array(size)].map((_, col) => {
              const isBlack = (row + col) % 2 === 1;
              const hasQueen = board[row] === col;
              return (
                <div
                  key={`${row}-${col}`}
                  className={`cell ${isBlack ? "black" : "white"}`}
                >
                  {hasQueen && (
                    <img src={queenImg} className="queen-symbol" alt="queen" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className={`right-panel ${showPanel ? "show" : ""}`}>
        <div className="code-box">
          <h3 className="panel-title">Code ({language.toUpperCase()})</h3>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="language-selector"
          >
            {Object.keys(codeSnippets).map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
          <pre>
            {codeSnippets[language].map((line, idx) => (
              <div
                key={idx}
                className={`code-line ${
                  highlightLine === idx ? "highlight" : ""
                }`}
              >
                {line}
              </div>
            ))}
          </pre>
        </div>
        <div className="log-box">
          <h3 className="panel-title">Backtracking Log</h3>
          <ul>
            {log.map((entry, index) => (
              <li key={index}>{entry}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NQueensVisualizer;
