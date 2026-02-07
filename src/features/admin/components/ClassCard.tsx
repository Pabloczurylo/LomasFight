import { cn } from "../../../lib/utils";

interface ClassCardProps {
    discipline: string;
    time: string; // e.g., "09:00 - 10:30"
    instructor?: string; // Optional, e.g., "Prof. Sanchez"
    variant: "muaythai" | "kickboxing" | "boxeo" | "jiujitsu" | "mma" | "default";
    onClick?: () => void;
}

export function ClassCard({ discipline, time, instructor, variant = "default", onClick }: ClassCardProps) {
    const variants = {
        muaythai: "bg-brand-red text-white border-brand-red",
        kickboxing: "bg-red-50 text-brand-red border-red-100",
        boxeo: "bg-gray-900 text-white border-gray-900",
        jiujitsu: "bg-blue-50 text-blue-700 border-blue-100",
        mma: "bg-yellow-50 text-yellow-700 border-yellow-100",
        default: "bg-white text-gray-900 border-gray-200",
    };

    // Helper to determine if we need a specific text color for secondary text (instructor/time)
    // For dark backgrounds (muaythai, boxeo), text should be white/white-80.
    // For light backgrounds (kickboxing, etc), text should be dark/gray-600.
    const isDarkBg = variant === "muaythai" || variant === "boxeo";
    const timeColor = isDarkBg ? "text-white/90" : "text-gray-900";
    const subTextColor = isDarkBg ? "text-white/70" : "text-gray-500";

    // In the mockup, Kickboxing has: 
    // Kickboxing (Red/Pinkish text)
    // 18:00 - 19:30 (Black text)
    // Prof. Sanchez (Gray text)
    // Background is Light Pink.

    // Boxeo:
    // Boxeo (White)
    // 18:00 - 19:00 (White)

    // Muay Thai:
    // All White.

    return (
        <div
            onClick={onClick}
            className={cn(
                "p-3 rounded-lg border text-sm cursor-pointer transition-all hover:brightness-95 flex flex-col gap-1 shadow-sm h-full",
                variants[variant] || variants.default
            )}
        >
            <div className="font-bold uppercase tracking-wide text-[10px] leading-tight opacity-90">
                {discipline}
            </div>
            <div className={cn("font-semibold text-xs", variant === 'kickboxing' ? 'text-gray-900' : timeColor)}>
                {time}
            </div>
            {instructor && (
                <div className={cn("text-[10px] italic mt-auto", variant === 'kickboxing' ? 'text-gray-500' : subTextColor)}>
                    {instructor}
                </div>
            )}
        </div>
    );
}
