import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { api } from "../../../services/api";

interface ScheduleItem {
    time: string;
    class: string;
    coach?: string;
}

interface ScheduleDay {
    day: string; // LUNES, MARTES, etc.
    classes: (ScheduleItem | null)[]; // null for empty slot
}

interface ScheduleSectionProps {
    id?: string;
    title?: string;
    subtitle?: string;
}

// Interfaces based on backend structure
interface Disciplina {
    nombre_disciplina: string;
}

interface Profesor {
    nombre: string;
}

interface HorarioBackend {
    id_horario: number;
    dia_y_hora: string;
    disciplinas: Disciplina;
    profesores: Profesor;
}

const WEEK_DAYS = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'] as const;

export function ScheduleSection({
    id,
    title = "DISPONIBILIDAD",
    subtitle = "HORARIOS DE CLASES"
}: ScheduleSectionProps) {
    const [scheduleData, setScheduleData] = useState<ScheduleDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                setLoading(true);
                const { data } = await api.get<HorarioBackend[]>('/horarios');

                // Initialize empty schedule mapped to our constant days
                const newSchedule: Record<string, ScheduleItem[]> = {
                    'LUNES': [], 'MARTES': [], 'MIÉRCOLES': [], 'JUEVES': [], 'VIERNES': [], 'SÁBADO': []
                };

                // Populate with backend data
                data.forEach((h) => {
                    const date = new Date(h.dia_y_hora);
                    // getDay() gives 0 for Sunday, 1 for Monday. Our WEEK_DAYS index starts Monday at 0.
                    const dayIndex = date.getDay();
                    if (dayIndex === 0) return; // Ignore Sundays if they exist
                    
                    const dayName = WEEK_DAYS[dayIndex - 1]; // Map to string
                    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                    
                    if (dayName && newSchedule[dayName]) {
                        newSchedule[dayName].push({
                            time: timeStr,
                            class: h.disciplinas.nombre_disciplina,
                            coach: h.profesores.nombre
                        });
                    }
                });

                // Format structure into the visual array and sort times, max 3 slots to maintain visual design
                const formattedSchedule: ScheduleDay[] = WEEK_DAYS.map(day => {
                    // Sort items by time
                    const sortedClasses = [...newSchedule[day]].sort((a, b) => {
                        const [ah, am] = a.time.split(':').map(Number);
                        const [bh, bm] = b.time.split(':').map(Number);
                        return ah * 60 + am - (bh * 60 + bm);
                    });

                    // Pad with nulls to guarantee exactly 3 elements for the grid design
                    const paddedClasses = [sortedClasses[0] || null, sortedClasses[1] || null, sortedClasses[2] || null];

                    return { day, classes: paddedClasses };
                });

                setScheduleData(formattedSchedule);
                setError(false);
            } catch (err) {
                console.error("Error fetching schedule for landing page:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    return (
        <section id={id} className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-brand-red font-heading font-bold tracking-widest text-lg mb-2">{title}</h2>
                    <h3 className="text-3xl md:text-5xl font-heading font-bold text-brand-black uppercase">{subtitle}</h3>
                </div>

                <div className="max-w-6xl mx-auto overflow-x-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 animate-spin text-brand-red mb-4" />
                            <p className="font-heading font-bold text-gray-500 uppercase tracking-widest">Cargando Horarios...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <p className="text-brand-red font-bold">Error al cargar los horarios. Por favor, intenta de nuevo más tarde.</p>
                        </div>
                    ) : (
                        <div className="min-w-[800px] overflow-hidden rounded-lg shadow-lg border border-gray-100">
                            {/* Header Row */}
                            <div className="grid grid-cols-6 bg-black text-white py-4 font-heading font-bold text-sm md:text-base uppercase tracking-wider text-center">
                                {scheduleData.map((day, idx) => (
                                    <div key={idx}>{day.day}</div>
                                ))}
                            </div>

                            <div className="bg-white divide-x divide-gray-100 grid grid-cols-6">
                                {scheduleData.map((day, colIdx) => (
                                    <div key={colIdx} className="divide-y divide-gray-100">
                                        {[0, 1, 2].map((rowIdx) => {
                                            const item = day.classes[rowIdx];
                                            return (
                                                <div key={rowIdx} className="p-4 h-32 flex flex-col justify-center items-center text-center hover:bg-gray-50 transition-colors">
                                                    {item ? (
                                                        <>
                                                            <span className="text-brand-red font-heading font-bold text-xl">{item.time}</span>
                                                            <span className="text-xs text-black font-bold uppercase mt-1">{item.class}</span>
                                                            {item.coach && <span className="text-xs text-gray-500 mt-1">Coach: {item.coach}</span>}
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-300 font-heading font-bold text-xl">--</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
