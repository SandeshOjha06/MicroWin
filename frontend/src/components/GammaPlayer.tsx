import { useState, useEffect, useRef } from "react";
import { Play, Pause, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import track1 from "@/assets/delosound-lofi-chill-483783.mp3";
import track2 from "@/assets/delosound-lofi-lofi-chill-lofi-girl-466467.mp3";
import track3 from "@/assets/delosound-lofi-lofi-chill-lofi-girl-471138.mp3";
import track4 from "@/assets/lofi-2.mp3";

const PLAYLIST = [track1, track2, track3, track4];

interface GammaPlayerProps {
    darkMode: boolean;
}

export function GammaPlayer({ darkMode }: GammaPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [audioError, setAudioError] = useState(false);


    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            // "Soothing" effect: slowed down slightly
            audioRef.current.playbackRate = 0.85;
            audioRef.current.play().catch(e => {
                console.error("Audio play failed:", e);
                setAudioError(true);
            });
        }
        setIsPlaying(!isPlaying);
    };

    const handleEnded = () => {

        // Play next track
        setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    };

    // Auto-play when track changes if already playing
    useEffect(() => {
        if (isPlaying && audioRef.current) {
            // Need to reload/play the new src
            audioRef.current.playbackRate = 0.85; // Ensure rate persists
            audioRef.current.play().catch(console.error);
        }
    }, [currentTrackIndex]);


    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${darkMode
            ? "bg-[#3E3226] border-[#5C4B3A] text-orange-100"
            : "bg-white border-orange-200 text-stone-600"
            } ${audioError ? "border-red-500" : ""}`}>

            <audio
                ref={audioRef}
                src={PLAYLIST[currentTrackIndex]}
                onEnded={handleEnded}
                onError={() => setAudioError(true)}
            />


            <Music className={`w-4 h-4 ${isPlaying ? "text-indigo-400 animate-pulse" : "text-stone-400"}`} />

            <div className="flex flex-col leading-none mr-1">
                <span className="text-[10px] uppercase font-bold tracking-wider">Mellow Lofi</span>
                {audioError && <span className="text-[8px] text-red-500 font-bold">Audio Error</span>}
            </div>

            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-transparent"
                onClick={togglePlay}
                disabled={audioError}
            >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </Button>

            {isPlaying && (
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none accent-indigo-500"
                    title="Volume"
                />
            )}
        </div>
    );
}

