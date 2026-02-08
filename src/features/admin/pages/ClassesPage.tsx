import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { CalendarGrid } from "../components/CalendarGrid";
import AddClassModal from "../components/AddClassModal";

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
    const [schedule, setSchedule] = useState<any[]>(() => {
        const saved = localStorage.getItem('class_schedule');
        return saved ? JSON.parse(saved) : (MOCK_SCHEDULE as unknown as any[]);
    });

    // Save to localStorage whenever schedule changes
    useEffect(() => {
        localStorage.setItem('class_schedule', JSON.stringify(schedule));
    }, [schedule]);
    const [view, setView] = useState<'week' | 'day'>('week');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleSaveClass = (data: any) => {
        // Transform modal data to calendar events
        // data = { discipline, instructor, days: [], startTime, endTime, capacity }

        const newEvents = data.days.map((day: string, index: number) => {
            const variantMap: Record<string, string> = {
                'KICKBOXING': 'kickboxing',
                'BOXEO': 'boxeo',
                'MUAY_THAI': 'muaythai',
                'JIU_JITSU': 'jiujitsu',
                'MMA': 'mma'
            };

            return {
                id: Date.now() + index, // Simple ID generation
                day: day,
                time: `${data.startTime} - ${data.endTime}`,
                discipline: data.discipline.replace('_', ' '), // "MUAY_THAI" -> "MUAY THAI"
                instructor: data.instructor,
                variant: variantMap[data.discipline] || 'default'
            };
        });

        setSchedule(prev => [...prev, ...newEvents]);
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

                        <Button
                            size="sm"
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-brand-red hover:bg-red-700 text-white shadow-lg shadow-red-500/30 uppercase tracking-wider font-bold transition-all hover:translate-y-[-1px] text-xs h-8"
                        >
                            <Plus className="w-4 h-4 mr-1.5" />
                            Añadir Horario
                        </Button>
                    </div>
                </div>

                {/* Legend / Filters - Moved up since Nav bar is gone */}
                <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-heading font-bold text-gray-900 uppercase tracking-wide pl-2">
                        Horarios Semanales
                    </span>

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
                    view={view}
                    events={schedule}
                />
            </div>

            <AddClassModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSaveClass}
            />
        </div>
    );
}
