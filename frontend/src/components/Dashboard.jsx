import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { taskAPI } from '../services/api'
import '../styles/dashboard.css'

export default function Dashboard() {
  const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0, pendingTasks: 0 })
  const [recentTasks, setRecentTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const userId = 'default_user'

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await taskAPI.getTasks(userId)
        const tasks = res.data || []
        setStats({
          totalTasks: tasks.length,
          completedTasks: tasks.filter(t => t.completed).length,
          pendingTasks: tasks.filter(t => !t.completed).length,
        })
        setRecentTasks(tasks.slice(0, 5))
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  if (isLoading) return <div className="dashboard-container"><p>Loading...</p></div>

  const percentage = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>👋 Welcome!</h1>
        <p>Here's your overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div>📋</div>
          <div><h3>Total Tasks</h3><p>{stats.totalTasks}</p></div>
        </div>
        <div className="stat-card">
          <div>✅</div>
          <div><h3>Completed</h3><p>{stats.completedTasks}</p></div>
        </div>
        <div className="stat-card">
          <div>⏳</div>
          <div><h3>Pending</h3><p>{stats.pendingTasks}</p></div>
        </div>
        <div className="stat-card">
          <div>🎯</div>
          <div><h3>Progress</h3><div style={{width: '100%', height: '8px', backgroundColor: '#eee', borderRadius: '4px', marginTop: '0.5rem'}}><div style={{width: `${percentage}%`, height: '100%', backgroundColor: '#0066cc', borderRadius: '4px'}}></div></div><p>{percentage}%</p></div>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/chat" className="action-button primary">💬 Chat</Link>
        <Link to="/tasks" className="action-button secondary">📋 Tasks</Link>
      </div>
    </div>
  )
}
