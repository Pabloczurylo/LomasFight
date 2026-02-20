import { useState, useEffect, useCallback } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { CalendarGrid, CalendarEvent } from "../components/CalendarGrid";
import AddClassModal from "../components/AddClassModal";
import { api } from "../../../services/api";

// --- INTERFACES DE TIPADO ---
interface Disciplina {
    id_disciplina: number;
    nombre_disciplina: string;
}

interface Profesor {
    id_profesor: number;
    nombre: string;
}

interface HorarioBackend {
    id_horario: number;
    dia_y_hora: string; // ISO string de Prisma
    id_disciplina: number;
    id_profesor: number;
    activo: boolean;
    disciplinas: Disciplina;
    profesores: Profesor;
}



const WEEK_DAYS = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'] as const;
type DayName = typeof WEEK_DAYS[number];

export default function ClassesPage() {
    // Estados
    const [schedule, setSchedule] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [view, setView] = useState<'week' | 'day'>('week');
    const [currentDayIndex, setCurrentDayIndex] = useState<number>(1); // 1 = LUNES
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [editingClass, setEditingClass] = useState<any | null>(null);

    // --- 1. CARGAR DATOS (GET) ---
    const fetchHorarios = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get<HorarioBackend[]>('/horarios');

            const mappedEvents: CalendarEvent[] = data.map((h: HorarioBackend) => {
                const date = new Date(h.dia_y_hora);
                const dayName = WEEK_DAYS[date.getDay()];
                const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                // Construct a time range string as expected by CalendarGrid (e.g., "10:00 - 11:00")
                // Since backend doesn't provide end time, we default to 1 hour duration
                const [hours, minutes] = timeStr.split(':').map(Number);
                const endDate = new Date(date);
                endDate.setHours(hours + 1, minutes);
                const endTimeStr = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                const timeRange = `${timeStr} - ${endTimeStr}`;

                // Lógica de variantes visuales basada en el nombre de la disciplina
                const variantMap: Record<string, CalendarEvent['variant']> = {
                    'KICKBOXING': 'kickboxing',
                    'BOXEO': 'boxeo',
                    'MUAY THAI': 'muaythai',
                    'JIU JITSU': 'jiujitsu',
                    'MMA': 'mma'
                };

                return {
                    id: h.id_horario,
                    day: dayName,
                    time: timeRange,
                    discipline: h.disciplinas.nombre_disciplina,
                    instructor: h.profesores.nombre,
                    variant: variantMap[h.disciplinas.nombre_disciplina.toUpperCase()] || 'default'
                };
            });

            setSchedule(mappedEvents);
        } catch (error) {
            console.error("Error cargando horarios:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHorarios();
    }, [fetchHorarios]);

    // --- 2. AYUDANTE PARA FECHAS ---
    const combineDayAndTime = (dayName: string, timeStr: string): Date => {
        const now = new Date();
        const targetDayIndex = WEEK_DAYS.indexOf(dayName as DayName);
        const currentDayIndex = now.getDay();

        let diff = targetDayIndex - currentDayIndex;
        // Ajuste para que siempre sea en la semana actual/próxima
        const resultDate = new Date(now);
        resultDate.setDate(now.getDate() + diff);

        const [hours, minutes] = timeStr.split(':').map(Number);
        resultDate.setHours(hours, minutes, 0, 0);

        return resultDate;
    };

    // --- 3. GUARDAR / EDITAR (POST / PUT) ---
    const handleSaveClass = async (data: any) => {
        try {
            // El modal devuelve un array de días. Iteramos para crear registros individuales.
            const promises = data.days.map((day: string) => {
                const payload = {
                    dia_y_hora: combineDayAndTime(day, data.startTime),
                    id_disciplina: Number(data.discipline),
                    id_profesor: Number(data.instructor)
                };

                return editingClass?.id
                    ? api.put(`/horarios/${editingClass.id}`, payload)
                    : api.post('/horarios', payload);
            });

            await Promise.all(promises);
            await fetchHorarios();
            handleCloseModal();
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Hubo un problema al guardar el horario.");
        }
    };

    // --- 4. ELIMINAR (DELETE) ---
    const handleDeleteClass = async () => {
        if (!editingClass?.id || !window.confirm("¿Estás seguro de eliminar este horario?")) return;

        try {
            await api.delete(`/horarios/${editingClass.id}`);
            await fetchHorarios();
            handleCloseModal();
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    // --- MANEJO DE UI ---
    const handleEventClick = (classItem: CalendarEvent) => {
        setEditingClass({
            id: classItem.id,
            discipline: classItem.discipline, // Aquí podrías mapear a ID si el modal lo requiere
            instructor: classItem.instructor,
            days: [classItem.day],
            startTime: classItem.time,
        });
        setIsAddModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setEditingClass(null);
    };

    const handlePrevDay = () => setCurrentDayIndex(prev => (prev > 0 ? prev - 1 : prev));
    const handleNextDay = () => setCurrentDayIndex(prev => (prev < 6 ? prev + 1 : prev));

    if (loading) {
        return (
            <div className="flex flex-col h-full items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-brand-red" />
                <p className="text-gray-500 font-medium animate-pulse">Sincronizando cronograma...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-heading font-black uppercase tracking-wide text-gray-900">CRONOGRAMA DE CLASES</h1>
                        <p className="text-gray-500 text-sm mt-0.5 font-medium">Gestión en tiempo real de horarios y disciplinas.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-1 rounded-lg flex text-[10px] font-bold shadow-inner h-8 items-center">
                            <button onClick={() => setView('week')} className={`px-3 py-1.5 rounded-md transition-all uppercase ${view === 'week' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Semana</button>
                            <button onClick={() => setView('day')} className={`px-3 py-1.5 rounded-md transition-all uppercase ${view === 'day' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Día</button>
                        </div>

                        <Button size="sm" onClick={() => { setEditingClass(null); setIsAddModalOpen(true); }} className="bg-brand-red hover:bg-red-700 text-white shadow-lg shadow-red-500/30 uppercase tracking-wider font-bold text-xs h-8">
                            <Plus className="w-4 h-4 mr-1.5" /> Añadir Horario
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
                <CalendarGrid
                    view={view}
                    events={schedule}
                    onEventClick={handleEventClick}
                    activeDay={WEEK_DAYS[currentDayIndex]}
                    onPrevDay={handlePrevDay}
                    onNextDay={handleNextDay}
                    isFirstDay={currentDayIndex === 0}
                    isLastDay={currentDayIndex === 6}
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