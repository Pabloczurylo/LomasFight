import React, { useState, useEffect } from 'react';
import { X, Plus, Dumbbell, User, Clock, Trash2, Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { api } from '../../../services/api'; // Importamos tu instancia de axios

// --- INTERFACES ---
interface Disciplina {
    id_disciplina: number;
    nombre_disciplina: string; // Changed from nombre to match backend
}

interface Usuario {
    id_usuario: number;
    nombre_usuario: string;
    rol: string;
}

interface AddClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any | null;
    onDelete?: () => void;
}

const DAYS = [
    { label: 'LUN', value: 'LUNES' },
    { label: 'MAR', value: 'MARTES' },
    { label: 'MIÉ', value: 'MIÉRCOLES' },
    { label: 'JUE', value: 'JUEVES' },
    { label: 'VIE', value: 'VIERNES' },
    { label: 'SÁB', value: 'SÁBADO' },
];

export default function AddClassModal({ isOpen, onClose, onSave, initialData, onDelete }: AddClassModalProps) {
    // Estados para datos maestros
    const [disciplinesList, setDisciplinesList] = useState<Disciplina[]>([]);
    const [usuariosList, setUsuariosList] = useState<Usuario[]>([]);
    const [loadingData, setLoadingData] = useState(false);

    // Estados del formulario (usamos IDs para selects)
    const [disciplineId, setDisciplineId] = useState<string>('');
    const [instructorId, setInstructorId] = useState<string>('');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        type: 'success' as 'danger' | 'success',
        title: '',
        message: '',
        action: () => { }
    });

    // 1. Cargar Disciplinas y Usuarios al abrir el modal
    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                setLoadingData(true);
                // Asumiendo que estos son tus endpoints
                const [resDisc, resUsers] = await Promise.all([
                    api.get<Disciplina[]>('/diciplinas'), // Fixed typo in endpoint to match DisciplinasPage
                    api.get<Usuario[]>('/usuarios')
                ]);
                setDisciplinesList(resDisc.data);
                setUsuariosList(resUsers.data);
            } catch (error) {
                console.error("Error cargando datos maestros:", error);
            } finally {
                setLoadingData(false);
            }
        };

        if (isOpen) fetchMasterData();
    }, [isOpen]);

    // 2. Cargar datos iniciales para edición
    useEffect(() => {
        if (isOpen && initialData) {
            // Si el parent envía el objeto 'raw' de Prisma, usamos esos IDs
            setDisciplineId(initialData.raw?.id_disciplina?.toString() || '');
            setInstructorId(initialData.raw?.id_profesor?.toString() || ''); // Assuming id_profesor actually stores user ID now or needs mapping
            setSelectedDays(initialData.days || []);
            setStartTime(initialData.startTime || '');
            // Si no tienes endTime en el backend aún, puedes dejarlo opcional
            setEndTime(initialData.endTime || '');
        } else if (isOpen && !initialData) {
            setDisciplineId('');
            setInstructorId('');
            setSelectedDays([]);
            setStartTime('');
            setEndTime('');
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const toggleDay = (day: string) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        const saveData = {
            discipline: disciplineId, // Enviamos el ID
            instructor: instructorId, // Enviamos el ID
            days: selectedDays,
            startTime,
            endTime,
        };

        if (initialData) {
            setConfirmState({
                isOpen: true,
                type: 'success',
                title: '¿Guardar cambios?',
                message: 'Se actualizará la información de la clase.',
                action: () => {
                    onSave(saveData);
                }
            });
        } else {
            onSave(saveData);
        }
    };

    const isEditing = !!initialData;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="px-8 py-6 pb-2">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2 text-brand-red mb-1">
                                <div className="bg-red-100 p-1 rounded-full">
                                    <Plus className="w-5 h-5 text-brand-red stroke-[3]" />
                                </div>
                                <h2 className="text-xl font-heading font-black tracking-widest uppercase text-gray-900">
                                    {isEditing ? 'EDITAR CLASE' : 'AGREGAR NUEVA CLASE'}
                                </h2>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="px-8 pb-8 space-y-5">
                        {/* Selector de Disciplina Dinámico */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-800 tracking-wide">Disciplina</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    {loadingData ? <Loader2 className="w-5 h-5 animate-spin" /> : <Dumbbell className="w-5 h-5" />}
                                </div>
                                <select
                                    required
                                    value={disciplineId}
                                    onChange={(e) => setDisciplineId(e.target.value)}
                                    className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-200 bg-white focus:border-brand-red outline-none appearance-none font-medium text-gray-700"
                                >
                                    <option value="" disabled>Selecciona disciplina</option>
                                    {disciplinesList.map(d => (
                                        <option key={d.id_disciplina} value={d.id_disciplina}>{d.nombre_disciplina}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Selector de Instructor Dinámico (Usuarios) */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-800 tracking-wide">Instructor</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <select
                                    required
                                    value={instructorId}
                                    onChange={(e) => setInstructorId(e.target.value)}
                                    className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-200 bg-white focus:border-brand-red outline-none appearance-none font-medium text-gray-700"
                                >
                                    <option value="" disabled>Selecciona un instructor</option>
                                    {usuariosList.map(u => (
                                        <option key={u.id_usuario} value={u.id_usuario}>{u.nombre_usuario}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Días y Horas (Se mantiene igual, pero asegurando tipos) */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-800 tracking-wide">Día de la semana</label>
                            <div className="flex gap-2 justify-between">
                                {DAYS.map((day) => (
                                    <button
                                        key={day.value}
                                        type="button"
                                        onClick={() => toggleDay(day.value)}
                                        className={cn(
                                            "flex-1 py-2 rounded-xl text-[10px] font-black tracking-wider transition-all border",
                                            selectedDays.includes(day.value)
                                                ? "bg-brand-red text-white border-brand-red shadow-md shadow-red-500/30"
                                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                        )}
                                    >
                                        {day.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-800 tracking-wide">Hora de Inicio</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        required
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white outline-none font-medium text-gray-700"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-800 tracking-wide">Hora de Fin</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        required
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white outline-none font-medium text-gray-700"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex gap-4 pt-6">
                            {isEditing && onDelete && (
                                <button
                                    type="button"
                                    onClick={onDelete}
                                    className="px-4 py-3 border border-red-100/50 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 rounded-xl transition-all"
                                    title="Eliminar clase"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl uppercase text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loadingData || selectedDays.length === 0}
                                className="flex-1 px-4 py-3 bg-brand-red text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-all uppercase text-sm flex items-center justify-center gap-2"
                            >
                                {isEditing ? 'Guardar Cambios' : 'Guardar Clase'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                onConfirm={() => {
                    confirmState.action();
                    setConfirmState(prev => ({ ...prev, isOpen: false }));
                    onClose();
                }}
                title={confirmState.title}
                message={confirmState.message}
                type={confirmState.type}
            />
        </>
    );
}