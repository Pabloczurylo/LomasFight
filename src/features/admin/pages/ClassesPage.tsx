import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { CalendarGrid } from "../components/CalendarGrid";
import { addDays, formatDate, getStartOfWeek } from "../../../lib/dateUtils";

// Mock data adapted for the grid
const MOCK_SCHEDULE = [
    {
        id: 1,
        day: "LUNES",
        time: "18:00 - 19:30",
        discipline: "KICKBOXING",
        variant: "kickboxing",
        instructor: "Prof. Sanchez"
    },
    {
        id: 2,
        day: "LUNES",
        time: "20:00 - 21:00",
        discipline: "BOXEO",
        variant: "boxeo",
    },
    {
        id: 3,
        day: "MARTES",
        time: "09:00 - 10:30",
        discipline: "MUAY THAI",
        variant: "muaythai",
    },
    {
        id: 4,
        day: "MIÉRCOLES",
        time: "19:00 - 20:30",
        discipline: "KICKBOXING",
        variant: "kickboxing",
    },
    {
        id: 5,
        day: "JUEVES",
        time: "17:00 - 18:30",
        discipline: "BOXEO",
        variant: "boxeo",
    },
    {
        id: 6,
        day: "JUEVES",
        time: "09:00 - 10:30",
        discipline: "MUAY THAI",
        variant: "muaythai",
    },
    {
        id: 7,
        day: "SÁBADO",
        time: "09:00 - 11:30",
        discipline: "SEMINARIO MUAY THAI",
        variant: "muaythai",
    },
    {
        id: 8,
        day: "VIERNES",
        time: "18:00 - 19:30",
        discipline: "KICKBOXING",
        variant: "kickboxing"
    },
    {
        id: 9,
        day: "VIERNES",
        time: "20:00 - 21:00",
        discipline: "BOXEO",
        variant: "boxeo"
    }
] as const;

export default function ClassesPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'week' | 'day'>('week');

    const handlePrev = () => {
        setCurrentDate(prev => addDays(prev, view === 'week' ? -7 : -1));
    };

    const handleNext = () => {
        setCurrentDate(prev => addDays(prev, view === 'week' ? 7 : 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    // Date Range String for Header
    const weekStart = getStartOfWeek(currentDate);
    // Show 6 days (Mon-Sat)
    const weekEnd = addDays(weekStart, 5);

    // Format: "15 - 20 de Mayo, 2024"
    const getRangeString = () => {
        if (view === 'day') return formatDate(currentDate);

        const startDay = weekStart.getDate();
        const endDay = weekEnd.getDate();
        const month = weekStart.toLocaleDateString('es-ES', { month: 'long' });
        const year = weekStart.getFullYear();
        // Capitalize month
        const monthCap = month.charAt(0).toUpperCase() + month.slice(1);

        return `${startDay} - ${endDay} de ${monthCap}, ${year}`;
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Page Header Area */}
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-heading font-black uppercase tracking-wide text-gray-900">CRONOGRAMA DE CLASES</h1>
                        <p className="text-gray-500 text-sm mt-0.5 font-medium">Visualización semanal de actividades y turnos.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* View Toggle */}
                        <div className="bg-gray-100 p-1 rounded-lg flex text-[10px] font-bold shadow-inner">
                            <button
                                onClick={() => setView('week')}
                                className={`px-3 py-1.5 rounded-md transition-all uppercase tracking-wide ${view === 'week' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Semana
                            </button>
                            <button
                                onClick={() => setView('day')}
                                className={`px-3 py-1.5 rounded-md transition-all uppercase tracking-wide ${view === 'day' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Día
                            </button>
                        </div>

                        <Button size="sm" className="bg-brand-red hover:bg-red-700 text-white shadow-lg shadow-red-500/30 uppercase tracking-wider font-bold transition-all hover:translate-y-[-1px] text-xs h-8">
                            <Plus className="w-4 h-4 mr-1.5" />
                            Añadir Horario
                        </Button>
                    </div>
                </div>

                {/* Navigation Bar */}
                <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
                        <button onClick={handlePrev} className="p-1.5 hover:bg-gray-50 rounded-full text-gray-500 hover:text-gray-900 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-lg font-heading font-bold text-gray-900 min-w-[180px] text-center">
                            {getRangeString()}
                        </span>
                        <button onClick={handleNext} className="p-1.5 hover:bg-gray-50 rounded-full text-gray-500 hover:text-gray-900 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>

                        <button
                            onClick={handleToday}
                            className="hidden md:block ml-2 px-3 py-1 text-[10px] font-bold text-brand-red border border-red-100 bg-red-50 rounded-full hover:bg-red-100 transition-colors uppercase tracking-wide"
                        >
                            Hoy
                        </button>
                    </div>

                    {/* Legend / Filters */}
                    <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 text-[10px] font-medium uppercase tracking-wide text-gray-600">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-50 border border-red-100"></span>
                            <span>Kickboxing</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-gray-900"></span>
                            <span>Boxeo</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-brand-red"></span>
                            <span>Muay Thai</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 min-h-0 bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col">
                <CalendarGrid
                    currentDate={currentDate}
                    view={view}
                    events={MOCK_SCHEDULE as any}
                />
            </div>
        </div>
    );
}
