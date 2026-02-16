import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Disciplina } from '../types';

interface DisciplinaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (disciplina: Disciplina) => void;
    initialData?: Disciplina | null;
}

export default function DisciplinaModal({ isOpen, onClose, onSave, initialData }: DisciplinaModalProps) {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen] = useState('');

    useEffect(() => {
        if (initialData) {
            setNombre(initialData.nombre_disciplina);
            setDescripcion(initialData.descripcion_disciplina);
            setImagen(initialData.imagen_disciplina || '');
        } else {
            setNombre('');
            setDescripcion('');
            setImagen('');
        }
    }, [initialData, isOpen]);

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
            id_disciplina: initialData?.id_disciplina || 0, // 0 indicates new
            nombre_disciplina: nombre,
            descripcion_disciplina: descripcion,
            imagen_disciplina: imagen
        });
        onClose();
    };

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
                    {initialData ? 'Editar Disciplina' : 'Nueva Disciplina'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                            placeholder="Ej: Kickboxing"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all resize-none h-24"
                            placeholder="Breve descripción de la disciplina..."
                            required
                        />
                    </div>

                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Imagen
                    </label>

                    {/* File Input */}
                    {!imagen ? (
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click para subir</span></p>
                                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
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
                        <div className="relative w-full h-48 rounded-lg overflow-hidden group border border-gray-200">
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
                                    title="Eliminar imagen"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

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
                            {initialData ? 'Guardar Cambios' : 'Crear Disciplina'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
