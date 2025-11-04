import React, { useState } from 'react'
import './App.css'
import GridFlexer from './components/GridFlexer'
import Clock from './components/Clock'
import Clue from './components/Clue'

// Main App Component with Tabs
function App() {
  const [activeTab, setActiveTab] = useState("clock");
  const [showLetterCount, setShowLetterCount] = useState(false);
  const [showWordNumber, setShowWordNumber] = useState(false);
  const [showWordCountEntireClue, setShowWordCountEntireClue] = useState(false);
  const [showSpaceCount, setShowSpaceCount] = useState(false);
  const [showSpaceCountPerLine, setShowSpaceCountPerLine] = useState(false);

  return (
    <div className="app-wrapper">
      <div className="tabs">
        <button
          className={`tab ${activeTab === "clock" ? "active" : ""}`}
          onClick={() => setActiveTab("clock")}
        >
          Clock
        </button>
        <button
          className={`tab ${activeTab === "grid-flexer" ? "active" : ""}`}
          onClick={() => setActiveTab("grid-flexer")}
        >
          Grid Flexer
        </button>
        <button
          className={`tab ${activeTab === "clue" ? "active" : ""}`}
          onClick={() => setActiveTab("clue")}
        >
          Clue
        </button>
      </div>
      <div className="tab-content">
        {activeTab === "grid-flexer" && <GridFlexer />}
        {activeTab === "clock" && <Clock />}
        {activeTab === "clue" && (
          <Clue
            showLetterCount={showLetterCount}
            setShowLetterCount={setShowLetterCount}
            showWordNumber={showWordNumber}
            setShowWordNumber={setShowWordNumber}
            showWordCountEntireClue={showWordCountEntireClue}
            setShowWordCountEntireClue={setShowWordCountEntireClue}
            showSpaceCount={showSpaceCount}
            setShowSpaceCount={setShowSpaceCount}
            showSpaceCountPerLine={showSpaceCountPerLine}
            setShowSpaceCountPerLine={setShowSpaceCountPerLine}
          />
        )}
      </div>
    </div>
  );
}

export default App

