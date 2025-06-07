import React, { useState } from "react";
import "./App.css";

function App() {
  const [size, setSize] = useState(4);
  const [solutions, setSolutions] = useState([]);

  const solveNQueens = () => {
    const res = [];
    const board = Array(size).fill().map(() => Array(size).fill("."));

    const isSafe = (row, col) => {
      for (let i = 0; i < row; i++) {
        if (board[i][col] === "Q") return false;
        if (col - (row - i) >= 0 && board[i][col - (row - i)] === "Q") return false;
        if (col + (row - i) < size && board[i][col + (row - i)] === "Q") return false;
      }
      return true;
    };

    const backtrack = (row) => {
      if (row === size) {
        res.push(board.map(r => r.join("")));
        return;
      }
      for (let col = 0; col < size; col++) {
        if (isSafe(row, col)) {
          board[row][col] = "Q";
          backtrack(row + 1);
          board[row][col] = ".";
        }
      }
    };

    backtrack(0);
    setSolutions(res);
  };

  return (
    <div className="container">
      <h1>N-Queens Visualizer</h1>
      <div>
        <label>Board Size: </label>
        <input type="number" value={size} onChange={e => setSize(Number(e.target.value))} min="4" max="10" />
        <button onClick={solveNQueens}>Solve</button>
      </div>
      <div className="solutions">
        {solutions.map((sol, i) => (
          <div key={i} className="board">
            {sol.map((row, rIdx) => (
              <div key={rIdx} className="row">
                {row.split("").map((cell, cIdx) => (
                  <div key={cIdx} className={`cell ${cell === "Q" ? "queen" : ""}`}></div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
