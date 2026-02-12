import React, { useState, useEffect, useRef } from 'react'
import { chatAPI } from '../services/api'
import '../styles/chat.css'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const userId = 'default_user'
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await chatAPI.getChatHistory(userId)
        setMessages(res.data || [])
      } catch (err) {
        console.error('Error:', err)
        setMessages([{
          id: 'welcome',
          text: "Hi! I'm your AI task assistant. How can I help?",
          sender: 'ai',
          timestamp: new Date(),
        }])
      }
    }
    loadHistory()
  }, [])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const res = await chatAPI.sendMessage(inputValue, userId)
      const aiMessage = {
        id: Date.now() + 1,
        text: res.data.message || res.data.reply || "I'm not sure...",
        sender: 'ai',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      console.error('Error:', err)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting.",
        sender: 'ai',
        timestamp: new Date(),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>🤖 Task Assistant</h1>
      </div>

      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="message-bubble">{msg.text}</div>
          </div>
        ))}
        {isLoading && <div className="message ai"><div className="typing">...</div></div>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-area">
        <textarea
          className="chat-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage(e)
            }
          }}
          placeholder="Type your message..."
          disabled={isLoading}
          rows="1"
        />
        <button type="submit" disabled={isLoading || !inputValue.trim()}>
          {isLoading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  )
}
