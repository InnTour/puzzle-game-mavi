import React, { useEffect } from "react";
import "@/App.css";
import "@/totem.css";
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
import AdminSettings from "./pages/admin/AdminSettings";
import AdminPuzzleManager from "./pages/admin/AdminPuzzleManager";
import AdminStats from "./pages/admin/AdminStats";
import { initializeTotem, TOTEM_CONFIG } from "./config/totem.config";

function App() {
  useEffect(() => {
    // Initialize totem mode if enabled
    if (TOTEM_CONFIG.kiosk.enabled) {
      initializeTotem();
    }
    
    // Optional: Log totem initialization
    console.log('🖥️ MAVI Puzzle - Totem Mode:', TOTEM_CONFIG.kiosk.enabled ? 'ENABLED' : 'DISABLED');
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Player Routes */}
          <Route path="/" element={<PuzzleGallery />} />
          <Route path="/puzzle/:puzzleId" element={<PuzzleSetup />} />
          <Route path="/play/:puzzleId/:difficulty" element={<GameScreen />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          
          {/* Admin Routes - accessible only via direct URL */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/upload" element={<AdminUpload />} />
          <Route path="/admin/library" element={<AdminLibrary />} />
          <Route path="/admin/leaderboard" element={<AdminLeaderboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/puzzles" element={<AdminPuzzleManager />} />
          <Route path="/admin/stats" element={<AdminStats />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
