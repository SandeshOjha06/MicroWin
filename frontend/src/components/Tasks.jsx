import React, { useState, useEffect } from 'react'
import { taskAPI } from '../services/api'
import '../styles/tasks.css'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const userId = 'default_user'

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await taskAPI.getTasks(userId)
        setTasks(res.data || [])
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadTasks()
  }, [])

  const handleComplete = async (taskId) => {
    try {
      await taskAPI.completeTask(userId, taskId)
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t))
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await taskAPI.deleteTask(userId, taskId)
      setTasks(prev => prev.filter(t => t.id !== taskId))
    } catch (err) {
      console.error('Error:', err)
    }
  }

  if (isLoading) return <div className="tasks-container">Loading...</div>

  const pending = tasks.filter(t => !t.completed)
  const completed = tasks.filter(t => t.completed)

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1>📋 Tasks</h1>
        <p>{pending.length} pending · {completed.length} completed</p>
      </div>

      <div className="tasks-content">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <h2>No tasks yet!</h2>
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <div className="task-section">
                <h2>In Progress</h2>
                {pending.map(task => (
                  <div key={task.id} className="task-card">
                    <input type="checkbox" onChange={() => handleComplete(task.id)} />
                    <div className="task-content">
                      <h3>{task.title}</h3>
                      {task.description && <p>{task.description}</p>}
                    </div>
                    <button onClick={() => handleDelete(task.id)}>Delete</button>
                  </div>
                ))}
              </div>
            )}
            {completed.length > 0 && (
              <div className="task-section">
                <h2>✅ Completed</h2>
                {completed.map(task => (
                  <div key={task.id} className="task-card completed">
                    <input type="checkbox" checked onChange={() => handleComplete(task.id)} />
                    <div className="task-content">
                      <h3>{task.title}</h3>
                    </div>
                    <button onClick={() => handleDelete(task.id)}>Delete</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
