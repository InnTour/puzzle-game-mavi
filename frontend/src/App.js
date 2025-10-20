import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PuzzleGallery from "./pages/PuzzleGallery";
import PuzzleSetup from "./pages/PuzzleSetup";
import GameScreen from "./pages/GameScreen";
import Leaderboard from "./pages/Leaderboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUpload from "./pages/admin/AdminUpload";
import AdminLibrary from "./pages/admin/AdminLibrary";
import AdminLeaderboard from "./pages/admin/AdminLeaderboard";
import AdminUsers from "./pages/admin/AdminUsers";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Player Routes */}
          <Route path="/" element={<PuzzleGallery />} />
          <Route path="/puzzle/:puzzleId" element={<PuzzleSetup />} />
          <Route path="/play/:puzzleId/:difficulty" element={<GameScreen />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/upload" element={<AdminUpload />} />
          <Route path="/admin/library" element={<AdminLibrary />} />
          <Route path="/admin/leaderboard" element={<AdminLeaderboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
