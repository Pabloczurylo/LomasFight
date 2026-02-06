import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Alumno } from '../types';

interface StudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (student: Omit<Alumno, 'id' | 'fechaRegistro'>) => void;
    initialData?: Alumno;
}

export default function StudentModal({ isOpen, onClose, onSave, initialData }: StudentModalProps) {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [disciplina, setDisciplina] = useState<Alumno['disciplina']>('Kickboxing');
    const [estadoPago, setEstadoPago] = useState<Alumno['estadoPago']>('pendiente');

    // Estados de error
    const [errors, setErrors] = useState({
        nombre: '',
        apellido: '',
    });

    // Sync state with initialData when it changes or modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setNombre(initialData.nombre);
                setApellido(initialData.apellido);
                setDisciplina(initialData.disciplina);
                setEstadoPago(initialData.estadoPago);
            } else {
                // Reset for add mode
                setNombre('');
                setApellido('');
                setDisciplina('Kickboxing');
                setEstadoPago('pendiente');
            }
            setErrors({ nombre: '', apellido: '' });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const validate = () => {
        let valid = true;
        const newErrors = { nombre: '', apellido: '' };

        if (!nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio.';
            valid = false;
        }

        if (!apellido.trim()) {
            newErrors.apellido = 'El apellido es obligatorio.';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validate()) {
            onSave({
                nombre,
                apellido,
                disciplina,
                estadoPago,
            });
            onClose();
        }
    };

    const isEditing = !!initialData;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-xl font-heading font-bold text-gray-900">
                        {isEditing ? 'Editar Alumno' : 'Nuevo Alumno'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Cerrar modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Nombre */}
                    <div className="space-y-1.5">
                        <label htmlFor="nombre" className="text-sm font-bold text-gray-700">
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="nombre"
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Juan"
                            className={cn(
                                "w-full px-4 py-2.5 rounded-lg border bg-white focus:ring-2 focus:ring-opacity-20 transition-all outline-none text-gray-900 placeholder:text-gray-500",
                                errors.nombre
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:border-brand-red focus:ring-brand-red"
                            )}
                        />
                        {errors.nombre && (
                            <p className="text-xs font-medium text-red-500 animate-in slide-in-from-top-1">
                                {errors.nombre}
                            </p>
                        )}
                    </div>

                    {/* Apellido */}
                    <div className="space-y-1.5">
                        <label htmlFor="apellido" className="text-sm font-bold text-gray-700">
                            Apellido <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="apellido"
                            type="text"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            placeholder="Ej: Pérez"
                            className={cn(
                                "w-full px-4 py-2.5 rounded-lg border bg-white focus:ring-2 focus:ring-opacity-20 transition-all outline-none text-gray-900 placeholder:text-gray-500",
                                errors.apellido
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:border-brand-red focus:ring-brand-red"
                            )}
                        />
                        {errors.apellido && (
                            <p className="text-xs font-medium text-red-500 animate-in slide-in-from-top-1">
                                {errors.apellido}
                            </p>
                        )}
                    </div>

                    {/* Disciplina - Select */}
                    <div className="space-y-1.5">
                        <label htmlFor="disciplina" className="text-sm font-bold text-gray-700">
                            Disciplina <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="disciplina"
                                value={disciplina}
                                onChange={(e) => setDisciplina(e.target.value as Alumno['disciplina'])}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:border-brand-red focus:ring-2 focus:ring-brand-red focus:ring-opacity-20 transition-all outline-none appearance-none cursor-pointer text-gray-900"
                            >
                                <option value="Kickboxing">Kickboxing</option>
                                <option value="Boxeo">Boxeo</option>
                                <option value="Fuerza">Fuerza</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* Estado de Pago - Select */}
                    <div className="space-y-1.5">
                        <label htmlFor="estadoPago" className="text-sm font-bold text-gray-700">
                            Estado de Pago <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="estadoPago"
                                value={estadoPago}
                                onChange={(e) => setEstadoPago(e.target.value as Alumno['estadoPago'])}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:border-brand-red focus:ring-2 focus:ring-brand-red focus:ring-opacity-20 transition-all outline-none appearance-none cursor-pointer text-gray-900"
                            >
                                <option value="al día">Al día</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="vencido">Vencido</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-50 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/20 transition-all"
                        >
                            {isEditing ? 'Guardar Cambios' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
