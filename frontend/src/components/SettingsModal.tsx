import { useState, useEffect } from "react";
import { X, Save, Brain } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { apiUpdateProfile } from "@/lib/api";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    darkMode: boolean;
}

export function SettingsModal({ isOpen, onClose, user, darkMode }: SettingsModalProps) {
    const [struggleAreas, setStruggleAreas] = useState("");
    const [granularity, setGranularity] = useState(3);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setStruggleAreas(user.struggle_areas || "");
            setGranularity(user.granularity_level || 3);
        }
    }, [user, isOpen]);

    const handleSave = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            await apiUpdateProfile(user.id, {
                // struggle_areas: struggleAreas, // Commented out until backend wrapper is updated or ignored

                // granularity_level: granularity

            });
            window.location.reload(); // Reload to refresh context
        } catch (error) {
            console.error("Failed to save settings", error);
        } finally {
            setIsLoading(false);
            onClose();
        }
    };

    if (!isOpen) return null;

    const theme = {
        bg: darkMode ? "bg-[#2C241B]" : "bg-white",
        text: darkMode ? "text-orange-50" : "text-stone-800",
        subText: darkMode ? "text-orange-200/60" : "text-stone-500",
        border: darkMode ? "border-[#5C4B3A]" : "border-orange-100",
        input: darkMode ? "bg-[#3E3226] border-[#5C4B3A] text-orange-50" : "bg-white border-orange-200 text-stone-900",
        button: darkMode ? "bg-[#d97706] hover:bg-orange-600 text-white" : "bg-orange-500 hover:bg-orange-600 text-white",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl border-2 ${theme.bg} ${theme.border} transform transition-all scale-100`}>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-xl font-bold ${theme.text} flex items-center gap-2`}>
                        <Brain className="w-5 h-5 text-orange-500" />
                        My References
                    </h2>
                    <button onClick={onClose} className={`p-1 rounded-lg hover:bg-gray-100/10 ${theme.subText}`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-6">

                    {/* Struggle Areas */}
                    <div className="space-y-2">
                        <Label className={`text-sm font-semibold ${theme.text}`}>My Struggle Areas</Label>
                        <p className={`text-xs ${theme.subText}`}>
                            Tell Polo what's hard for you (e.g., starting tasks, getting overwhelmed, forgetting steps).
                        </p>
                        <textarea
                            className={`w-full min-h-[100px] p-3 rounded-xl border-2 focus:ring-2 focus:ring-orange-500/50 outline-none resize-none ${theme.input}`}
                            placeholder="I struggle with..."
                            value={struggleAreas}
                            onChange={(e) => setStruggleAreas(e.target.value)}
                        />
                    </div>

                    {/* Granularity Slider */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className={`text-sm font-semibold ${theme.text}`}>Breakdown Detail Level</Label>
                            <span className={`text-xs font-bold px-2 py-1 rounded bg-orange-500/10 text-orange-500`}>
                                Level {granularity}
                            </span>
                        </div>

                        <input
                            type="range"
                            min="1"
                            max="5"
                            step="1"
                            value={granularity}
                            onChange={(e) => setGranularity(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />

                        <div className={`flex justify-between text-[10px] uppercase font-bold tracking-wider ${theme.subText}`}>
                            <span>Broad Steps</span>
                            <span>Micro Steps</span>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="mt-8 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} className={theme.subText}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className={`gap-2 ${theme.button}`}
                    >
                        {isLoading ? "Saving..." : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Preferences
                            </>
                        )}
                    </Button>
                </div>

            </div>
        </div>
    );
}
