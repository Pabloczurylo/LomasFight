import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { CalendarGrid } from "../components/CalendarGrid";
import AddClassModal from "../components/AddClassModal";

import { MOCK_SCHEDULE } from "../data/mockData";

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
    const [editingClass, setEditingClass] = useState<any | null>(null);

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

        if (editingClass) {
            // Remove the *single* instance being edited from the schedule array
            // Optimization: If the user changes days, this logic here might trigger "Add new events" only
            // But if we want to "Edit this class", usually means this specific slot.
            // However, the modal returns "Days: [Mon, Wed]".
            // If I edit Monday class, and select Mon, Wed. It should update Mon, and add Wed.
            // AND remove the 'old' Monday class.

            // Simplest approach: Remove the OLD event ID. Add ALL new events.
            setSchedule(prev => {
                const filtered = prev.filter(e => e.id !== editingClass.id);
                return [...filtered, ...newEvents];
            });
            setEditingClass(null);
        } else {
            setSchedule(prev => [...prev, ...newEvents]);
        }
    };

    const handleEventClick = (classItem: any) => {
        // Prepare initial data for modal
        // We need: discipline, instructor, days (array), startTime, endTime
        const [start, end] = classItem.time.split(' - ');

        // Reverse map discipline to value (or just use string if compatible)
        // "MUAY THAI" -> "MUAY_THAI" for select value match if needed
        let discValue = classItem.discipline;
        if (discValue === 'MUAY THAI') discValue = 'MUAY_THAI';
        if (discValue === 'JIU JITSU') discValue = 'JIU_JITSU'; // Assuming Jiu Jitsu mock data usage

        const initialData = {
            id: classItem.id, // Keep track of ID for deletion/update logic
            discipline: discValue,
            instructor: classItem.instructor,
            days: [classItem.day], // Pre-select ONLY the current day
            startTime: start,
            endTime: end
        };

        setEditingClass(initialData);
        setIsAddModalOpen(true);
    };

    const handleDeleteClass = () => {
        if (!editingClass) return;
        setSchedule(prev => prev.filter(e => e.id !== editingClass.id));
        setEditingClass(null);
        setIsAddModalOpen(false);
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setEditingClass(null);
    }

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
                            onClick={() => {
                                setEditingClass(null);
                                setIsAddModalOpen(true);
                            }}
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
                    onEventClick={handleEventClick}
                />
            </div>

            <AddClassModal
                isOpen={isAddModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveClass}
                initialData={editingClass}
                onDelete={editingClass ? handleDeleteClass : undefined}
            />
        </div>
    );
}
