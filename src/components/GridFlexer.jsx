import React, { useState, useMemo, useEffect } from 'react'

// Grid Flexer Component (original functionality)
function GridFlexer() {
  // Original grid dimensions
  const ORIGINAL_COLS = 12
  const ORIGINAL_ROWS = 6

  // State for grid dimensions
  const [cols, setColsState] = useState(ORIGINAL_COLS)
  const [rows, setRowsState] = useState(ORIGINAL_ROWS)
  
  // State for viewport dimensions
  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  })

  // Track viewport size changes
  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Define all numbers in sequence with their colors
  // Row 1: 01-12, then Rows 2-6: 00-59
  // Highlight 16, 33, 39, 45 in green
  const allNumbers = useMemo(() => {
    const greenNumbers = ['16', '33', '39', '45']
    const numbers = []
    // Row 1: 01-12
    for (let i = 1; i <= 12; i++) {
      const num = String(i).padStart(2, '0')
      const color = greenNumbers.includes(num) ? 'green' : 'white'
      numbers.push({ number: num, color })
    }
    // Rows 2-6: 00-59
    for (let i = 0; i <= 59; i++) {
      const num = String(i).padStart(2, '0')
      const color = greenNumbers.includes(num) ? 'green' : 'white'
      numbers.push({ number: num, color })
    }
    return numbers
  }, [])

  // Wrapper functions - always keep rows/columns in sync with what's needed
  // When columns change, automatically adjust rows to match
  const setCols = (newCols) => {
    setColsState(newCols)
    // Always update rows to the minimum needed to fit all numbers with the new column count
    const minRows = Math.ceil(allNumbers.length / newCols)
    setRowsState(minRows)
  }

  // When rows change, automatically adjust columns to match
  const setRows = (newRows) => {
    setRowsState(newRows)
    // Always update columns to the minimum needed to fit all numbers with the new row count
    const minCols = Math.ceil(allNumbers.length / newRows)
    setColsState(minCols)
  }

  // Generate grid data by wrapping numbers into the specified rows/columns
  const gridData = useMemo(() => {
    const grid = []
    let numberIndex = 0

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      const row = []
      for (let colIndex = 0; colIndex < cols; colIndex++) {
        if (numberIndex < allNumbers.length) {
          row.push(allNumbers[numberIndex])
          numberIndex++
        } else {
          // Empty cell if we run out of numbers - mark as empty
          row.push({ number: '', color: 'empty', isEmpty: true })
        }
      }
      grid.push(row)
    }
    return grid
  }, [rows, cols, allNumbers])

  // Reset function
  const handleReset = () => {
    setColsState(ORIGINAL_COLS)
    setRowsState(ORIGINAL_ROWS)
  }

  // Helper functions for increment/decrement with bounds
  const handleColsDecrease = () => {
    setCols(Math.max(1, cols - 1))
  }

  const handleColsIncrease = () => {
    setCols(Math.min(72, cols + 1))
  }

  const handleRowsDecrease = () => {
    setRows(Math.max(1, rows - 1))
  }

  const handleRowsIncrease = () => {
    setRows(Math.min(72, rows + 1))
  }

  // Calculate optimal square size based on viewport and grid dimensions
  const squareSize = useMemo(() => {
    const controlsWidth = 250 // Controls panel width
    const appPadding = 20 // App padding on all sides
    const appGap = 20 // Gap between controls and grid (from CSS)
    const gridPadding = 20 // Grid container padding on all sides
    const gap = 4 // Gap between squares
    
    // Available space for grid (controls on left, grid on right)
    // Width: viewport - left app padding - controls width - gap - right app padding - grid left/right padding
    const availableWidth = viewportSize.width - appPadding - controlsWidth - appGap - appPadding - (gridPadding * 2)
    // Height: viewport - top app padding - bottom app padding - grid top/bottom padding
    const availableHeight = viewportSize.height - (appPadding * 2) - (gridPadding * 2)
    
    // Calculate max square size based on width and height constraints
    // Account for gaps: (cols - 1) gaps horizontally, (rows - 1) gaps vertically
    // Also account for margins: 2px margin on each side = 4px per square
    const marginPerSquare = 4
    const maxWidthPerSquare = (availableWidth - (cols - 1) * gap - cols * marginPerSquare) / cols
    const maxHeightPerSquare = (availableHeight - (rows - 1) * gap - rows * marginPerSquare) / rows
    
    // Use the smaller constraint, but ensure minimum size
    const calculatedSize = Math.min(maxWidthPerSquare, maxHeightPerSquare)
    const minSize = 20
    const maxSize = 80
    
    return Math.max(minSize, Math.min(maxSize, calculatedSize))
  }, [viewportSize, cols, rows])

  const getSquareStyle = (color, isEmpty = false) => {
    // Calculate font size proportionally (approximately 30% of square size)
    const fontSize = Math.max(12, Math.min(24, squareSize * 0.3))
    
    const baseStyle = {
      width: `${squareSize}px`,
      height: `${squareSize}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: `${fontSize}px`,
      fontWeight: 'bold',
      margin: '2px',
    }

    // Empty cells have a dashed border to show they're empty
    if (isEmpty || color === 'empty') {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        border: '2px dashed #666',
      }
    }

    baseStyle.border = '2px solid #333'

    if (color === 'green') {
      return {
        ...baseStyle,
        backgroundColor: '#00ff00',
        color: '#000',
      }
    } else if (color === 'red') {
      return {
        ...baseStyle,
        backgroundColor: '#ff0000',
        color: '#fff',
      }
    } else if (color === 'blue') {
      return {
        ...baseStyle,
        backgroundColor: '#0000ff',
        color: '#fff',
      }
    } else {
      return {
        ...baseStyle,
        backgroundColor: '#1a1a1a',
        color: '#fff',
      }
    }
  }

  return (
    <div className="app">
      <div className="controls">
        <div className="control-group">
          <label htmlFor="cols-control">
            Columns: {cols}
          </label>
          <div className="slider-container">
            <button onClick={handleColsDecrease} className="slider-button">−</button>
            <input
              id="cols-control"
              type="range"
              min="1"
              max="72"
              value={cols}
              onChange={(e) => setCols(parseInt(e.target.value))}
              className="slider"
            />
            <button onClick={handleColsIncrease} className="slider-button">+</button>
          </div>
        </div>
        <div className="control-group">
          <label htmlFor="rows-control">Rows: {rows}</label>
          <div className="slider-container">
            <button onClick={handleRowsDecrease} className="slider-button">−</button>
            <input
              id="rows-control"
              type="range"
              min="1"
              max="72"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value))}
              className="slider"
            />
            <button onClick={handleRowsIncrease} className="slider-button">+</button>
          </div>
        </div>
        <button className="reset-button" onClick={handleReset}>
          Reset to Original (12×6)
        </button>
      </div>
      <div className="grid-container">
        {gridData.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((square, squareIndex) => (
              <div
                key={squareIndex}
                className="grid-square"
                style={getSquareStyle(square.color, square.isEmpty)}
              >
                {square.number}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GridFlexer

