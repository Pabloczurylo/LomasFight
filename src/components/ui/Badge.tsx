import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'outline' | 'red' | 'green';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
    const variants = {
        default: "bg-gray-100 text-gray-800",
        outline: "text-gray-800 border border-gray-200",
        red: "bg-red-50 text-brand-red border border-red-100",
        green: "bg-green-50 text-brand-green border border-green-100",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors",
                variants[variant],
                className
            )}
            {...props}
        />
    );
}
