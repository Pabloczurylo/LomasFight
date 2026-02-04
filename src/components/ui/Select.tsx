import * as React from "react";
import { cn } from "../../lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { }

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div className="relative">
                <select
                    className={cn(
                        "flex h-10 w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 appearance-none font-medium text-gray-700",
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </select>
                {/* Chevron Down Icon overlay for custom appearance if needed, 
                    but simplistic unified styling is fine for now provided it looks good. 
                    Standard appearance-none + icon usually required for perfect custom select. 
                    For now, relying on native or adding a wrapper icon would be ideal.
                */}
            </div>
        );
    }
);
Select.displayName = "Select";

export { Select };
