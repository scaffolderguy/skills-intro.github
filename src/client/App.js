import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CandidatePortal from './pages/CandidatePortal';
import TeamDashboard from './pages/TeamDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/candidate" element={<CandidatePortal />} />
            <Route path="/team" element={<TeamDashboard />} />
            <Route path="/manager" element={<ManagerDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;