import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiUpdateProfile } from "@/lib/api"


interface WelcomeModalProps {
    isOpen: boolean
    onClose: () => void
    user: any
    darkMode: boolean
}

export function WelcomeModal({ isOpen, onClose, user, darkMode }: WelcomeModalProps) {
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    // const { user } = useAuth()



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setLoading(true)
        try {
            if (user?.id) {
                await apiUpdateProfile(user.id, { full_name: name.trim() })
                window.location.reload() // Reload to reflect changes immediately
            }
        } catch (error) {
            console.error("Failed to update name", error)
        } finally {
            setLoading(false)
            onClose()
        }
    }

    // Theme Config
    const theme = {
        bg: darkMode ? "bg-[#2C241B]" : "bg-white",
        text: darkMode ? "text-orange-50" : "text-stone-800",
        subText: darkMode ? "text-orange-200/60" : "text-stone-500",
        input: darkMode ? "bg-[#3E3226] border-[#5C4B3A] text-orange-50" : "bg-white border-orange-200 text-stone-900",
        button: "bg-green-500 hover:bg-green-600 text-white",
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`w-full max-w-md rounded-3xl p-8 shadow-2xl ${theme.bg} border border-[#5C4B3A]/20`}
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="w-8 h-8 text-blue-500" />
                            </div>
                            <h2 className={`text-2xl font-bold mb-2 ${theme.text}`}>Hi there, Friend!</h2>
                            <p className={theme.subText}>I'm Polo, your productivity pal. What should I call you?</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name or nickname..."
                                    className={`w-full h-12 text-lg text-center rounded-xl ${theme.input}`}
                                    autoFocus
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={!name.trim() || loading}
                                className={`w-full h-12 rounded-xl font-bold text-lg ${theme.button}`}
                            >
                                {loading ? "Saving..." : "Let's Go!"}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
