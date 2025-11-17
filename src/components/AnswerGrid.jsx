import React, { useState, useMemo } from 'react'

function AnswerGrid() {
  // Fixed grid dimensions
  const COLS = 5;
  const ROWS = 6;

  // State for clock grid coordinate sum toggle (1-indexed)
  const [showClockGridCoordinatesSum, setShowClockGridCoordinatesSum] =
    useState(false);
  // State for clock grid coordinate sum toggle (0-indexed)
  const [
    showClockGridCoordinatesSum0Indexed,
    setShowClockGridCoordinatesSum0Indexed,
  ] = useState(false);
  // State for clock grid coordinates toggle (1-indexed)
  const [showClockGridCoordinates, setShowClockGridCoordinates] =
    useState(false);
  // State for clock grid coordinates toggle (0-indexed)
  const [
    showClockGridCoordinates0Indexed,
    setShowClockGridCoordinates0Indexed,
  ] = useState(false);
  // State for hovered number in answer grid
  const [hoveredNumber, setHoveredNumber] = useState(null);

  // Prefilled numbers: [row, col, value]
  const prefilledCells = [
    [0, 0, "16"],
    [1, 3, "33"],
    [2, 2, "39"],
    [3, 1, "45"],
  ];

  const [gridData, setGridData] = useState(() => {
    // Initialize grid with empty cells
    const grid = [];
    for (let row = 0; row < ROWS; row++) {
      const rowData = [];
      for (let col = 0; col < COLS; col++) {
        rowData.push("");
      }
      grid.push(rowData);
    }
    // Fill in prefilled cells
    prefilledCells.forEach(([row, col, value]) => {
      grid[row][col] = value;
    });
    return grid;
  });

  const isPrefilled = (rowIndex, colIndex) => {
    return prefilledCells.some(
      ([row, col]) => row === rowIndex && col === colIndex
    );
  };

  const handleCellChange = (rowIndex, colIndex, value) => {
    // Don't allow editing prefilled cells
    if (isPrefilled(rowIndex, colIndex)) {
      return;
    }

    // Allow up to 2 characters (numbers and letters, uppercase)
    const upperValue = value.toUpperCase().slice(0, 2);
    const newGrid = gridData.map((row, r) => {
      if (r === rowIndex) {
        return row.map((cell, c) => (c === colIndex ? upperValue : cell));
      }
      return row;
    });
    setGridData(newGrid);

    // Auto-advance to next cell if 2 characters were entered
    if (
      upperValue.length === 2 &&
      upperValue !== gridData[rowIndex][colIndex]
    ) {
      setTimeout(() => {
        const nextCol = (colIndex + 1) % COLS;
        const nextRow =
          colIndex === COLS - 1 ? (rowIndex + 1) % ROWS : rowIndex;
        const nextCell = document.querySelector(
          `[data-row="${nextRow}"][data-col="${nextCol}"]`
        );
        if (nextCell && !nextCell.disabled) {
          nextCell.focus();
          nextCell.select();
        }
      }, 0);
    }
  };

  const handleKeyDown = (e, rowIndex, colIndex) => {
    // Skip navigation if trying to edit prefilled cell
    if (
      isPrefilled(rowIndex, colIndex) &&
      e.key !== "ArrowRight" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowDown" &&
      e.key !== "ArrowUp" &&
      e.key !== "Tab"
    ) {
      return;
    }

    if (e.key === "ArrowRight" || e.key === "Tab") {
      e.preventDefault();
      const nextCol = (colIndex + 1) % COLS;
      const nextRow = colIndex === COLS - 1 ? (rowIndex + 1) % ROWS : rowIndex;
      const nextCell = document.querySelector(
        `[data-row="${nextRow}"][data-col="${nextCol}"]`
      );
      if (nextCell && !nextCell.disabled) {
        nextCell.focus();
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevCol = colIndex === 0 ? COLS - 1 : colIndex - 1;
      const prevRow = colIndex === 0 ? (rowIndex - 1 + ROWS) % ROWS : rowIndex;
      const prevCell = document.querySelector(
        `[data-row="${prevRow}"][data-col="${prevCol}"]`
      );
      if (prevCell && !prevCell.disabled) {
        prevCell.focus();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextRow = (rowIndex + 1) % ROWS;
      const nextCell = document.querySelector(
        `[data-row="${nextRow}"][data-col="${colIndex}"]`
      );
      if (nextCell && !nextCell.disabled) {
        nextCell.focus();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevRow = (rowIndex - 1 + ROWS) % ROWS;
      const prevCell = document.querySelector(
        `[data-row="${prevRow}"][data-col="${colIndex}"]`
      );
      if (prevCell && !prevCell.disabled) {
        prevCell.focus();
      }
    } else if (e.key === "Backspace" && !e.target.value) {
      e.preventDefault();
      const prevCol = colIndex === 0 ? COLS - 1 : colIndex - 1;
      const prevRow = colIndex === 0 ? (rowIndex - 1 + ROWS) % ROWS : rowIndex;
      if (!isPrefilled(prevRow, prevCol)) {
        handleCellChange(prevRow, prevCol, "");
        const prevCell = document.querySelector(
          `[data-row="${prevRow}"][data-col="${prevCol}"]`
        );
        if (prevCell) {
          prevCell.focus();
        }
      }
    }
  };

  const CLOCK_COLS = 12;
  const CLOCK_ROWS = 6;

  const allClockNumbers = useMemo(() => {
    const numbers = [];
    // Row 1: 01-12
    for (let i = 1; i <= 12; i++) {
      const num = String(i).padStart(2, "0");
      numbers.push({ number: num, color: "white" });
    }
    // Rows 2-6: 00-59
    for (let i = 0; i <= 59; i++) {
      const num = String(i).padStart(2, "0");
      numbers.push({ number: num, color: "white" });
    }
    return numbers;
  }, []);

  // Extract all numbers from answer grid and normalize to 2-digit format
  const answerGridNumbers = useMemo(() => {
    const numbers = new Set();
    gridData.forEach((row) => {
      row.forEach((cell) => {
        if (cell && cell.trim() !== "") {
          // Normalize to 2-digit format (pad with leading zero if single digit)
          const normalized = cell.trim().padStart(2, "0");
          numbers.add(normalized);
        }
      });
    });
    return numbers;
  }, [gridData]);

  const clockGridData = useMemo(() => {
    const grid = [];
    let numberIndex = 0;

    for (let rowIndex = 0; rowIndex < CLOCK_ROWS; rowIndex++) {
      const row = [];
      for (let colIndex = 0; colIndex < CLOCK_COLS; colIndex++) {
        if (numberIndex < allClockNumbers.length) {
          const num = allClockNumbers[numberIndex];
          // Check if this number matches the hovered number
          const isHovered =
            hoveredNumber !== null && num.number === hoveredNumber;
          // Highlight if this number is in the answer grid (but hover takes priority)
          let color = "white";
          if (isHovered) {
            color = "hover";
          } else if (answerGridNumbers.has(num.number)) {
            color = "green";
          }
          // Calculate coordinate sum (1-indexed: add 1 to both row and column)
          const coordinateSum = rowIndex + 1 + (colIndex + 1);
          // Calculate coordinate sum (0-indexed: just add row and column)
          const coordinateSum0Indexed = rowIndex + colIndex;
          row.push({
            ...num,
            color,
            rowIndex,
            colIndex,
            coordinateSum,
            coordinateSum0Indexed,
          });
          numberIndex++;
        } else {
          row.push({ number: "", color: "empty", isEmpty: true });
        }
      }
      grid.push(row);
    }
    return grid;
  }, [allClockNumbers, answerGridNumbers, hoveredNumber]);

  const getClockSquareStyle = (color, isEmpty = false) => {
    // Match answer grid cell size
    const squareSize = 55;
    // Use smaller font size for coordinates, regular size for numbers/sums
    const fontSize =
      showClockGridCoordinates || showClockGridCoordinates0Indexed ? 14 : 20;

    const baseStyle = {
      width: `${squareSize}px`,
      height: `${squareSize}px`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: `${fontSize}px`,
      fontWeight: "bold",
      margin: "2px",
    };

    if (isEmpty || color === "empty") {
      return {
        ...baseStyle,
        backgroundColor: "transparent",
        border: "none",
        opacity: 0,
      };
    }

    baseStyle.border = "2px solid #333";

    if (color === "hover") {
      return {
        ...baseStyle,
        backgroundColor: "#ffeb3b",
        color: "#000",
        border: "3px solid #ff9800",
        boxShadow: "0 0 8px rgba(255, 152, 0, 0.6)",
      };
    } else if (color === "green") {
      return {
        ...baseStyle,
        backgroundColor: "#00ff00",
        color: "#000",
      };
    } else if (color === "red") {
      return {
        ...baseStyle,
        backgroundColor: "#ff0000",
        color: "#fff",
      };
    } else if (color === "blue") {
      return {
        ...baseStyle,
        backgroundColor: "#0000ff",
        color: "#fff",
      };
    } else {
      // Use white background when coordinate toggles are on, otherwise black
      return {
        ...baseStyle,
        backgroundColor:
          showClockGridCoordinatesSum ||
          showClockGridCoordinatesSum0Indexed ||
          showClockGridCoordinates ||
          showClockGridCoordinates0Indexed
            ? "#fff"
            : "#1a1a1a",
        color:
          showClockGridCoordinatesSum ||
          showClockGridCoordinatesSum0Indexed ||
          showClockGridCoordinates ||
          showClockGridCoordinates0Indexed
            ? "#000"
            : "#fff",
      };
    }
  };

  return (
    <div className="answer-grid-app">
      <div className="answer-grid-wrapper">
        <div className="answer-grid-container">
          {gridData.map((row, rowIndex) => (
            <div key={rowIndex} className="grid-row">
              {row.map((cell, colIndex) => {
                const prefilled = isPrefilled(rowIndex, colIndex);
                const isLastColumn = colIndex === COLS - 1;
                // Normalize cell value for hover matching
                const normalizedValue =
                  cell && cell.trim() !== ""
                    ? cell.trim().padStart(2, "0")
                    : null;
                return (
                  <div
                    key={colIndex}
                    onMouseEnter={() => {
                      if (normalizedValue) {
                        setHoveredNumber(normalizedValue);
                      }
                    }}
                    onMouseLeave={() => setHoveredNumber(null)}
                    style={{ display: "inline-block" }}
                  >
                    <input
                      type="text"
                      className={`answer-grid-cell ${
                        prefilled ? "answer-grid-cell-prefilled" : ""
                      } ${isLastColumn ? "answer-grid-cell-last-column" : ""}`}
                      data-row={rowIndex}
                      data-col={colIndex}
                      value={cell}
                      onChange={(e) =>
                        handleCellChange(rowIndex, colIndex, e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                      onFocus={(e) => e.target.select()}
                      disabled={prefilled}
                      maxLength={2}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="clock-grid-section">
          <div className="clock-grid-container">
            {clockGridData.map((row, rowIndex) => (
              <div key={rowIndex} className="grid-row">
                {row.map((square, squareIndex) => (
                  <div
                    key={squareIndex}
                    className="grid-square"
                    style={getClockSquareStyle(square.color, square.isEmpty)}
                  >
                    {showClockGridCoordinates && !square.isEmpty
                      ? `(${square.colIndex + 1}, ${square.rowIndex + 1})`
                      : showClockGridCoordinates0Indexed && !square.isEmpty
                      ? `(${square.colIndex}, ${square.rowIndex})`
                      : showClockGridCoordinatesSum && !square.isEmpty
                      ? square.coordinateSum
                      : showClockGridCoordinatesSum0Indexed && !square.isEmpty
                      ? square.coordinateSum0Indexed
                      : square.number}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="answer-grid-controls">
            <div className="control-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showClockGridCoordinatesSum}
                  onChange={(e) =>
                    setShowClockGridCoordinatesSum(e.target.checked)
                  }
                  disabled={
                    showClockGridCoordinatesSum0Indexed ||
                    showClockGridCoordinates ||
                    showClockGridCoordinates0Indexed
                  }
                />
                <span className="checkbox-label-text">
                  Toggle clock grid coordinates sum (1-indexed)
                </span>
              </label>
            </div>
            <div className="control-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showClockGridCoordinatesSum0Indexed}
                  onChange={(e) =>
                    setShowClockGridCoordinatesSum0Indexed(e.target.checked)
                  }
                  disabled={
                    showClockGridCoordinatesSum ||
                    showClockGridCoordinates ||
                    showClockGridCoordinates0Indexed
                  }
                />
                <span className="checkbox-label-text">
                  Toggle clock grid coordinates sum (0-indexed)
                </span>
              </label>
            </div>
            <div className="control-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showClockGridCoordinates}
                  onChange={(e) =>
                    setShowClockGridCoordinates(e.target.checked)
                  }
                  disabled={
                    showClockGridCoordinatesSum ||
                    showClockGridCoordinatesSum0Indexed ||
                    showClockGridCoordinates0Indexed
                  }
                />
                <span className="checkbox-label-text">
                  Toggle clock grid coordinates (1-indexed)
                </span>
              </label>
            </div>
            <div className="control-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showClockGridCoordinates0Indexed}
                  onChange={(e) =>
                    setShowClockGridCoordinates0Indexed(e.target.checked)
                  }
                  disabled={
                    showClockGridCoordinatesSum ||
                    showClockGridCoordinatesSum0Indexed ||
                    showClockGridCoordinates
                  }
                />
                <span className="checkbox-label-text">
                  Toggle clock grid coordinates (0-indexed)
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnswerGrid

