import { cn } from "../../../lib/utils";

interface ClassCardProps {
    discipline: string;
    time: string; // e.g., "09:00 - 10:30"
    instructor?: string; // Optional, e.g., "Prof. Sanchez"
    variant: "muaythai" | "kickboxing" | "boxeo" | "jiujitsu" | "mma" | "default";
    onClick?: () => void;
}

export function ClassCard({ discipline, time, instructor, onClick }: ClassCardProps) {
    // Forced style as per user request: Red background, Black border.
    const forcedStyle = "bg-brand-red text-white border-black border";

    return (
        <div
            onClick={onClick}
            className={cn(
                "p-1.5 rounded-md border text-xs cursor-pointer transition-all hover:brightness-95 flex flex-col gap-0.5 shadow-sm h-full",
                forcedStyle
            )}
        >
            <div className="font-bold uppercase tracking-wide text-[9px] leading-tight opacity-90 truncate text-white">
                {discipline}
            </div>
            <div className="font-semibold text-[10px] text-white/90">
                {time}
            </div>
            {instructor && (
                <div className="text-[9px] italic mt-auto truncate text-white/80">
                    {instructor}
                </div>
            )}
        </div>
    );
}
