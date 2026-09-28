import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import GamePage from './pages/GamePage.jsx';
import PokedexPage from './pages/PokedexPage.jsx';
import AboutPage from './pages/AboutPage.jsx';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-red-500 selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col justify-start">
          <Routes>
            {/* The primary route is /game, and / opens the game immediately */}
            <Route path="/" element={<Navigate to="/game" replace />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/pokedex" element={<PokedexPage />} />
            <Route path="/about" element={<AboutPage />} />
            {/* Fallback to game */}
            <Route path="*" element={<Navigate to="/game" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
