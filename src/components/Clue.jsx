import React from 'react'

function Clue({
  showLetterCount,
  setShowLetterCount,
  showWordNumber,
  setShowWordNumber,
  showWordCountEntireClue,
  setShowWordCountEntireClue,
  showSpaceCount,
  setShowSpaceCount,
  showSpaceCountPerLine,
  setShowSpaceCountPerLine,
  highlightedWords,
  setHighlightedWords,
}) {
  const toggleWordHighlight = (wordNumber) => {
    setHighlightedWords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(wordNumber)) {
        newSet.delete(wordNumber);
      } else {
        newSet.add(wordNumber);
      }
      return newSet;
    });
  };

  const resetHighlighting = () => {
    setHighlightedWords(new Set());
  };
  const clueText = `The time and the tide wait for no man

A light will show you the way, but won't show you land

Far across the distance and spaces between us

There's a ball that descends to countdown the day



On the other side of water, resting high on sacred grounds

Find the 72 squares to which this puzzle is bound`;

  // Parse the text into lines and words
  const parseText = (text) => {
    const lines = text.split("\n");
    let globalWordCounter = 0; // Track word count across entire clue
    let globalSpaceCounter = 0; // Track cumulative space count across entire clue

    return lines.map((line, lineIndex) => {
      if (line.trim() === "") {
        return { type: "empty" };
      }
      const trimmedLine = line.trim();
      // Split by whitespace and filter out empty strings
      const words = trimmedLine.split(/\s+/).filter((word) => word.length > 0);

      // Calculate word positions once for space counting
      const wordPositions = [];
      let searchPos = 0;
      for (let i = 0; i < words.length; i++) {
        const match = trimmedLine.substring(searchPos).match(/\S+/);
        if (match) {
          wordPositions.push({
            start: searchPos + match.index,
            end: searchPos + match.index + match[0].length,
          });
          searchPos += match.index + match[0].length;
        }
      }

      let lineSpaceCounter = 0; // Track space count within this line

      return {
        type: "line",
        words: words.map((word, wordIndex) => {
          globalWordCounter++;

          // Count spaces between this word and the previous word
          let localSpaceCount = 0;
          if (wordIndex > 0 && wordIndex < wordPositions.length) {
            const prevWordEnd = wordPositions[wordIndex - 1].end;
            const currentWordStart = wordPositions[wordIndex].start;
            localSpaceCount = currentWordStart - prevWordEnd;
          }

          // Add to global space counter (for words after the first)
          if (wordIndex > 0) {
            globalSpaceCounter += localSpaceCount;
            lineSpaceCounter += localSpaceCount;
          }

          const spaceCountEntireClue = wordIndex > 0 ? globalSpaceCounter : 0;
          const spaceCountPerLine = wordIndex > 0 ? lineSpaceCounter : 0;

          return {
            text: word,
            letterCount: word.replace(/[^a-zA-Z0-9]/g, "").length, // Count alphanumeric characters
            wordNumber: wordIndex + 1, // Word number within the line
            wordNumberEntireClue: globalWordCounter, // Word number across entire clue
            spaceCount: localSpaceCount, // Number of spaces before this word (local)
            spaceCountEntireClue: spaceCountEntireClue, // Cumulative space count across entire clue
            spaceCountPerLine: spaceCountPerLine, // Cumulative space count within this line
          };
        }),
      };
    });
  };

  const parsedLines = parseText(clueText);

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
            <span className="checkbox-label-text checkbox-label-letter-count">
              Word character count
            </span>
          </label>
        </div>
        <div className="control-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showWordNumber}
              onChange={(e) => setShowWordNumber(e.target.checked)}
            />
            <span className="checkbox-label-text checkbox-label-word-number">
              Word count (per line)
            </span>
          </label>
        </div>
        <div className="control-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showWordCountEntireClue}
              onChange={(e) => setShowWordCountEntireClue(e.target.checked)}
            />
            <span className="checkbox-label-text checkbox-label-word-count-entire">
              Word count (entire clue)
            </span>
          </label>
        </div>
        <div className="control-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showSpaceCountPerLine}
              onChange={(e) => setShowSpaceCountPerLine(e.target.checked)}
            />
            <span className="checkbox-label-text checkbox-label-space-count-per-line">
              Space count (per line)
            </span>
          </label>
        </div>
        <div className="control-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showSpaceCount}
              onChange={(e) => setShowSpaceCount(e.target.checked)}
            />
            <span className="checkbox-label-text checkbox-label-space-count">
              Space count (entire clue)
            </span>
          </label>
        </div>
        <div className="clue-controls-divider"></div>
        <button className="reset-button" onClick={resetHighlighting}>
          Reset word highlights
        </button>
      </div>
      <div className="clue-container">
        <div className="clue-text">
          {parsedLines.map((line, lineIndex) => {
            if (line.type === "empty") {
              return <div key={lineIndex} className="clue-line-break"></div>;
            }
            return (
              <div key={lineIndex} className="clue-line">
                {line.words.map((word, wordIndex) => {
                  const numbers = [];
                  if (showLetterCount) {
                    numbers.push({
                      type: "letter",
                      element: (
                        <span className="clue-letter-count">
                          {word.letterCount}
                        </span>
                      ),
                    });
                  }
                  if (showWordNumber) {
                    numbers.push({
                      type: "word",
                      element: (
                        <span className="clue-word-number">
                          {word.wordNumber}
                        </span>
                      ),
                    });
                  }
                  if (showWordCountEntireClue) {
                    numbers.push({
                      type: "entire",
                      element: (
                        <span className="clue-word-count-entire">
                          {word.wordNumberEntireClue}
                        </span>
                      ),
                    });
                  }
                  return (
                    <React.Fragment key={wordIndex}>
                      <span className="clue-word-wrapper">
                        {numbers.length > 0 && (
                          <span className="clue-word-numbers">
                            {numbers.map((num, i) => (
                              <React.Fragment
                                key={`${lineIndex}-${wordIndex}-${num.type}`}
                              >
                                {i > 0 && (
                                  <span className="clue-number-separator">
                                    ,
                                  </span>
                                )}
                                {num.element}
                              </React.Fragment>
                            ))}
                          </span>
                        )}
                        <span
                          className={`clue-word ${
                            highlightedWords.has(word.wordNumberEntireClue)
                              ? "clue-word-highlighted"
                              : ""
                          }`}
                          onClick={() =>
                            toggleWordHighlight(word.wordNumberEntireClue)
                          }
                        >
                          {word.text}
                        </span>
                      </span>
                      {(showSpaceCount || showSpaceCountPerLine) &&
                        wordIndex < line.words.length - 1 && (
                          <span className="clue-space-wrapper">
                            {(showSpaceCount || showSpaceCountPerLine) && (
                              <span className="clue-space-numbers">
                                {showSpaceCount && showSpaceCountPerLine ? (
                                  <>
                                    <span className="clue-space-count">
                                      {
                                        line.words[wordIndex + 1]
                                          .spaceCountEntireClue
                                      }
                                    </span>
                                    <span className="clue-number-separator">
                                      ,
                                    </span>
                                    <span className="clue-space-count-per-line">
                                      {
                                        line.words[wordIndex + 1]
                                          .spaceCountPerLine
                                      }
                                    </span>
                                  </>
                                ) : showSpaceCount ? (
                                  <span className="clue-space-count">
                                    {
                                      line.words[wordIndex + 1]
                                        .spaceCountEntireClue
                                    }
                                  </span>
                                ) : (
                                  <span className="clue-space-count-per-line">
                                    {
                                      line.words[wordIndex + 1]
                                        .spaceCountPerLine
                                    }
                                  </span>
                                )}
                              </span>
                            )}
                            <span className="clue-space"> </span>
                          </span>
                        )}
                    </React.Fragment>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Clue

