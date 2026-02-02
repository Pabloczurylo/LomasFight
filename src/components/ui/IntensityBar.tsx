import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface IntensityBarProps {
    percentage: number;
    label?: string;
    className?: string;
    showValue?: boolean;
}

export function IntensityBar({
    percentage,
    label = "INTENSIDAD",
    className,
    showValue = true
}: IntensityBarProps) {
    // Ensure percentage is between 0 and 100
    const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

    return (
        <div className={cn("w-full space-y-1.5", className)}>
            <div className="flex justify-between items-center text-xs font-bold font-heading tracking-wider">
                <span className="text-gray-400 uppercase">{label}</span>
                {showValue && (
                    <span className="text-brand-gray">{clampedPercentage}%</span>
                )}
            </div>
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden relative">
                <div
                    className="h-full bg-brand-red shadow-[0_0_10px_rgba(214,40,40,0.5)] transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${clampedPercentage}%` }}
                />
            </div>
        </div>
    );
}
