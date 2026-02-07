import { useMemo } from "react";
import { addDays, daysShort, getStartOfWeek } from "../../../lib/dateUtils";
import { cn } from "../../../lib/utils";
import { ClassCard } from "./ClassCard";

interface CalendarEvent {
    id: number | string;
    day: string; // "LUNES", "MARTES", etc. - logic needs to map this to date or index
    time: string; // "HH:mm - HH:mm"
    discipline: string;
    instructor?: string;
    variant: "muaythai" | "kickboxing" | "boxeo" | "jiujitsu" | "mma" | "default";
}

interface CalendarGridProps {
    currentDate: Date;
    view: 'week' | 'day';
    events: CalendarEvent[];
}

const START_HOUR = 8;
const END_HOUR = 22;
const TOTAL_HOURS = END_HOUR - START_HOUR + 1; // 15 hours
const SLOTS_PER_HOUR = 2; // 30 min slots
const TOTAL_SLOTS = TOTAL_HOURS * SLOTS_PER_HOUR; // 30 slots

export function CalendarGrid({ currentDate, view, events }: CalendarGridProps) {
    const weekStart = getStartOfWeek(currentDate);

    const days = useMemo(() => {
        if (view === 'day') {
            return [currentDate];
        }
        // Generate Mon-Sat (6 days) as per mockup, or Mon-Sun?
        // Mockup shows LUN, MAR, ..., SAB. No DOM.
        // Let's do Mon-Sat for now based on mockup.
        const d = [];
        // weekStart is usually adjusted to Monday in my helper? 
        // My helper: d.getDay() - day + ... -> if Sunday (0), -6 (Mon).
        // So weekStart is Monday.
        for (let i = 0; i < 6; i++) {
            d.push(addDays(weekStart, i));
        }
        return d;
    }, [currentDate, view, weekStart]);

    // Helper to get grid row from time string "HH:mm"
    const getGridRow = (timeStr: string) => {
        const [hours, minutes] = timeStr.trim().split(':').map(Number);
        // Calculate slot index from START_HOUR
        // (hours - START_HOUR) * 2 + (minutes / 30) + 1 (1-based grid)
        if (hours < START_HOUR) return 1; // Handle early classes if any
        return (hours - START_HOUR) * 2 + (minutes >= 30 ? 1 : 0) + 1;
    };

    const getDurationSlots = (timeRange: string) => {
        const [start, end] = timeRange.split('-').map(t => t.trim());
        const startRow = getGridRow(start);
        const endRow = getGridRow(end);
        return endRow - startRow;
    };

    // Helper to map Day string (LUNES) to index in days array
    // This is tricky because the event data has "LUNES" but the grid is based on dates.
    // For V1 (mock data), I'll assume "LUNES" maps to the first day of the week view.
    // In a real app, events should have full dates or day_of_week index.
    const dayMap: Record<string, number> = {
        'LUNES': 0, 'MARTES': 1, 'MIÉRCOLES': 2, 'JUEVES': 3, 'VIERNES': 4, 'SÁBADO': 5, 'DOMINGO': 6
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header: Days */}
            <div className="flex border-b border-gray-100">
                <div className="w-16 flex-shrink-0 border-r border-gray-100"></div> {/* Time column header placeholder */}
                <div className={`flex-1 grid ${view === 'week' ? 'grid-cols-6' : 'grid-cols-1'} divide-x divide-gray-100`}>
                    {days.map((date, i) => (
                        <div key={i} className="py-4 text-center">
                            <div className={cn("text-xs font-bold uppercase tracking-wider mb-1",
                                // Highlight today?
                                date.toDateString() === new Date().toDateString() ? "text-brand-red" : "text-gray-500"
                            )}>
                                {daysShort[date.getDay()]}
                            </div>
                            <div className={cn("text-xl font-heading font-bold",
                                date.toDateString() === new Date().toDateString() ? "text-brand-red" : "text-gray-900"
                            )}>
                                {date.getDate()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Grid Body */}
            <div className="flex-1 overflow-y-auto relative custom-scrollbar">
                <div className="flex min-h-[600px]"> {/* Height ensures scroll if needed */}
                    {/* Time Column */}
                    <div className="w-16 flex-shrink-0 border-r border-gray-100 bg-gray-50/30 text-xs text-gray-400 font-medium text-center custom-time-labels">
                        {Array.from({ length: TOTAL_HOURS }).map((_, i) => {
                            const hour = START_HOUR + i;
                            // Only show even hours to reduce clutter? Or all? Mockup shows 08:00, 10:00...
                            // Let's show every 2 hours or just simple list.
                            if (hour % 2 !== 0 && hour !== START_HOUR) return null; // Show every 2 hours?
                            return (
                                <div key={i} className="h-24 relative border-b border-gray-50 flex items-start justify-center pt-2"> {/* 2 slots = 1 hour = h-24 if each slot h-12? */}
                                    {hour.toString().padStart(2, '0')}:00
                                </div>
                            )
                        })}
                    </div>

                    {/* Events Grid */}
                    <div className={`flex-1 grid ${view === 'week' ? 'grid-cols-6' : 'grid-cols-1'} divide-x divide-gray-100 relative`}>
                        {days.map((dayDate, colIndex) => {
                            // Find events for this day
                            const dayName = Object.keys(dayMap).find(key => dayMap[key] === dayDate.getDay() - 1); // getDay 1=Mon, dayMap LUNES=0
                            // Logic fix: dayMap[LUNES] = 0. dayDate.getDay() -> Mon = 1.
                            // So dayMap match is: dayDate.getDay() - 1 === value
                            // Actually just filter events by day name corresponding to this column

                            const dayEvents = events.filter(e => {
                                // Simple mapping for mockup data
                                const dayIndex = dayMap[e.day.toUpperCase()];
                                // Adjust for Sunday=0 in JS Date
                                const currentDayIndex = dayDate.getDay() === 0 ? 6 : dayDate.getDay() - 1;
                                return dayIndex === currentDayIndex;
                            });

                            return (
                                <div key={colIndex} className="relative bg-white">
                                    {/* Grid Lines (Horizontal) - corresponding to Time Column */}
                                    <div className="absolute inset-0 grid grid-rows-[repeat(28,minmax(3rem,1fr))]">
                                        {/* 14 hours * 2 slots = 28 rows. 3rem ~ 48px per slot? */}
                                        {Array.from({ length: TOTAL_SLOTS }).map((_, idx) => (
                                            <div key={idx} className="border-b border-gray-50/50 box-border"></div>
                                        ))}
                                    </div>

                                    {/* Render Events */}
                                    {dayEvents.map((evt, idx) => {
                                        const [startTime, endTime] = evt.time.split(' - ');
                                        const startRow = getGridRow(startTime);
                                        const span = getDurationSlots(evt.time);

                                        // Calculate Top and Height percentages or use grid placement
                                        // Grid placement is better if container is grid.
                                        // But here container is relative with absolute lines.
                                        // Let's use simple percentages or absolute position based on row height calculation?
                                        // Actually, let's try CSS Grid for the column content too?

                                        // Let's stick to absolute positioning within the column for precision
                                        // Total slots = 28.
                                        const topPercent = ((startRow - 1) / TOTAL_SLOTS) * 100;
                                        const heightPercent = (span / TOTAL_SLOTS) * 100;

                                        return (
                                            <div
                                                key={idx}
                                                className="absolute w-[95%] left-[2.5%] z-10 transition-all hover:z-20 p-0.5"
                                                style={{
                                                    top: `${topPercent}%`,
                                                    height: `${heightPercent}%`,
                                                }}
                                            >
                                                <ClassCard
                                                    discipline={evt.discipline}
                                                    time={evt.time}
                                                    variant={evt.variant}
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
