import React, { useState, useMemo, useEffect } from 'react'

// Clock Component (new functionality)
function Clock() {
  const ORIGINAL_COLS = 12
  const ORIGINAL_ROWS = 6
  
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Get all numbers in the original grid layout
  const allNumbers = useMemo(() => {
    const numbers = []
    // Row 1: 01-12
    for (let i = 1; i <= 12; i++) {
      const num = String(i).padStart(2, '0')
      numbers.push({ number: num, color: 'white' })
    }
    // Rows 2-6: 00-59
    for (let i = 0; i <= 59; i++) {
      const num = String(i).padStart(2, '0')
      numbers.push({ number: num, color: 'white' })
    }
    return numbers
  }, [])

  // Get current time components
  const hours = currentTime.getHours() % 12 || 12 // Convert to 12-hour format
  const minutes = currentTime.getMinutes()
  const seconds = currentTime.getSeconds()

  // Format time values as 2-digit strings
  const hourStr = String(hours).padStart(2, '0')
  const minuteStr = String(minutes).padStart(2, '0')
  const secondStr = String(seconds).padStart(2, '0')

  // Generate grid data with color highlighting based on current time
  const gridData = useMemo(() => {
    const grid = []
    let numberIndex = 0

    for (let rowIndex = 0; rowIndex < ORIGINAL_ROWS; rowIndex++) {
      const row = []
      for (let colIndex = 0; colIndex < ORIGINAL_COLS; colIndex++) {
        if (numberIndex < allNumbers.length) {
          const num = allNumbers[numberIndex]
          let color = 'white'
          
          // Hour (green) only highlights in top row (01-12)
          if (rowIndex === 0 && num.number === hourStr) {
            color = 'green'
          } 
          // Minutes (blue) and seconds (red) only highlight in rows 2-6 (00-59)
          else if (rowIndex > 0) {
            if (num.number === secondStr) {
              color = 'red'
            } else if (num.number === minuteStr) {
              color = 'blue'
            }
          }
          
          row.push({ ...num, color })
          numberIndex++
        } else {
          row.push({ number: '', color: 'empty', isEmpty: true })
        }
      }
      grid.push(row)
    }
    return grid
  }, [allNumbers, hourStr, minuteStr, secondStr])

  // Calculate square size based on viewport
  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  })

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

  const squareSize = useMemo(() => {
    const appPadding = 20
    const gridPadding = 20
    const gap = 4
    const marginPerSquare = 4
    const tabsHeight = 50 // Approximate height of tabs
    
    const availableWidth = viewportSize.width - (appPadding * 2) - (gridPadding * 2)
    const availableHeight = viewportSize.height - tabsHeight - (appPadding * 2) - (gridPadding * 2)
    
    const maxWidthPerSquare = (availableWidth - (ORIGINAL_COLS - 1) * gap - ORIGINAL_COLS * marginPerSquare) / ORIGINAL_COLS
    const maxHeightPerSquare = (availableHeight - (ORIGINAL_ROWS - 1) * gap - ORIGINAL_ROWS * marginPerSquare) / ORIGINAL_ROWS
    
    const calculatedSize = Math.min(maxWidthPerSquare, maxHeightPerSquare)
    const minSize = 20
    const maxSize = 80
    
    return Math.max(minSize, Math.min(maxSize, calculatedSize))
  }, [viewportSize])

  const getSquareStyle = (color, isEmpty = false) => {
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

    if (isEmpty || color === 'empty') {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        border: 'none',
        opacity: 0,
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
    <div className="app clock-app">
      <div className="grid-container clock-container">
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

export default Clock

