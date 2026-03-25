import React from 'react';
import FlowCanvas from './features/flow/components/FlowCanvas';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Prompt Visualizer</h1>
      </header>
      <main>
        <FlowCanvas />
      </main>
    </div>
  );
}

export default App;
