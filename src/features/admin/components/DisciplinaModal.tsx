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
    const [cuota, setCuota] = useState<string>('0');

    useEffect(() => {
        if (initialData) {
            setNombre(initialData.nombre_disciplina);
            setDescripcion(initialData.descripcion);
            setImagen(initialData.img_banner || '');
            setCuota(initialData.cuota?.toString() || '0');
        } else {
            setNombre('');
            setDescripcion('');
            setImagen('');
            setCuota('0');
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
            descripcion: descripcion,
            img_banner: imagen,
            img_preview: imagen,
            cuota: parseFloat(cuota) || 0
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
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                            placeholder="Ej: Kickboxing"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Cuota Mensual ($)
                        </label>
                        <input
                            type="number"
                            value={cuota}
                            onChange={(e) => setCuota(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                            placeholder="0"
                            min="0"
                            step="0.01"
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
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all resize-none h-24"
                            placeholder="Breve descripción de la disciplina..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            URL de la Imagen
                        </label>
                        <input
                            type="url"
                            value={imagen}
                            onChange={(e) => setImagen(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all mb-2"
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                    </div>

                    {/* Image Preview */}
                    {imagen && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden group border border-gray-200">
                            <img
                                src={imagen}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Error+Carga';
                                }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => setImagen('')}
                                    className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors transform hover:scale-110"
                                    title="Limpiar imagen"
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
