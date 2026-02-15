import { useState, useRef, useEffect } from "react"
import { Headphones, Volume2, VolumeX, Loader2, SkipForward, BrainCircuit } from "lucide-react"
import { Button } from "@/components/ui/button"
// @ts-ignore
import lofi1 from "@/assets/lofi.mp3"
// @ts-ignore
import sappheiros from "@/assets/lofi-sappheiros.ogg"

const PLAYLIST = [
    { type: 'file', src: lofi1, name: "Lofi Study" },
    { type: 'gamma', name: "40Hz Gamma Waves" }
]

interface LofiPlayerProps {
    darkMode: boolean
}

export function LofiPlayer({ darkMode }: LofiPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const oscillatorRef = useRef<OscillatorNode | null>(null)
    const gainNodeRef = useRef<GainNode | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)

    useEffect(() => {
        // Stop any existing playback when track changes
        stopAll()

        const track = PLAYLIST[currentTrackIndex]

        if (track.type === 'file') {
            const audio = new Audio(track.src)
            audio.volume = 0.2
            audio.playbackRate = 1.0
            audioRef.current = audio

            const handleCanPlay = () => setIsLoading(false)
            const handleWaiting = () => setIsLoading(true)
            const handleError = (e: Event) => {
                setIsLoading(false)
                setIsPlaying(false)
                console.error("Error playing file", e)
                // Skip on error
                nextTrack()
            }
            const handleEnded = () => nextTrack()

            audio.addEventListener("canplay", handleCanPlay)
            audio.addEventListener("waiting", handleWaiting)
            audio.addEventListener("error", handleError)
            audio.addEventListener("ended", handleEnded)

            // Auto-play if we are in playing state
            if (isPlaying) {
                setIsLoading(true)
                audio.play().catch(e => {
                    console.error("Auto-play failed", e)
                    setIsLoading(false)
                })
            }

            return () => {
                audio.pause()
                audio.removeEventListener("canplay", handleCanPlay)
                audio.removeEventListener("waiting", handleWaiting)
                audio.removeEventListener("error", handleError)
                audio.removeEventListener("ended", handleEnded)
                audioRef.current = null
            }
        } else if (track.type === 'gamma') {
            setIsLoading(false)
            if (isPlaying) {
                startGamma()
            }
        }
    }, [currentTrackIndex])

    // Cleanup on unmount
    useEffect(() => {
        return () => stopAll()
    }, [])

    const stopAll = () => {
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current = null
        }
        stopGamma()
    }

    const startGamma = () => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
            }

            const ctx = audioContextRef.current
            // Resume context if suspended (browser autoplay policy)
            if (ctx.state === 'suspended') {
                ctx.resume()
            }

            const osc = ctx.createOscillator()
            const gain = ctx.createGain()

            osc.type = 'sine'
            osc.frequency.setValueAtTime(40, ctx.currentTime) // 40Hz Gamma

            // Set volume
            const volume = isMuted ? 0 : 0.05 // Very low volume for pure tone
            gain.gain.setValueAtTime(volume, ctx.currentTime)

            osc.connect(gain)
            gain.connect(ctx.destination)

            osc.start()
            oscillatorRef.current = osc
            gainNodeRef.current = gain
        } catch (e) {
            console.error("Failed to start Gamma", e)
        }
    }

    const stopGamma = () => {
        if (oscillatorRef.current) {
            try {
                oscillatorRef.current.stop()
                oscillatorRef.current.disconnect()
            } catch (e) { /* ignore */ }
            oscillatorRef.current = null
        }
        if (gainNodeRef.current) {
            gainNodeRef.current.disconnect()
            gainNodeRef.current = null
        }
    }

    const nextTrack = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length)
    }

    const togglePlay = () => {
        const track = PLAYLIST[currentTrackIndex]

        if (isPlaying) {
            // Pause
            setIsPlaying(false)
            if (track.type === 'file' && audioRef.current) {
                audioRef.current.pause()
            } else if (track.type === 'gamma') {
                stopGamma()
            }
        } else {
            // Play
            setIsPlaying(true)
            if (track.type === 'file' && audioRef.current) {
                setIsLoading(true)
                audioRef.current.play()
                    .then(() => setIsLoading(false))
                    .catch(() => setIsLoading(false))
            } else if (track.type === 'gamma') {
                startGamma()
            }
        }
    }

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation()
        const track = PLAYLIST[currentTrackIndex]

        const newMutedState = !isMuted
        setIsMuted(newMutedState)

        if (track.type === 'file' && audioRef.current) {
            audioRef.current.muted = newMutedState
        } else if (track.type === 'gamma' && gainNodeRef.current && audioContextRef.current) {
            gainNodeRef.current.gain.setValueAtTime(newMutedState ? 0 : 0.05, audioContextRef.current.currentTime)
        }
    }

    // Styles based on dark mode
    const styles = {
        container: darkMode
            ? "bg-indigo-900/30 border-indigo-500/30 text-indigo-100"
            : "bg-white border-zinc-200 text-zinc-600",
        button: darkMode
            ? "hover:bg-indigo-500/20"
            : "hover:bg-zinc-100",
        activeContainer: darkMode
            ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-100"
            : "bg-zinc-100 border-zinc-300 text-zinc-900",
        icon: darkMode ? "text-indigo-300" : "text-zinc-500",
        activeIcon: "text-emerald-500",
        animate: isPlaying ? "animate-pulse" : ""
    }

    const currentTrack = PLAYLIST[currentTrackIndex]
    const isGamma = currentTrack.type === 'gamma'

    return (
        <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border transition-all duration-300 ${isPlaying ? styles.activeContainer : styles.container}`}>
            <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className={`h-7 w-7 ${styles.button} ${isPlaying ? "text-emerald-500" : styles.icon}`}
                title={isPlaying ? "Pause" : "Play"}
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    isGamma ? <BrainCircuit className={`w-4 h-4 ${isPlaying ? "animate-pulse" : ""}`} /> :
                        <Headphones className={`w-4 h-4 ${isPlaying ? "animate-bounce-subtle" : ""}`} />
                )}
            </Button>

            <div className="flex flex-col max-w-[100px]">
                <span className="text-[10px] font-medium leading-none truncate">{currentTrack.name}</span>
                <span className="text-[9px] opacity-70 leading-none truncate">{isPlaying ? "Active" : "Focus Mode"}</span>
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={nextTrack}
                className={`h-6 w-6 ml-1 ${styles.button} ${styles.icon}`}
                title="Next Track"
            >
                <SkipForward className="w-3 h-3" />
            </Button>

            {isPlaying && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className={`h-6 w-6 ml-1 ${styles.button} ${styles.icon}`}
                    title={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                </Button>
            )}
        </div>
    )
}
