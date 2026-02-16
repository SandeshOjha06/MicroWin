import { Type } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useTheme } from "@/contexts/ThemeContext"

interface FontSwitcherProps {
    darkMode: boolean
}

export function FontSwitcher({ darkMode }: FontSwitcherProps) {
    const { font, setFont } = useTheme()

    const triggerClass = darkMode
        ? "w-[140px] h-9 gap-2 bg-[#3E3226] border-[#5C4B3A] text-orange-50 hover:bg-[#4A3C2F]"
        : "w-[140px] h-9 gap-2 bg-white border-orange-200 text-stone-700 hover:bg-orange-50"

    const contentClass = darkMode
        ? "bg-[#2C241B] border-[#5C4B3A] text-orange-50"
        : "bg-white border-orange-200 text-stone-700"

    const itemClass = darkMode
        ? "hover:bg-[#3E3226] focus:bg-[#3E3226] cursor-pointer"
        : "hover:bg-orange-50 focus:bg-orange-50 cursor-pointer"

    return (
        <Select value={font} onValueChange={(value: any) => setFont(value)}>
            <SelectTrigger className={triggerClass}>
                <Type className="h-4 w-4" />
                <SelectValue placeholder="Select Font" />
            </SelectTrigger>
            <SelectContent className={contentClass}>
                <SelectItem value="inter" className={`font-inter ${itemClass}`}>
                    Default (Inter)
                </SelectItem>
                <SelectItem value="opendyslexic" className={`font-opendyslexic ${itemClass}`}>
                    OpenDyslexic
                </SelectItem>
                <SelectItem value="verdana" className={`font-verdana ${itemClass}`}>
                    Verdana
                </SelectItem>
            </SelectContent>
        </Select>
    )
}
