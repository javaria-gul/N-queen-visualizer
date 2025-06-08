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
  

export default function Board({ size }) {
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

      <button
        onClick={resetBoard}
        style={{
          padding: "8px 16px",
          marginBottom: "1rem",
          border: "none",
          backgroundColor: "#e74c3c",
          color: "white",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        🔁 Reset Board
      </button>

      <div
        className="board"
        style={{
          gridTemplateColumns: `repeat(${size}, 50px)`,
          gridTemplateRows: `repeat(${size}, 50px)`,
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
                className={`cell ${isBlack ? "black" : "white"}`}
                style={{
                  backgroundColor: isQueen
                    ? "#f39c12"
                    : invalid
                    ? "#e74c3c"
                    : isBlack
                    ? "#333"
                    : "#fff",
                  cursor: isLast || (!isQueen && !invalid) ? "pointer" : "default",
                }}
                onClick={() =>
                  isLast || (!isQueen && !invalid) ? handleClick(row, col) : null
                }
              >
                {isQueen ? "👑" : ""}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
