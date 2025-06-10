import React, { useState } from "react";
import "./App.css";

function isInvalidCell(row, col, queens) {
  for (const q of queens) {
    const qRow = q.row;
    const qCol = q.col;

    if (
      qRow === row ||                // same row
      qCol === col ||                // same column
      Math.abs(qRow - row) === Math.abs(qCol - col) // diagonal
    ) {
      return true;
    }
  }
  return false;
}


export default function Board({ size, onSwitchToAuto }) {

  const [queens, setQueens] = useState([]);
  const [history, setHistory] = useState([]); // for tracking last move

  const handleClick = (row, col) => {
    // Check if clicked cell has the last placed queen -> allow removal
    if (
      queens.length > 0 &&
      queens[queens.length - 1].row === row &&
      queens[queens.length - 1].col === col
    ) {
      const updatedQueens = queens.slice(0, -1);
      setQueens(updatedQueens);
      setHistory(history.slice(0, -1));
      return;
    }

    // Prevent placing on already filled row or on invalid cell
    if (queens.some((q) => q.row === row) || isInvalidCell(row, col, queens)) {
      return;
    }

    const newQueen = { row, col };
    setQueens([...queens, newQueen]);
    setHistory([...history, `${row}-${col}`]);
  };

  const isQueenHere = (row, col) =>
    queens.some((q) => q.row === row && q.col === col);

  const isLastQueen = (row, col) =>
    queens.length > 0 &&
    queens[queens.length - 1].row === row &&
    queens[queens.length - 1].col === col;

  const resetBoard = () => {
    setQueens([]);
    setHistory([]);
  };

  return (
    <div>
      <h2 className="title">
        {queens.length === size
          ? "🎉 You Solved It!"
          : `Place Queens 👑 (${queens.length}/${size})`}
      </h2>

      <div className="reset-container">
        <button className="reset-btn" onClick={resetBoard}>🔁 Reset Board</button>
        <button className="auto-btn" onClick={onSwitchToAuto}>⚡ Auto Solve</button>
        <button
          className="back-btn"
          onClick={() => window.location.reload()}
        >
          ↩ Back to Start
        </button>
      </div>

      <div className="board-container">
      <div className="board-wrapper">
        <div
          className="board"
          style={{
            '--board-size': size,
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            gridTemplateRows: `repeat(${size}, 1fr)`
          }}
        >

          {[...Array(size)].map((_, row) =>
            [...Array(size)].map((_, col) => {
              const isBlack = (row + col) % 2 === 1;
              const isQueen = isQueenHere(row, col);
              const invalid = isInvalidCell(row, col, queens);
              const isLast = isLastQueen(row, col);


              return (
                <div
                  key={`${row}-${col}`}
                  className={`cell ${isBlack ? "black" : "white"} ${isQueen ? "queen" : ""}`}
                  style={{
                    backgroundColor: isQueen
                      ? undefined
                      : invalid
                        ? "rgba(194, 18, 18, 0.493)"

                        : undefined,
                    cursor: isLast || (!isQueen && !invalid) ? "pointer" : "default",
                  }}
                  onClick={() =>
                    isLast || (!isQueen && !invalid) ? handleClick(row, col) : null
                  }
                >

                  {isQueen && <div className="queen-symbol" />}

                </div>
              );
            })
          )}
        </div>
      </div>
    </div >
    </div >
  );
}
