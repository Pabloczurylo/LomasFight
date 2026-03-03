import React from 'react';

import { Input } from '../../../components/ui/Input';
import { X, Plus, User } from 'lucide-react'; // Added icons for styling

// --- INTERFACES DE TIPADO ---
interface Disciplina {
    id_disciplina: number;
    nombre_disciplina: string;
}

interface TeacherFormProps {
    isOpen: boolean; // Controla la visibilidad
    formData: {
        id: number;
        nombre: string;
        apellido: string;
        id_disciplina: string | number;
        presentacion: string;
        imagen: string;
    };
    disciplines: Disciplina[];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onSave: () => void;
    onCancel: () => void;
    isEditing: boolean;
}

export function TeacherForm({ isOpen, formData, disciplines, onChange, onSave, onCancel, isEditing }: TeacherFormProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-8 py-6 pb-2">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-brand-red mb-1">
                            <div className="bg-red-100 p-1.5 rounded-full">
                                {isEditing ? <User className="w-5 h-5 text-brand-red stroke-[3]" /> : <Plus className="w-5 h-5 text-brand-red stroke-[3]" />}
                            </div>
                            <h2 className="text-xl font-heading font-black tracking-widest uppercase text-gray-900">
                                {isEditing ? 'EDITAR INSTRUCTOR' : 'NUEVO PROFESOR'}
                            </h2>
                        </div>
                        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <p className="text-gray-500 text-sm mt-1 ml-10">
                        Completa los datos profesionales para habilitar al instructor en el sistema.
                    </p>
                </div>

                {/* Body/Formulario */}
                <div className="px-8 pb-8 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Campo Nombre */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Nombre</label>
                            <Input
                                name="nombre"
                                placeholder="Ej. Marco"
                                value={formData.nombre}
                                onChange={onChange}
                                required
                                className="h-12 rounded-xl border-gray-200"
                            />
                        </div>

                        {/* Campo Apellido */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Apellido</label>
                            <Input
                                name="apellido"
                                placeholder="Ej. 'El Toro' Torres"
                                value={formData.apellido}
                                onChange={onChange}
                                required
                                className="h-12 rounded-xl border-gray-200"
                            />
                        </div>

                        {/* Selector de Disciplina */}
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Disciplina Especializada</label>
                            <div className="relative">
                                <select
                                    name="id_disciplina"
                                    value={formData.id_disciplina}
                                    onChange={onChange}
                                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/50 focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all font-body text-gray-900 appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="" disabled>Selecciona una especialidad...</option>
                                    {disciplines.map((d) => (
                                        <option key={d.id_disciplina} value={d.id_disciplina}>
                                            {d.nombre_disciplina}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Campo Presentación */}
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Presentación / Bio</label>
                            <textarea
                                name="presentacion"
                                className="flex min-h-[120px] w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm ring-offset-white placeholder:text-gray-500 text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/50 focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all font-body resize-y"
                                placeholder="Describe brevemente la trayectoria, cinturones o especialidades técnicas..."
                                value={formData.presentacion}
                                onChange={onChange}
                            />
                        </div>

                        {/* Campo Imagen URL */}
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">URL de Foto de Perfil</label>
                            <Input
                                type="url"
                                name="imagen"
                                placeholder="https://ejemplo.com/foto-instructor.jpg"
                                value={formData.imagen}
                                onChange={onChange}
                                className="h-12 rounded-xl border-gray-200"
                            />
                        </div>

                        {/* Preview de Imagen */}
                        {formData.imagen && (
                            <div className="md:col-span-2 flex justify-center mt-2">
                                <div className="relative w-48 h-48 rounded-full overflow-hidden group border-4 border-gray-100 shadow-md">
                                    <img
                                        src={formData.imagen}
                                        alt="Vista previa"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Error+Carga';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => onChange({ target: { name: 'imagen', value: '' } } as React.ChangeEvent<HTMLInputElement>)}
                                            className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors transform hover:scale-110"
                                            title="Limpiar imagen"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer / Botones */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 md:flex-none px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl uppercase text-sm hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={onSave}
                            className="flex-1 md:flex-none px-6 py-3 bg-brand-red text-white font-bold rounded-xl hover:bg-red-700 transition-all uppercase text-sm shadow-md"
                        >
                            {isEditing ? 'Guardar Cambios' : 'Crear Profesor'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}