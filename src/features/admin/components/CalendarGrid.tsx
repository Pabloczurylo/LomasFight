import { useMemo } from "react";
import { ClassCard } from "./ClassCard";

interface CalendarEvent {
    id: number | string;
    day: string; // "LUNES", "MARTES", etc.
    time: string; // "HH:mm - HH:mm"
    discipline: string;
    instructor?: string;
    variant: "muaythai" | "kickboxing" | "boxeo" | "jiujitsu" | "mma" | "default";
}

interface CalendarGridProps {
    view: 'week' | 'day';
    events: CalendarEvent[];
    onEventClick: (classItem: CalendarEvent) => void;
}

const START_HOUR = 8;
const END_HOUR = 22;
const TOTAL_HOURS = END_HOUR - START_HOUR + 1; // 15 hours
const SLOTS_PER_HOUR = 2; // 30 min slots
const TOTAL_SLOTS = TOTAL_HOURS * SLOTS_PER_HOUR; // 30 slots

const WEEK_DAYS = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];

export function CalendarGrid({ view, events, onEventClick }: CalendarGridProps) {

    const days = useMemo(() => {
        if (view === 'day') {
            // For Day view, without date selection, we might just default to showing Lunes logic or just all days in a column?
            // Or maybe just show 'LUNES' as the first one?
            // Given the user request is "remove function to advance weeks", and "show days from Mon-Sat",
            // sticking to week view is safest. If they toggle 'day', I'll just show 'LUNES' for now or the first day.
            // But let's assume 'week' is the main view.
            return ['LUNES'];
        }
        return WEEK_DAYS;
    }, [view]);

    // Helper to get grid row from time string "HH:mm"
    const getGridRow = (timeStr: string) => {
        const [hours, minutes] = timeStr.trim().split(':').map(Number);
        if (hours < START_HOUR) return 1;
        return (hours - START_HOUR) * 2 + (minutes >= 30 ? 1 : 0) + 1;
    };

    const getDurationSlots = (timeRange: string) => {
        const [start, end] = timeRange.split('-').map(t => t.trim());
        const startRow = getGridRow(start);
        const endRow = getGridRow(end);
        return endRow - startRow;
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header: Days */}
            <div className="flex border-b border-gray-100">
                <div className="w-12 flex-shrink-0 border-r border-gray-100"></div>
                <div className={`flex-1 grid ${view === 'week' ? 'grid-cols-6' : 'grid-cols-1'} divide-x divide-gray-100`}>
                    {days.map((dayName, i) => (
                        <div key={i} className="py-3 text-center bg-gray-50/30">
                            <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                                {dayName}
                            </div>
                            {/* Removed the numeric date */}
                        </div>
                    ))}
                </div>
            </div>

            {/* Grid Body */}
            <div className="flex-1 overflow-y-auto relative custom-scrollbar">
                <div className="flex min-h-[600px]">
                    {/* Time Column */}
                    <div className="w-12 flex-shrink-0 border-r border-gray-100 bg-gray-50/30 text-[10px] text-gray-400 font-medium text-center custom-time-labels">
                        {Array.from({ length: TOTAL_HOURS }).map((_, i) => {
                            const hour = START_HOUR + i;
                            const showLabel = hour % 2 === 0 || hour === START_HOUR;
                            return (
                                <div key={i} className="h-[4.5rem] relative border-b border-gray-50 flex items-start justify-center pt-1.5">
                                    {showLabel ? `${hour.toString().padStart(2, '0')}:00` : ''}
                                </div>
                            )
                        })}
                    </div>

                    {/* Events Grid */}
                    <div className={`flex-1 grid ${view === 'week' ? 'grid-cols-6' : 'grid-cols-1'} divide-x divide-gray-100 relative`}>
                        {days.map((dayName, colIndex) => {
                            const dayEvents = events.filter(e => e.day.toUpperCase() === dayName);

                            return (
                                <div key={colIndex} className="relative bg-white">
                                    {/* Grid Lines */}
                                    <div className="absolute inset-0 grid" style={{ gridTemplateRows: `repeat(${TOTAL_SLOTS}, minmax(2.25rem, 1fr))` }}>
                                        {Array.from({ length: TOTAL_SLOTS }).map((_, idx) => (
                                            <div key={idx} className="border-b border-gray-50/50 box-border"></div>
                                        ))}
                                    </div>

                                    {/* Render Events */}
                                    {dayEvents.map((evt, idx) => {
                                        const [startTime] = evt.time.split(' - ');
                                        const startRow = getGridRow(startTime);
                                        const span = getDurationSlots(evt.time);

                                        const topPercent = ((startRow - 1) / TOTAL_SLOTS) * 100;
                                        const heightPercent = (span / TOTAL_SLOTS) * 100;

                                        return (
                                            <div
                                                key={idx}
                                                className="absolute w-[95%] left-[2.5%] z-10 transition-all hover:z-20 p-0.5 cursor-pointer"
                                                style={{
                                                    top: `${topPercent}%`,
                                                    height: `${heightPercent}%`,
                                                }}
                                                onClick={() => onEventClick(evt)}
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
