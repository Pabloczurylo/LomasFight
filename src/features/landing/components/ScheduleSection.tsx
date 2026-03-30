import { useState, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { api } from "../../../services/api";

interface ScheduleItem {
    time: string;
    class: string;
    coach?: string;
}

interface ScheduleDay {
    day: string;
    classes: ScheduleItem[];
}

interface ScheduleSectionProps {
    id?: string;
    title?: string;
    subtitle?: string;
    disciplineId?: number; // Optional prop to filter classes
}

interface Disciplina { id_disciplina: number; nombre_disciplina: string; }
interface Profesor { nombre: string; apellido: string; }
interface HorarioBackend {
    id_horario: number;
    dia_y_hora: string;
    disciplinas: Disciplina;
    profesores: Profesor;
}

const WEEK_DAYS = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'] as const;
// JS getDay(): Sun=0, Mon=1 ... Sat=6
// Our WEEK_DAYS index:  Mon=0, Tue=1 ... Sat=5
const JS_DAY_TO_INDEX: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 };

export function ScheduleSection({
    id,
    title = "DISPONIBILIDAD",
    subtitle = "HORARIOS DE CLASES",
    disciplineId
}: ScheduleSectionProps) {
    const [scheduleData, setScheduleData] = useState<ScheduleDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                setLoading(true);
                const { data } = await api.get<HorarioBackend[]>('/horarios');

                // Build per-day buckets
                const buckets: Record<string, ScheduleItem[]> = {
                    'LUNES': [], 'MARTES': [], 'MIÉRCOLES': [],
                    'JUEVES': [], 'VIERNES': [], 'SÁBADO': []
                };

                const filteredData = disciplineId
                    ? data.filter(h => h.disciplinas.id_disciplina === disciplineId)
                    : data;

                filteredData.forEach((h) => {
                    const date = new Date(h.dia_y_hora);
                    const localDay = date.getDay();                          // 0=Sun … 6=Sat
                    const dayIdx = JS_DAY_TO_INDEX[localDay];
                    if (dayIdx === undefined) return;                         // ignore Sundays

                    const dayName = WEEK_DAYS[dayIdx];
                    const hh = String(date.getHours()).padStart(2, '0');
                    const mm = String(date.getMinutes()).padStart(2, '0');

                    buckets[dayName].push({
                        time: `${hh}:${mm}`,
                        class: h.disciplinas.nombre_disciplina,
                        coach: `${h.profesores.nombre} ${h.profesores.apellido}`
                    });
                });

                // Sort each day's classes by time and build the final array
                const formatted: ScheduleDay[] = WEEK_DAYS.map(day => ({
                    day,
                    classes: [...buckets[day]].sort((a, b) => {
                        const [ah, am] = a.time.split(':').map(Number);
                        const [bh, bm] = b.time.split(':').map(Number);
                        return ah * 60 + am - (bh * 60 + bm);
                    })
                }));

                setScheduleData(formatted);
                setError(false);
            } catch (err) {
                console.error("Error fetching schedule:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [disciplineId]);

    // Collect all unique time slots sorted chronologically
    const timeSlots = useMemo(() => {
        const set = new Set<string>();
        scheduleData.forEach(day => day.classes.forEach(c => set.add(c.time)));
        return [...set].sort((a, b) => {
            const [ah, am] = a.split(':').map(Number);
            const [bh, bm] = b.split(':').map(Number);
            return ah * 60 + am - (bh * 60 + bm);
        });
    }, [scheduleData]);

    // Build a lookup map: day -> time -> ScheduleItem
    const lookup = useMemo(() => {
        const map: Record<string, Record<string, ScheduleItem>> = {};
        scheduleData.forEach(day => {
            map[day.day] = {};
            day.classes.forEach(c => {
                map[day.day][c.time] = c;
            });
        });
        return map;
    }, [scheduleData]);

    // Format a time slot as a range: "17:00 a 18:00"
    const formatTimeRange = (time: string) => {
        const [hh, mm] = time.split(':').map(Number);
        const endHh = (hh + 1) % 24;
        return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')} a ${String(endHh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    };

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
                    ) : scheduleData.every(d => d.classes.length === 0) ? (
                        <div className="text-center py-20">
                            <p className="text-gray-400 font-heading font-bold uppercase tracking-widest">No hay horarios cargados todavía.</p>
                        </div>
                    ) : (
                        <div className="min-w-[700px] overflow-hidden rounded-lg shadow-lg border border-gray-100">
                            {/* Header Row: "HORARIOS" label + time range columns */}
                            <div
                                className="bg-black text-white font-heading font-bold text-sm md:text-base uppercase tracking-wider text-center"
                                style={{ display: 'grid', gridTemplateColumns: `140px repeat(${timeSlots.length}, 1fr)` }}
                            >
                                <div className="py-4 flex items-center justify-center border-r border-gray-700">HORARIOS</div>
                                {timeSlots.map(slot => (
                                    <div key={slot} className="py-4 flex items-center justify-center">{formatTimeRange(slot)}</div>
                                ))}
                            </div>

                            {/* Body — one row per day */}
                            {WEEK_DAYS.map(day => {
                                const dayData = lookup[day] || {};
                                return (
                                    <div
                                        key={day}
                                        className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                                        style={{ display: 'grid', gridTemplateColumns: `140px repeat(${timeSlots.length}, 1fr)` }}
                                    >
                                        {/* Day name */}
                                        <div className="py-4 px-3 flex items-center justify-center bg-gray-50 font-heading font-bold text-sm uppercase tracking-wider text-brand-black border-r border-gray-100">
                                            {day}
                                        </div>

                                        {/* Time slot cells */}
                                        {timeSlots.map(slot => {
                                            const item = dayData[slot];
                                            return (
                                                <div
                                                    key={slot}
                                                    className="p-3 min-h-[80px] flex flex-col justify-center items-center text-center border-r border-gray-100 last:border-r-0"
                                                >
                                                    {item ? (
                                                        <>
                                                            <span className="text-xs text-black font-bold uppercase">{item.class}</span>
                                                            {item.coach && (
                                                                <span className="text-xs text-gray-500 mt-1">Profe: {item.coach}</span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-300 font-heading font-bold text-lg">—</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
