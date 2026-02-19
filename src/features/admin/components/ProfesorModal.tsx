import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Profesor, Disciplina } from '../types';

interface ProfesorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (profesor: Profesor) => void;
    disciplinas: Disciplina[];
    initialData?: Profesor | null;
}

export default function ProfesorModal({ isOpen, onClose, onSave, disciplinas, initialData }: ProfesorModalProps) {
    const [nombre, setNombre] = useState('');
    const [especialidad, setEspecialidad] = useState('');
    const [imagen, setImagen] = useState('');

    useEffect(() => {
        if (initialData) {
            setNombre(initialData.nombre);
            setEspecialidad(initialData.especialidad);
            setImagen(initialData.imagen);
        } else {
            setEspecialidad('');
            setImagen('');
        }

        return () => {
            // Cleanup if needed when modal closes or data changes
        };
    }, [initialData, isOpen]);

    // Handle image URL cleanup
    useEffect(() => {
        return () => {
            if (imagen.startsWith('blob:')) {
                URL.revokeObjectURL(imagen);
            }
        };
    }, [imagen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: initialData?.id || Date.now().toString(),
            nombre,
            especialidad,
            imagen
        });
        onClose();
    };

    if (disciplinas.length === 0) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 text-center animate-in zoom-in duration-200">
                    <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-6 h-6 text-brand-red" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">
                        No hay disciplinas
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Debes crear al menos una disciplina antes de poder registrar un profesor.
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 animate-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-heading font-bold text-gray-900 mb-6">
                    {initialData ? 'Editar Profesor' : 'Nuevo Profesor'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Nombre Completo
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                            placeholder="Ej: Juan Pérez"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Especialidad / Disciplina
                        </label>
                        <select
                            value={especialidad}
                            onChange={(e) => setEspecialidad(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all appearance-none bg-white"
                            required
                        >
                            <option value="" disabled>Seleccionar disciplina...</option>
                            {disciplinas.map((disciplina) => (
                                <option key={disciplina.id_disciplina} value={disciplina.nombre_disciplina}>
                                    {disciplina.nombre_disciplina}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Foto de Perfil
                        </label>

                        {!imagen ? (
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-3 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                        </svg>
                                        <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Subir foto</span></p>
                                        <p className="text-xs text-gray-400">PNG, JPG (Rectangular recomendado)</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const url = URL.createObjectURL(file);
                                                setImagen(url);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        ) : (
                            <div className="w-full h-48 rounded-lg overflow-hidden group border-2 border-gray-100 shadow-sm relative">
                                <img
                                    src={imagen}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => setImagen('')}
                                        className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors transform hover:scale-110"
                                        title="Eliminar foto"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md"
                        >
                            {initialData ? 'Guardar Cambios' : 'Guardar Profesor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
