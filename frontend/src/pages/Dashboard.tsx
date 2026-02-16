import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Logo } from "@/components/Logo"
import {
  Send,
  LogOut,

  Sliders,
  Menu,
  X,
  Sun,
  Moon,
  Trash2,
  Trophy,
  Star,
  PartyPopper,
  Plus,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { FontSwitcher } from "@/components/FontSwitcher"
import { GammaPlayer } from "@/components/GammaPlayer"
import { Mascot } from "@/components/Mascot"
import { SettingsModal } from "@/components/SettingsModal"
import { WelcomeModal } from "@/components/WelcomeModal"
import { useAuth } from "@/contexts/AuthContext"
import {
  apiDecomposeStream,
  apiGetUserTasks,
  apiGetTaskDetails,
  apiDeleteTask,
  apiUpdateStepStatus,
  apiUpdateProfile,
  type SidebarTask,
  type TaskStep,
} from "@/lib/api"
import { fireConfetti } from "@/lib/confetti"
import { playRandomMotivatingSound, playCompletionSound } from "@/lib/sounds"

interface Message {
  role: "user" | "bot"
  content: string
  isStep?: boolean
  stepId?: number
}

const SUCCESS_MESSAGES = [
  "Awesome job! 🌟",
  "You're crushing it! 🚀",
  "Way to go! 🎉",
  "Superb! ✨",
  "Level Up! 🆙",
  "Fantastic! 🌈",
  "You did it! 🏆",
]

type MascotMood = "idle" | "thinking" | "happy" | "celebrating"

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false)
  const [sidebarTasks, setSidebarTasks] = useState<SidebarTask[]>([])
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null)

  // Name Editing State
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState("")

  // Game/Mascot State
  const [currentQuestSteps, setCurrentQuestSteps] = useState<TaskStep[]>([])
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0)
  const [showReward, setShowReward] = useState(false)
  const [mascotMood, setMascotMood] = useState<MascotMood>("idle")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, showReward])

  useEffect(() => {
    if (user?.id) {
      apiGetUserTasks(user.id).then(setSidebarTasks).catch(() => { })

      // Check if user has a name
      if (!user.full_name) {
        setIsWelcomeOpen(true)
      }
    }
  }, [user?.id, user?.full_name])

  // Reset mascot to idle after animations
  useEffect(() => {
    if (mascotMood === "happy") {
      const timer = setTimeout(() => setMascotMood("idle"), 2000)
      return () => clearTimeout(timer)
    }
  }, [mascotMood])

  // Theme Config - Warm Brown Dark Mode
  const theme = {
    bg: darkMode ? "bg-[#2C241B]" : "bg-orange-50/30",
    sidebar: darkMode ? "bg-[#3E3226] border-[#5C4B3A]" : "bg-white border-orange-100",
    sidebarText: darkMode ? "text-orange-100/80" : "text-stone-600",
    sidebarHover: darkMode ? "hover:bg-[#4A3C2F] hover:text-orange-50" : "hover:bg-orange-50 hover:text-stone-900",
    navActive: darkMode ? "bg-[#d97706] text-white shadow-lg shadow-orange-900/20" : "bg-orange-500 text-white",
    header: darkMode ? "bg-[#2C241B] border-[#5C4B3A]" : "bg-white border-orange-100",
    headerText: darkMode ? "text-orange-50" : "text-stone-800",
    headerSub: darkMode ? "text-orange-200/60" : "text-stone-500",
    userBubble: darkMode ? "bg-[#d97706] text-white" : "bg-stone-800 text-white",
    botBubble: darkMode ? "bg-[#3E3226] text-orange-50 border-[#5C4B3A]" : "bg-white text-stone-800 border-orange-100",
    botAvatar: darkMode ? "bg-[#d97706]" : "bg-stone-900",
    botAvatarIcon: "text-white",
    inputWrap: darkMode ? "bg-[#3E3226] border-[#5C4B3A] focus-within:border-orange-500/50" : "bg-white border-orange-200 focus-within:border-orange-400",
    inputField: darkMode ? "text-orange-50 placeholder:text-orange-200/30" : "text-stone-900 placeholder:text-stone-400",
    emptyTitle: darkMode ? "text-orange-50" : "text-stone-800",
    emptyText: darkMode ? "text-orange-200/50" : "text-stone-500",
    emptyIcon: darkMode ? "bg-[#3E3226] text-orange-400" : "bg-orange-100 text-orange-500",
    footerText: darkMode ? "text-orange-200/20" : "text-stone-400",
    logoutHover: darkMode ? "hover:text-red-300 hover:bg-red-900/20" : "hover:text-red-600 hover:bg-red-50",
    typingDot: darkMode ? "bg-orange-400" : "bg-stone-400",
    logoBox: darkMode ? "bg-[#d97706]" : "bg-stone-900",
    logoIcon: "text-white",
    logoText: darkMode ? "text-orange-50" : "text-stone-900",
    logoSub: darkMode ? "text-orange-200/60" : "text-stone-500",
    sepColor: darkMode ? "bg-[#5C4B3A]" : "bg-orange-100",
    sendBtn: darkMode ? "bg-[#d97706] text-white hover:bg-orange-600" : "bg-stone-900 text-white hover:bg-stone-700",
    sendDisabled: darkMode ? "disabled:bg-[#3E3226] disabled:text-orange-200/20" : "disabled:bg-stone-100 disabled:text-stone-300",
    deleteBtn: darkMode ? "text-orange-200/20 hover:text-red-400" : "text-stone-300 hover:text-red-500",

    // Game Specific
    questCard: darkMode ? "bg-[#3E3226] border-[#d97706]/30" : "bg-white border-orange-200",
    questBtn: "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20 transform hover:scale-105 transition-all duration-200",
    questBtnDisabled: "bg-gray-300 cursor-not-allowed opacity-50",
  }

  // Handle "I DID IT!" click
  const handleStepComplete = async (stepId: number) => {
    // 1. Fire rewards
    const isLastStep = activeStepIndex === currentQuestSteps.length - 1;

    if (isLastStep) {
      fireConfetti()
      playCompletionSound()
      setMascotMood("celebrating")
    } else {
      playRandomMotivatingSound() // Varied sounds
      setMascotMood("happy")
    }

    setShowReward(true)

    // 2. Optimistic update
    const updatedSteps = [...currentQuestSteps]
    updatedSteps[activeStepIndex].is_completed = true
    setCurrentQuestSteps(updatedSteps)

    // 3. API Call
    try {
      await apiUpdateStepStatus(stepId, true)
    } catch {
      // rollback if needed
    }

    // 4. Wait a bit longer for the user to enjoy the moment
    setTimeout(() => {
      setShowReward(false)
      setActiveStepIndex(prev => prev + 1)
    }, 2500)
  }

  const handleSend = async () => {
    if (!input.trim() || !user) return
    const userMessage = input.trim()

    // Reset game state
    setMessages([{ role: "user", content: userMessage }])
    setCurrentQuestSteps([])
    setActiveStepIndex(0)
    setMascotMood("thinking")
    setInput("")
    setIsTyping(true)

    try {
      const res = await apiDecomposeStream(userMessage, user.id)
      const reader = res.body?.getReader()
      if (!reader) throw new Error("No stream reader")

      const decoder = new TextDecoder()
      const collectedSteps: TaskStep[] = []
      let stepCounter = 1

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.current_step?.action) {
                collectedSteps.push({
                  id: data.current_step.step_id || stepCounter,
                  action: data.current_step.action,
                  is_completed: false,
                  order: stepCounter
                })
                stepCounter++
              } else if (data.sidebar_title) {
                apiGetUserTasks(user.id).then(setSidebarTasks).catch(() => { })
              }
            } catch {
              // skip
            }
          }
        }
      }

      setIsTyping(false)
      setMascotMood("idle")

      if (collectedSteps.length > 0) {
        setMessages(prev => [
          ...prev,
          { role: "bot", content: `Quest Accepted! 🛡️\nI've broken this mission into ${collectedSteps.length} steps.` }
        ])
        setCurrentQuestSteps(collectedSteps)
        const firstUndone = collectedSteps.findIndex(s => !s.is_completed)
        setActiveStepIndex(firstUndone === -1 ? 0 : firstUndone)
      } else {
        setMessages(prev => [
          ...prev,
          { role: "bot", content: "I couldn't create a quest from that. Try rephrasing your goal!" },
        ])
      }
    } catch {
      setIsTyping(false)
      setMascotMood("idle")
      setMessages(prev => [
        ...prev,
        {
          role: "bot",
          content: "Connection failed. Please check your internet or try again!",
        },
      ])
    }
  }

  const loadTask = async (taskId: number) => {
    try {
      setMascotMood("thinking")
      const task = await apiGetTaskDetails(taskId)
      setActiveTaskId(taskId)
      setMessages([{ role: "user", content: task.goal }])

      setCurrentQuestSteps(task.steps)

      const firstUndone = task.steps.findIndex(s => !s.is_completed)
      const isComplete = firstUndone === -1 && task.steps.length > 0;

      setActiveStepIndex(firstUndone === -1 ? task.steps.length : firstUndone)
      setMascotMood(isComplete ? "celebrating" : "idle")

      setMessages(prev => [
        ...prev,
        { role: "bot", content: `Resuming Quest: ${task.title || "Untitled"}` }
      ])
    } catch {
      setMascotMood("idle")
    }
  }

  const deleteTask = async (taskId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await apiDeleteTask(taskId)
      setSidebarTasks((prev) => prev.filter((t) => t.id !== taskId))

      // Fix: If we just deleted the active task, clear the screen
      if (activeTaskId === taskId) {
        newChat()
      }
    } catch {
      // ignore
    }
  }

  const newChat = () => {
    setMessages([])
    setActiveTaskId(null)
    setCurrentQuestSteps([])
    setActiveStepIndex(0)
    setMascotMood("idle")
    if (inputRef.current) inputRef.current.focus()
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleNameSave = async () => {
    if (!editedName.trim() || !user) return
    try {
      await apiUpdateProfile(user.id, { full_name: editedName.trim() })
      // Reload page to refresh context (simplified approach)
      window.location.reload()
    } catch {
      // ignore
    } finally {
      setIsEditingName(false)
    }
  }

  const getDisplayName = () => {
    if (user?.full_name) return user.full_name
    if (user?.email) {
      // Smarter fallback: remove numbers, capitalize
      const namePart = user.email.split('@')[0].replace(/[0-9]/g, '')
      if (namePart) return namePart.charAt(0).toUpperCase() + namePart.slice(1)
      return "Friend"
    }
    return "Friend"
  }

  return (
    <div className={`flex h-screen ${theme.bg} overflow-hidden transition-colors duration-500 font-verdana`}>
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-0"
          } transition-all duration-300 ease-in-out ${theme.sidebar} border-r flex flex-col relative z-20 overflow-hidden`}
      >
        <div className="flex-shrink-0 px-5 pt-5 pb-2 min-w-[16rem] flex flex-col items-center">
          <div className="h-24 w-full flex items-center justify-center overflow-hidden">
            <Logo className="h-full w-auto object-contain" darkMode={darkMode} />
          </div>
        </div>


        {/* Professional New Quest Button */}
        <button
          onClick={newChat}
          className={`mx-4 w-auto flex items-center gap-2.5 px-4 py-3 rounded-xl ${activeTaskId === null ? theme.navActive : `${theme.sidebarText} ${theme.sidebarHover} border border-transparent hover:border-orange-200`
            } text-sm font-bold transition-all mb-4`}

        >
          <Plus className="w-4 h-4" />
          New Quest
        </button>

        <Separator className={`mb-4 ${theme.sepColor}`} />

        {sidebarTasks.length > 0 && (
          <div className="space-y-1 max-h-[calc(100vh-22rem)] overflow-y-auto pr-1">
            <p className={`text-[10px] font-bold ${theme.logoSub} uppercase tracking-widest mb-2 px-2`}>
              Mission Log
            </p>
            {sidebarTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => loadTask(task.id)}
                className={`group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all text-xs font-medium ${activeTaskId === task.id
                  ? theme.navActive
                  : `${theme.sidebarText} ${theme.sidebarHover}`
                  }`}
              >
                <Trophy className={`w-3.5 h-3.5 flex-shrink-0 ${activeTaskId === task.id ? "text-white" : "text-amber-500"}`} />
                <span className="truncate flex-1">{task.title}</span>
                <button
                  onClick={(e) => deleteTask(task.id, e)}
                  className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md ${theme.deleteBtn}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}


        <div className={`mt-auto p-5 border-t ${theme.header} min-w-[16rem]`}>
          {user && (
            <p className={`text-[11px] ${theme.logoSub} mb-3 truncate px-1 font-medium`}>
              {user.email}
            </p>
          )}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg ${theme.sidebarText} ${theme.logoutHover} transition-all text-sm font-medium`}
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside >

      {/* Main Area */}
      <main className="flex-1 flex flex-col relative z-10 min-w-0">

        <header className={`flex-shrink-0 flex items-center gap-4 px-6 py-4 border-b ${theme.header} transition-colors duration-300`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`h-9 w-9 ${theme.sidebarText} ${theme.sidebarHover}`}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          <div className="flex-1">
            {currentQuestSteps.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 max-w-xs bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${(activeStepIndex / currentQuestSteps.length) * 100}%` }}
                  />
                </div>
                <span className={`text-xs font-bold ${theme.headerSub}`}>
                  {Math.round((activeStepIndex / currentQuestSteps.length) * 100)}%
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* New Gamma Player */}
            <GammaPlayer darkMode={darkMode} />

            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`p-2.5 rounded-xl ${theme.sidebarText} ${theme.sidebarHover} transition-all`}
              title="Preferences"
            >
              <Sliders className="w-5 h-5" />
            </button>

            <FontSwitcher darkMode={darkMode} />
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl ${theme.sidebarText} ${theme.sidebarHover} transition-all`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          user={user}
          darkMode={darkMode}
        />

        <WelcomeModal
          isOpen={isWelcomeOpen}
          onClose={() => setIsWelcomeOpen(false)}
          user={user}
          darkMode={darkMode}
        />

        {/* Chat / Game Area - Centered Layout */}
        <div className="flex-1 overflow-y-auto px-6 py-8 flex items-center justify-center">
          <div className="w-full max-w-5xl mx-auto flex gap-6 md:gap-10 flex-col-reverse md:flex-row items-center md:items-start justify-center">

            {/* Mascot Column (Left on desktop, Bottom on mob) */}
            <div className="flex-shrink-0 flex flex-col items-center mt-4 md:mt-0">
              <Mascot mood={mascotMood} className="w-40 h-40 md:w-72 md:h-72 transform hover:scale-105 transition-transform" />
              {mascotMood === "thinking" && (
                <span className={`mt-2 text-xs font-bold uppercase tracking-widest ${theme.headerSub} animate-pulse`}>
                  Thinking...
                </span>
              )}
            </div>

            {/* Content Column */}
            <div className="flex-1 w-full space-y-6 max-w-2xl">
              {messages.length === 0 && (
                <div className="text-center py-10 animate-fade-in relative">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    {isEditingName ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className={`text-3xl md:text-5xl font-bold h-auto py-2 px-4 w-auto min-w-[300px] text-center ${theme.emptyTitle} bg-transparent border-b-2 border-orange-400 rounded-none focus-visible:ring-0`}
                          autoFocus
                          onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
                          onBlur={() => setIsEditingName(false)}
                        />
                        <Button size="sm" onClick={handleNameSave} className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 h-10 w-10">
                          <Check className="w-5 h-5" />
                        </Button>
                      </div>
                    ) : (
                      <h2
                        className={`text-3xl md:text-5xl font-bold ${theme.emptyTitle} flex items-center gap-2`}
                      >
                        Welcome back, {getDisplayName()}!
                      </h2>
                    )}

                  </div>
                  <p className={`${theme.emptyText} mb-8 text-lg md:text-xl`}>
                    I'm Polo! Ready to help you crush some tasks?
                  </p>



                  {/* Quick Stats / Overview */}
                  <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
                    <div className={`p-4 rounded-xl border ${darkMode ? "bg-[#3E3226] border-[#5C4B3A]" : "bg-white border-orange-100"} text-center`}>
                      <p className={`text-2xl font-bold ${darkMode ? "text-orange-400" : "text-orange-500"}`}>
                        {sidebarTasks.length}
                      </p>
                      <p className={`text-xs ${theme.logoSub} uppercase tracking-wider font-bold`}>Active Quests</p>
                    </div>
                    <div className={`p-4 rounded-xl border ${darkMode ? "bg-[#3E3226] border-[#5C4B3A]" : "bg-white border-orange-100"} text-center`}>
                      <p className={`text-2xl font-bold ${darkMode ? "text-green-400" : "text-green-500"}`}>
                        {new Date().getDate()}
                      </p>
                      <p className={`text-xs ${theme.logoSub} uppercase tracking-wider font-bold`}>
                        {new Date().toLocaleString('default', { month: 'short' })}
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* Chat Log */}
              <div className="space-y-4 mb-8">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                    <div className={`max-w-[100%] md:max-w-[85%] px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed whitespace-pre-line shadow-sm border-2 ${msg.role === "user"
                      ? `${theme.userBubble} border-transparent rounded-br-md`
                      : `${theme.botBubble} rounded-bl-md`
                      }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Active Quest Step Card */}
              {!isTyping && currentQuestSteps.length > 0 && (
                <div className="animate-fade-in-up space-y-4">

                  {activeStepIndex < currentQuestSteps.length ? (
                    <div className={`relative p-8 rounded-3xl border-4 ${theme.questCard} shadow-xl transform transition-all`}>
                      <div className="absolute -top-4 left-6 md:left-8 bg-amber-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                        Step {activeStepIndex + 1} of {currentQuestSteps.length}
                      </div>

                      <h3 className={`text-2xl md:text-3xl font-bold text-center mb-8 mt-4 leading-tight ${theme.emptyTitle}`}>
                        {currentQuestSteps[activeStepIndex].action}
                      </h3>

                      <div className="flex justify-center">
                        {!showReward ? (
                          <button
                            onClick={() => handleStepComplete(currentQuestSteps[activeStepIndex].id)}
                            className={`flex items-center gap-3 px-8 py-5 rounded-2xl text-xl font-bold ${theme.questBtn}`}
                          >
                            <Star className="w-7 h-7 fill-white" />
                            I DID IT!
                          </button>
                        ) : (
                          <div className="px-8 py-5 rounded-2xl bg-green-500 text-white font-bold text-xl animate-bounce flex items-center gap-3 shadow-lg shadow-green-500/30">
                            <PartyPopper className="w-7 h-7" />
                            {SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // All Done State
                    <div className={`p-10 rounded-3xl border-4 border-green-200 bg-green-50 text-center animate-fade-in shadow-xl`}>
                      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <Trophy className="w-12 h-12 text-green-600" />
                      </div>
                      <h2 className="text-3xl font-bold text-green-800 mb-2">Quest Complete!</h2>
                      <p className="text-green-600 mb-8 text-lg font-medium">You crushed every step. Polo is proud of you!</p>
                      <Button onClick={newChat} className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6 h-auto rounded-xl">
                        Start New Quest
                      </Button>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 px-6 pb-6 pt-2">
          <div className={`max-w-4xl mx-auto flex gap-3 p-2 rounded-2xl border-2 transition-all ${theme.inputWrap}`}>
            <Input
              ref={inputRef}
              className={`flex-1 border-0 bg-transparent text-base focus-visible:ring-0 px-4 py-2 ${theme.inputField}`}
              placeholder="Type your next big goal..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`h-12 w-12 rounded-xl flex-shrink-0 ${theme.sendBtn} ${theme.sendDisabled}`}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </main >
    </div >
  )
}
