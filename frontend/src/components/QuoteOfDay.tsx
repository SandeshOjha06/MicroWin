import { useState, useEffect } from "react";
import { Quote } from "lucide-react";

const QUOTES = [
    { text: "Small steps lead to big changes.", author: "Anonymous" },
    { text: "Progress is progress, no matter how small.", author: "Anonymous" },
    { text: "You don't have to be perfect to be amazing.", author: "Anonymous" },
    { text: "Focus on the step in front of you, not the whole staircase.", author: "Anonymous" },
    { text: "Every accomplishment starts with the decision to try.", author: "John F. Kennedy" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
];

export function QuoteOfDay({ className }: { className?: string }) {
    const [quote, setQuote] = useState(QUOTES[0]);

    useEffect(() => {
        // Pick a quote based on the day of the year to keep it consistent for the day
        const dayOfYear = Math.floor(
            (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
            1000 /
            60 /
            60 /
            24
        );
        setQuote(QUOTES[dayOfYear % QUOTES.length]);
    }, []);

    return (
        <div className={`flex flex-col gap-2 p-4 rounded-xl bg-white/50 border border-orange-100/50 backdrop-blur-sm ${className}`}>
            <div className="flex items-start gap-2">
                <Quote className="w-4 h-4 text-orange-400 flex-shrink-0 mt-1" />
                <div>
                    <p className="text-sm font-medium text-stone-700 italic">"{quote.text}"</p>
                    <p className="text-xs text-stone-500 mt-1">— {quote.author}</p>
                </div>
            </div>
        </div>
    );
}
