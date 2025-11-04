import React from 'react'

function Clue({
  showLetterCount,
  setShowLetterCount,
  showWordNumber,
  setShowWordNumber,
  showWordCountEntireClue,
  setShowWordCountEntireClue
}) {
  const clueText = `The time and the tide wait for no man

A light will show you the way, but won't show you land

Far across the distance and spaces between us

There's a ball that descends to countdown the day



On the other side of water, resting high on sacred grounds

Find the 72 squares to which this puzzle is bound`

  // Parse the text into lines and words
  const parseText = (text) => {
    const lines = text.split('\n')
    let globalWordCounter = 0 // Track word count across entire clue
    
    return lines.map((line, lineIndex) => {
      if (line.trim() === '') {
        return { type: 'empty' }
      }
      // Split by whitespace and filter out empty strings
      const words = line.trim().split(/\s+/).filter(word => word.length > 0)
      return {
        type: 'line',
        words: words.map((word, wordIndex) => {
          globalWordCounter++
          return {
            text: word,
            letterCount: word.replace(/[^a-zA-Z0-9]/g, '').length, // Count alphanumeric characters
            wordNumber: wordIndex + 1, // Word number within the line
            wordNumberEntireClue: globalWordCounter, // Word number across entire clue
          }
        })
      }
    })
  }

  const parsedLines = parseText(clueText)

  return (
    <div className="clue-app">
      <div className="clue-controls">
        <div className="control-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showLetterCount}
              onChange={(e) => setShowLetterCount(e.target.checked)}
            />
            <span className="checkbox-label-text checkbox-label-letter-count">Word character count</span>
          </label>
        </div>
        <div className="control-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showWordNumber}
              onChange={(e) => setShowWordNumber(e.target.checked)}
            />
            <span className="checkbox-label-text checkbox-label-word-number">Word count (per line)</span>
          </label>
        </div>
        <div className="control-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showWordCountEntireClue}
              onChange={(e) => setShowWordCountEntireClue(e.target.checked)}
            />
            <span className="checkbox-label-text checkbox-label-word-count-entire">Word count (entire clue)</span>
          </label>
        </div>
      </div>
      <div className="clue-container">
        <div className="clue-text">
          {parsedLines.map((line, lineIndex) => {
            if (line.type === 'empty') {
              return <div key={lineIndex} className="clue-line-break"></div>
            }
            return (
              <div key={lineIndex} className="clue-line">
                {line.words.map((word, wordIndex) => (
                  <span key={wordIndex} className="clue-word-wrapper">
                    {(showLetterCount || showWordNumber || showWordCountEntireClue) && (
                      <span className="clue-word-numbers">
                        {showLetterCount && (
                          <span className="clue-letter-count">{word.letterCount}</span>
                        )}
                        {showWordNumber && (
                          <span className="clue-word-number">{word.wordNumber}</span>
                        )}
                        {showWordCountEntireClue && (
                          <span className="clue-word-count-entire">{word.wordNumberEntireClue}</span>
                        )}
                      </span>
                    )}
                    <span className="clue-word">{word.text}</span>
                  </span>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Clue

