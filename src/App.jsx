import React, { useState } from 'react'
import './App.css'
import GridFlexer from './components/GridFlexer'
import Clock from './components/Clock'
import Clue from './components/Clue'

// Main App Component with Tabs
function App() {
  const [activeTab, setActiveTab] = useState('grid-flexer')
  const [showLetterCount, setShowLetterCount] = useState(true)
  const [showWordNumber, setShowWordNumber] = useState(true)
  const [showWordCountEntireClue, setShowWordCountEntireClue] = useState(true)

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
          />
        )}
      </div>
    </div>
  );
}

export default App

