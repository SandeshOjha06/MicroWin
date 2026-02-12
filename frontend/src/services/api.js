import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const chatAPI = {
  sendMessage: (message, userId) => api.post('/chat', { message, user_id: userId }),
  getChatHistory: (userId) => api.get(`/chat/history/${userId}`),
  startNewConversation: (userId) => api.post('/chat/new', { user_id: userId }),
}

export const taskAPI = {
  getTasks: (userId) => api.get(`/tasks/${userId}`),
  createTask: (userId, taskData) => api.post('/tasks', { user_id: userId, ...taskData }),
  updateTask: (userId, taskId, updates) => api.put(`/tasks/${taskId}`, { user_id: userId, ...updates }),
  completeTask: (userId, taskId) => api.patch(`/tasks/${taskId}/complete`, { user_id: userId }),
  deleteTask: (userId, taskId) => api.delete(`/tasks/${taskId}`, { data: { user_id: userId } }),
}

export const userAPI = {
  getProfile: (userId) => api.get(`/users/${userId}`),
  updatePreferences: (userId, preferences) => api.put(`/users/${userId}`, preferences),
}

export default api
