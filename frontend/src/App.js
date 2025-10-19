import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PuzzleGallery from "./pages/PuzzleGallery";
import PuzzleSetup from "./pages/PuzzleSetup";
import GameScreen from "./pages/GameScreen";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PuzzleGallery />} />
          <Route path="/puzzle/:puzzleId" element={<PuzzleSetup />} />
          <Route path="/play/:puzzleId/:difficulty" element={<GameScreen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
