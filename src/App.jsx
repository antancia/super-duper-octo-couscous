import React, { useState, useEffect } from 'react'
import './App.css'
import GridFlexer from './components/GridFlexer'
import Clock from './components/Clock'
import Clue from './components/Clue'
import AnswerGrid from "./components/AnswerGrid";

// Main App Component with Tabs
function App() {
  const [activeClueGroup, setActiveClueGroup] = useState("clue6");
  const [activeTab, setActiveTab] = useState("clock");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLetterCount, setShowLetterCount] = useState(false);
  const [showWordNumber, setShowWordNumber] = useState(false);
  const [showWordCountEntireClue, setShowWordCountEntireClue] = useState(false);
  const [showSpaceCount, setShowSpaceCount] = useState(false);
  const [showSpaceCountPerLine, setShowSpaceCountPerLine] = useState(false);
  const [highlightedWords, setHighlightedWords] = useState(new Set());

  // Clue #6 tabs: Clock, Grid Flexer, Clue, Answer grid
  const clue6Tabs = [
    { id: "clock", label: "Clock" },
    { id: "grid-flexer", label: "Grid Flexer" },
    { id: "clue", label: "Clue" },
    { id: "answer-grid", label: "Answer grid" },
  ];

  // Get current tabs based on active clue group
  const currentTabs = clue6Tabs;

  // Update page title based on active clue group
  useEffect(() => {
    document.title = "Clue #6 - It's a numbers game";
  }, [activeClueGroup]);

  // When switching clue groups, set the first tab as active
  const handleClueGroupChange = (group) => {
    setActiveClueGroup(group);
    setActiveTab("clock");
    setDrawerOpen(false); // Close drawer after selection
  };

  return (
    <div className="app-wrapper">
      {/* Drawer overlay */}
      {drawerOpen && (
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)}></div>
      )}
      
      {/* Drawer */}
      <div className={`drawer ${drawerOpen ? "drawer-open" : ""}`}>
        <div className="drawer-header">
          <h3>Select Clue</h3>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)}>
            ×
          </button>
        </div>
        <div className="drawer-content">
          <button
            className={`drawer-item ${activeClueGroup === "clue6" ? "active" : ""}`}
            onClick={() => handleClueGroupChange("clue6")}
          >
            Clue #6 - It's a numbers game
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="app-main">
        {/* Drawer toggle button */}
        <div className="app-header">
          <button className="drawer-toggle" onClick={() => setDrawerOpen(!drawerOpen)}>
            <span>☰</span>
            <span>Clue #6 - It's a numbers game</span>
          </button>
        </div>

        {/* Secondary tabs - always visible */}
        {currentTabs.length > 1 && (
          <div className="tabs tabs-secondary">
            {currentTabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab tab-secondary ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

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
              highlightedWords={highlightedWords}
              setHighlightedWords={setHighlightedWords}
            />
          )}
          {activeTab === "answer-grid" && <AnswerGrid />}
        </div>
      </div>
    </div>
  );
}

export default App

