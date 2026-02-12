import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Chat from './components/Chat'
import Dashboard from './components/Dashboard'
import Tasks from './components/Tasks'
import './App.css'

function AppContent() {
  const location = useLocation()
  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">🎯 MicroWin</Link>
          <ul className="nav-menu">
            <li><Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Dashboard</Link></li>
            <li><Link to="/chat" className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}>Chat</Link></li>
            <li><Link to="/tasks" className={`nav-link ${location.pathname === '/tasks' ? 'active' : ''}`}>Tasks</Link></li>
          </ul>
        </div>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/tasks" element={<Tasks />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
