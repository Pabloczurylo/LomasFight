import React, { useState } from 'react';
import { X, Plus, Dumbbell, User, Clock, Hourglass } from 'lucide-react'; // Icons based on mockup
import { cn } from '../../../lib/utils';

interface AddClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

const DAYS = [
    { label: 'LUN', value: 'LUNES' },
    { label: 'MAR', value: 'MARTES' },
    { label: 'MIÉ', value: 'MIÉRCOLES' },
    { label: 'JUE', value: 'JUEVES' },
    { label: 'VIE', value: 'VIERNES' },
    { label: 'SÁB', value: 'SÁBADO' },
];

export default function AddClassModal({ isOpen, onClose, onSave }: AddClassModalProps) {
    const [discipline, setDiscipline] = useState('');
    const [instructor, setInstructor] = useState('');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [capacity, setCapacity] = useState(20);

    if (!isOpen) return null;

    const toggleDay = (day: string) => {
        setSelectedDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            discipline,
            instructor,
            days: selectedDays,
            startTime,
            endTime,
            capacity
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Container */}
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="px-8 py-6 pb-2">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-brand-red mb-1">
                            <div className="bg-red-100 p-1 rounded-full">
                                <Plus className="w-5 h-5 text-brand-red stroke-[3]" />
                            </div>
                            <h2 className="text-xl font-heading font-black tracking-widest uppercase text-gray-900">
                                AGREGAR NUEVA CLASE
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <p className="text-gray-500 text-sm font-medium ml-9">
                        Ingresa los detalles para programar una nueva sesión de entrenamiento.
                    </p>
                </div>

                <form onSubmit={handleSave} className="px-8 pb-8 space-y-5">

                    {/* Disciplina */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-800 tracking-wide">Disciplina</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Dumbbell className="w-5 h-5" />
                            </div>
                            <select
                                value={discipline}
                                onChange={(e) => setDiscipline(e.target.value)}
                                className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-200 bg-white focus:border-brand-red focus:ring-4 focus:ring-red-500/10 outline-none appearance-none font-medium text-gray-700 transition-all cursor-pointer hover:border-gray-300"
                            >
                                <option value="" disabled>Selecciona disciplina</option>
                                <option value="KICKBOXING">Kickboxing</option>
                                <option value="BOXEO">Boxeo</option>
                                <option value="MUAY_THAI">Muay Thai</option>
                                <option value="JIU_JITSU">Jiu Jitsu</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* Instructor */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-800 tracking-wide">Instructor</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <User className="w-5 h-5" />
                            </div>
                            <select
                                value={instructor}
                                onChange={(e) => setInstructor(e.target.value)}
                                className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-200 bg-white focus:border-brand-red focus:ring-4 focus:ring-red-500/10 outline-none appearance-none font-medium text-gray-700 transition-all cursor-pointer hover:border-gray-300"
                            >
                                <option value="" disabled>Selecciona un instructor</option>
                                <option value="Prof. Sanchez">Prof. Sanchez</option>
                                <option value="Prof. Diaz">Prof. Diaz</option>
                                <option value="Prof. Gomez">Prof. Gomez</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* Días */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-800 tracking-wide">Día de la semana</label>
                        <div className="flex gap-2 justify-between">
                            {DAYS.map((day) => {
                                const isSelected = selectedDays.includes(day.value);
                                return (
                                    <button
                                        key={day.value}
                                        type="button"
                                        onClick={() => toggleDay(day.value)}
                                        className={cn(
                                            "flex-1 py-2 rounded-xl text-[10px] font-black tracking-wider transition-all border",
                                            isSelected
                                                ? "bg-brand-red text-white border-brand-red shadow-md shadow-red-500/30"
                                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        )}
                                    >
                                        {day.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Horarios */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-800 tracking-wide">Hora de Inicio</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-brand-red focus:ring-4 focus:ring-red-500/10 outline-none font-medium text-gray-700 transition-all hover:border-gray-300"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-800 tracking-wide">Hora de Fin</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Hourglass className="w-5 h-5" />
                                </div>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-brand-red focus:ring-4 focus:ring-red-500/10 outline-none font-medium text-gray-700 transition-all hover:border-gray-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cupo Máximo */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-800 tracking-wide">Cupo Máximo</label>
                        <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-white">
                            <button
                                type="button"
                                onClick={() => setCapacity(Math.max(1, capacity - 1))}
                                className="w-12 h-10 flex items-center justify-center text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                            </button>
                            <div className="flex-1 text-center font-black text-lg text-gray-900 border-x border-gray-100 h-6 flex items-center justify-center">
                                {capacity}
                            </div>
                            <button
                                type="button"
                                onClick={() => setCapacity(capacity + 1)}
                                className="w-12 h-10 flex items-center justify-center text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex gap-4 pt-6 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 font-bold tracking-wide rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all uppercase text-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-brand-red text-white font-bold tracking-wide rounded-xl hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/30 transition-all uppercase text-sm flex items-center justify-center gap-2 group"
                        >
                            <span className="bg-white/20 p-0.5 rounded-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            </span>
                            Guardar Clase
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
