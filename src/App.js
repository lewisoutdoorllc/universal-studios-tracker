import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LiveStatusPage from './pages/LiveStatusPage';
import SchedulePage from './pages/SchedulePage';
import './App.scss'; // Import your global SCSS styles for the app

function App() {
  return (
    <Router>
      <div>
        {/* Navigation Links */}
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/" className="nav-link">Live Status</Link>
            </li>
            <li>
              <Link to="/schedule" className="nav-link">Park Schedule</Link>
            </li>
          </ul>
        </nav>

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<LiveStatusPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
