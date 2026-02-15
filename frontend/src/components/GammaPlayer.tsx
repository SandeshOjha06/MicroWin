import { useState, useEffect, useRef } from "react";
import { Play, Pause, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GammaPlayerProps {
    darkMode: boolean;
}

export function GammaPlayer({ darkMode }: GammaPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.15); // Default comfortable volume
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscillatorNodeRef = useRef<OscillatorNode | null>(null); // Carrier (432Hz)
    const lfoNodeRef = useRef<OscillatorNode | null>(null); // Pulse (40Hz)
    const gainNodeRef = useRef<GainNode | null>(null);

    const togglePlay = () => {
        if (isPlaying) {
            stopSound();
        } else {
            playSound();
        }
        setIsPlaying(!isPlaying);
    };

    const playSound = () => {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        // 1. Carrier Tone: 432Hz (Calming base)
        const carrier = ctx.createOscillator();
        carrier.type = "sine";
        carrier.frequency.value = 432;

        // 2. LFO (Low Frequency Oscillator): 40Hz (Gamma Focus)
        // This modulates the volume of the carrier to create the pulse
        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 40;

        // 3. Gain Node for LFO depth (How deep the pulse is)
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.5; // Depth of modulation

        // 4. Main Volume Gain
        const mainGain = ctx.createGain();
        mainGain.gain.value = volume;
        gainNodeRef.current = mainGain;

        // Connections:
        // LFO -> LFO Gain -> Main Gain.gain (Modulates volume)
        // Carrier -> Main Gain -> Destination

        // Actually, properly implementing Amplitude Modulation (AM):
        // Carrier connects to a Gain Node. 
        // LFO connects to that Gain Node's gain parameter.

        const ampGain = ctx.createGain();
        ampGain.gain.value = 0.5; // Base amplitude

        lfo.connect(ampGain.gain); // Modulate amplitude
        carrier.connect(ampGain);
        ampGain.connect(mainGain);
        mainGain.connect(ctx.destination);

        carrier.start();
        lfo.start();

        oscillatorNodeRef.current = carrier;
        lfoNodeRef.current = lfo;
    };

    const stopSound = () => {
        if (oscillatorNodeRef.current) {
            // Ramp down to avoid click
            gainNodeRef.current?.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current!.currentTime + 0.1);
            setTimeout(() => {
                oscillatorNodeRef.current?.stop();
                lfoNodeRef.current?.stop();
                audioCtxRef.current?.close();
            }, 150);
        }
    };

    useEffect(() => {
        // Update volume in real-time if playing
        if (gainNodeRef.current && isPlaying) {
            gainNodeRef.current.gain.setTargetAtTime(volume, audioCtxRef.current!.currentTime, 0.1);
        }
    }, [volume, isPlaying]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
                stopSound();
            }
        };
    }, []);

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${darkMode
                ? "bg-[#3E3226] border-[#5C4B3A] text-orange-100"
                : "bg-white border-orange-200 text-stone-600"
            }`}>
            <Activity className={`w-4 h-4 ${isPlaying ? "text-green-500 animate-pulse" : "text-stone-400"}`} />

            <span className="text-[10px] uppercase font-bold tracking-wider mr-1">Gamma 40Hz</span>

            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-transparent"
                onClick={togglePlay}
            >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </Button>

            {isPlaying && (
                <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none accent-orange-500"
                    title="Volume"
                />
            )}
        </div>
    );
}
