import { useEffect, useState } from "react"
import { motion } from "framer-motion"

type Mood = "idle" | "thinking" | "happy" | "celebrating"

interface MascotProps {
    mood: Mood
    className?: string
}

export function Mascot({ mood, className = "" }: MascotProps) {
    // Local state to override props for random animations
    // If the parent passes "idle", we can sometimes override it with "happy" or "thinking"
    // If the parent passes a specific mood (like "celebrating"), we respect it.
    const [internalMood, setInternalMood] = useState<Mood>(mood);

    // Sync internal mood with prop mood when prop changes
    useEffect(() => {
        setInternalMood(mood);
    }, [mood]);

    // 1. GREETING WAVE ON LOAD
    useEffect(() => {
        // Only wave if starting in idle
        if (mood === "idle") {
            setInternalMood("happy");
            const timer = setTimeout(() => {
                setInternalMood("idle");
            }, 2000); // Wave for 2 seconds
            return () => clearTimeout(timer);
        }
    }, []); // Run once on mount

    // 2. RANDOM INTERACTIVE ACTIONS (Boredom implementation)
    useEffect(() => {
        if (mood !== "idle") return; // Only do random things if supposedly idle

        const interval = setInterval(() => {
            const random = Math.random();
            if (random > 0.7) {
                // 30% chance to do something
                const action = Math.random() > 0.5 ? "thinking" : "happy";
                setInternalMood(action);

                // Go back to idle after a bit
                setTimeout(() => {
                    setInternalMood("idle");
                }, 2000);
            }
        }, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
    }, [mood]);

    // Simple "Polar Bear" using geometric shapes and framer-motion for life

    // Mood-based variants
    const headVariants = {
        idle: { y: [0, -2, 0], rotate: [0, 1, 0, -1, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const } },
        thinking: { rotate: 5, y: 2, transition: { duration: 0.5 } },
        happy: { y: [0, -5, 0], rotate: [0, -5, 5, 0], transition: { duration: 0.5, repeat: 2 } },
        celebrating: { y: [0, -8, 0], transition: { duration: 0.4, repeat: Infinity } }
    }

    const armLeftVariants = {
        idle: { rotate: 0, transition: { duration: 0.5 } },
        thinking: { rotate: -15, y: -5, transition: { duration: 0.5 } }, // Hand to chin
        happy: { rotate: [0, -45, 0], transition: { duration: 0.5, repeat: 2 } }, // Wave
        celebrating: { rotate: [0, -120, -90], x: [0, 5, 0], transition: { duration: 0.2, repeat: Infinity, repeatType: "reverse" as const } } // Clap
    }

    const armRightVariants = {
        idle: { rotate: 0, transition: { duration: 0.5 } },
        thinking: { rotate: 0, transition: { duration: 0.5 } },
        happy: { rotate: [0, 45, 0], transition: { duration: 0.5, repeat: 2 } }, // Wave
        celebrating: { rotate: [0, 120, 90], x: [0, -5, 0], transition: { duration: 0.2, repeat: Infinity, repeatType: "reverse" as const } } // Clap
    }

    // Use internalMood for rendering
    const currentMood = internalMood;

    return (
        <div className={`relative w-40 h-40 ${className}`}>
            {/* SVG Bear */}
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
                {/* Body */}
                <motion.path
                    d="M60 180 C60 100, 140 100, 140 180 L140 200 L60 200 Z"
                    fill="#F8FAFC"
                    className="stroke-stone-200"
                    strokeWidth="2"
                />
                {/* Belly */}
                <path
                    d="M80 180 C80 140, 120 140, 120 180"
                    fill="#E2E8F0"
                    opacity="0.5"
                />

                {/* Left Arm (Behind) */}
                <motion.g variants={armLeftVariants} animate={currentMood} style={{ originX: 0.9, originY: 0.1 }}>
                    <path d="M60 140 C40 140, 40 170, 60 170 L70 150 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                </motion.g>

                {/* Right Arm (Behind) */}
                <motion.g variants={armRightVariants} animate={currentMood} style={{ originX: 0.1, originY: 0.1 }}>
                    <path d="M140 140 C160 140, 160 170, 140 170 L130 150 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                </motion.g>

                {/* Head Group */}
                <motion.g variants={headVariants} animate={currentMood}>
                    {/* Ears */}
                    <circle cx="75" cy="85" r="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                    <circle cx="125" cy="85" r="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />

                    {/* Face Base */}
                    <ellipse cx="100" cy="100" rx="40" ry="35" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />

                    {/* Snout */}
                    <ellipse cx="100" cy="110" rx="14" ry="10" fill="#E2E8F0" />
                    <path d="M96 108 Q100 112 104 108" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" /> {/* Nose */}
                    <circle cx="100" cy="106" r="3" fill="#1E293B" /> {/* Nose Tip */}

                    {/* Eyes */}
                    {currentMood === "thinking" ? (
                        <>
                            <circle cx="85" cy="95" r="2" fill="#1E293B" />
                            <line x1="110" y1="92" x2="120" y2="98" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" /> {/* Squint */}
                        </>
                    ) : currentMood === "happy" || currentMood === "celebrating" ? (
                        <>
                            <path d="M82 95 Q86 92 90 95" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" /> {/* Happy Eye L */}
                            <path d="M110 95 Q114 92 118 95" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" /> {/* Happy Eye R */}
                        </>
                    ) : (
                        <>
                            <circle cx="86" cy="95" r="3" fill="#1E293B" />
                            <circle cx="114" cy="95" r="3" fill="#1E293B" />
                            {/* Blinking effect could be added here */}
                        </>
                    )}

                    {/* Mouth */}
                    {currentMood === "happy" || currentMood === "celebrating" ? (
                        <path d="M95 116 Q100 122 105 116" fill="none" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
                    ) : (
                        <path d="M97 118 L103 118" fill="none" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
                    )}

                    {/* Cheeks */}
                    <circle cx="75" cy="105" r="4" fill="#FECDD3" opacity="0.6" />
                    <circle cx="125" cy="105" r="4" fill="#FECDD3" opacity="0.6" />

                </motion.g>


            </svg>
        </div>
    )
}
