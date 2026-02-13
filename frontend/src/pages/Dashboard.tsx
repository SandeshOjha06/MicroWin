import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Send,
  LogOut,
  MessageSquare,
  Sparkles,
  Menu,
  X,
  Target,
  Zap,
  TrendingUp,
  Sun,
  Moon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

interface Message {
  role: "user" | "bot"
  content: string
}

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = () => {
    if (!input.trim()) return
    const newMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, newMessage])
    setInput("")
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "I'll help you break that down into micro-wins! This will connect to the FastAPI backend soon.",
        },
      ])
    }, 1200)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("condition")
    navigate("/login")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickPrompts = [
    { icon: <Target className="w-4 h-4" />, text: "Break down a goal" },
    { icon: <Zap className="w-4 h-4" />, text: "Daily micro-wins" },
    { icon: <TrendingUp className="w-4 h-4" />, text: "Track my progress" },
  ]

  // Theme classes
  const theme = {
    bg: darkMode ? "bg-[#09090b]" : "bg-white",
    sidebar: darkMode ? "bg-zinc-900/80 border-white/5" : "bg-zinc-50 border-zinc-200",
    sidebarText: darkMode ? "text-zinc-400" : "text-zinc-600",
    sidebarHover: darkMode ? "hover:bg-white/5 hover:text-white" : "hover:bg-zinc-100 hover:text-black",
    navActive: darkMode ? "bg-white text-black" : "bg-black text-white",
    header: darkMode ? "bg-[#09090b] border-white/5" : "bg-white border-zinc-200",
    headerText: darkMode ? "text-white" : "text-black",
    headerSub: darkMode ? "text-zinc-500" : "text-zinc-500",
    userBubble: darkMode ? "bg-white text-black" : "bg-black text-white",
    botBubble: darkMode ? "bg-zinc-900 text-zinc-200 border-white/5" : "bg-zinc-100 text-zinc-800 border-zinc-200",
    botAvatar: darkMode ? "bg-white" : "bg-black",
    botAvatarIcon: darkMode ? "text-[#09090b]" : "text-white",
    inputWrap: darkMode ? "bg-zinc-900/60 border-white/5 focus-within:border-zinc-600" : "bg-white border-zinc-200 focus-within:border-zinc-400",
    inputField: darkMode ? "text-white placeholder:text-zinc-600" : "text-black placeholder:text-zinc-400",
    emptyTitle: darkMode ? "text-white" : "text-black",
    emptyText: darkMode ? "text-zinc-500" : "text-zinc-500",
    emptyIcon: darkMode ? "bg-zinc-900 text-zinc-500" : "bg-zinc-100 text-zinc-400",
    footerText: darkMode ? "text-zinc-700" : "text-zinc-400",
    logoutHover: darkMode ? "hover:text-red-400 hover:bg-red-500/10" : "hover:text-red-600 hover:bg-red-50",
    typingDot: darkMode ? "bg-zinc-500" : "bg-zinc-400",
    logoBox: darkMode ? "bg-white" : "bg-black",
    logoIcon: darkMode ? "text-[#09090b]" : "text-white",
    logoText: darkMode ? "text-white" : "text-black",
    logoSub: darkMode ? "text-zinc-600" : "text-zinc-500",
    sepColor: darkMode ? "bg-white/5" : "",
    sendBtn: darkMode ? "bg-white text-black hover:bg-zinc-200" : "bg-black text-white hover:bg-zinc-800",
    sendDisabled: darkMode ? "disabled:bg-zinc-800 disabled:text-zinc-600" : "disabled:bg-zinc-200 disabled:text-zinc-400",
  }

  return (
    <div className={`flex h-screen ${theme.bg} overflow-hidden transition-colors duration-300`}>
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-60" : "w-0"
          } transition-all duration-300 ease-in-out ${theme.sidebar} border-r flex flex-col relative z-20 overflow-hidden`}
      >
        <div className="flex-shrink-0 p-5 min-w-[15rem]">
          <div className="flex items-center gap-2.5 mb-5">
            <div className={`w-8 h-8 ${theme.logoBox} rounded-lg flex items-center justify-center`}>
              <Sparkles className={`w-4 h-4 ${theme.logoIcon}`} />
            </div>
            <div>
              <h1 className={`text-base font-bold ${theme.logoText}`}>μ-Wins</h1>
              <p className={`text-[10px] ${theme.logoSub} leading-none`}>Micro-win assistant</p>
            </div>
          </div>

          <Separator className={`mb-4 ${theme.sepColor}`} />

          <nav className="space-y-1">
            <button className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg ${theme.navActive} text-sm font-medium transition-all`}>
              <MessageSquare className="w-4 h-4" />
              Chat
            </button>
          </nav>
        </div>

        <div className={`mt-auto p-5 border-t ${darkMode ? "border-white/5" : "border-zinc-200"} min-w-[15rem]`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg ${theme.sidebarText} ${theme.logoutHover} transition-all text-sm`}
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col relative z-10 min-w-0">
        {/* Header */}
        <header className={`flex-shrink-0 flex items-center gap-3 px-4 py-2.5 border-b ${theme.header} transition-colors duration-300`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`h-8 w-8 ${theme.sidebarText} ${theme.sidebarHover}`}
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
          <div>
            <h2 className={`text-sm font-semibold ${theme.headerText}`}>AI Assistant</h2>
            <p className={`text-[11px] ${theme.headerSub}`}>Break goals into micro-wins</p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span className={`text-[11px] ${theme.headerSub}`}>Online</span>
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${theme.sidebarText} ${theme.sidebarHover} transition-all`}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center animate-fade-in">
              <div className={`w-14 h-14 ${theme.emptyIcon} rounded-2xl flex items-center justify-center mb-4`}>
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className={`text-lg font-bold ${theme.emptyTitle} mb-1`}>Welcome to μ-Wins</h3>
              <p className={`${theme.emptyText} text-center max-w-sm mb-6 text-sm`}>
                Tell me what you want to achieve, and I'll help you break it into small, actionable steps.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {quickPrompts.map((prompt, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInput(prompt.text)
                      inputRef.current?.focus()
                    }}
                    className={`gap-2 ${darkMode
                      ? "bg-transparent border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white"
                      : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-black"
                      }`}
                  >
                    {prompt.icon}
                    {prompt.text}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  {msg.role === "bot" && (
                    <div className={`w-6 h-6 ${theme.botAvatar} rounded-md flex items-center justify-center mr-2 mt-0.5 flex-shrink-0`}>
                      <Sparkles className={`w-3 h-3 ${theme.botAvatarIcon}`} />
                    </div>
                  )}
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                    ? `${theme.userBubble} rounded-br-md`
                    : `${theme.botBubble} rounded-bl-md border`
                    }`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className={`w-6 h-6 ${theme.botAvatar} rounded-md flex items-center justify-center mr-2 mt-0.5 flex-shrink-0`}>
                    <Sparkles className={`w-3 h-3 ${theme.botAvatarIcon}`} />
                  </div>
                  <div className={`${theme.botBubble} rounded-2xl rounded-bl-md border px-4 py-3 flex gap-1`}>
                    <span className={`w-1.5 h-1.5 ${theme.typingDot} rounded-full animate-bounce-dot`} />
                    <span className={`w-1.5 h-1.5 ${theme.typingDot} rounded-full animate-bounce-dot-delay-1`} />
                    <span className={`w-1.5 h-1.5 ${theme.typingDot} rounded-full animate-bounce-dot-delay-2`} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex-shrink-0 px-5 pb-5 pt-2">
          <div className="max-w-2xl mx-auto">
            <div className={`flex gap-2 items-end ${theme.inputWrap} border rounded-xl p-1.5 transition-all duration-300`}>
              <Input
                ref={inputRef}
                type="text"
                className={`border-0 shadow-none focus-visible:ring-0 text-sm bg-transparent ${theme.inputField}`}
                placeholder="Type your goal or message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim()}
                size="icon"
                className={`h-8 w-8 rounded-lg flex-shrink-0 ${theme.sendBtn} ${theme.sendDisabled}`}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className={`text-center text-[10px] ${theme.footerText} mt-2`}>
              μ-Wins AI can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
