import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

// --- INTERFACES DE TIPADO ---
interface Disciplina {
    id_disciplina: number;
    nombre_disciplina: string;
}

interface TeacherFormProps {
    formData: {
        id: number;
        nombre: string;
        apellido: string;
        id_disciplina: string | number; // Cambiado para manejar el ID de la base de datos
        presentacion: string;
    };
    disciplines: Disciplina[]; // Nueva prop: lista de disciplinas traída desde el backend
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onSave: () => void;
    onCancel: () => void;
    isEditing: boolean;
}

export function TeacherForm({ formData, disciplines, onChange, onSave, onCancel, isEditing }: TeacherFormProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-gray-900">
                    {isEditing ? 'Editar Perfil del Instructor' : 'Registrar Nuevo Profesor'}
                </h2>
                <p className="text-gray-500 text-sm">Completa los datos profesionales para habilitar al instructor en el sistema.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Campo Nombre */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</label>
                    <Input
                        name="nombre"
                        placeholder="Ej. Marco"
                        value={formData.nombre}
                        onChange={onChange}
                        required
                    />
                </div>

                {/* Campo Apellido */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Apellido</label>
                    <Input
                        name="apellido"
                        placeholder="Ej. 'El Toro' Torres"
                        value={formData.apellido}
                        onChange={onChange}
                        required
                    />
                </div>

                {/* Selector de Disciplina (Antes era un Input de texto) */}
                <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Disciplina Especializada</label>
                    <div className="relative">
                        <select
                            name="id_disciplina"
                            value={formData.id_disciplina}
                            onChange={onChange}
                            className="flex h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/50 focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all font-body text-gray-900 appearance-none cursor-pointer"
                            required
                        >
                            <option value="" disabled>Selecciona una especialidad...</option>
                            {disciplines.map((d) => (
                                <option key={d.id_disciplina} value={d.id_disciplina}>
                                    {d.nombre_disciplina}
                                </option>
                            ))}
                        </select>
                        {/* Icono decorativo para el select */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                        * Si la disciplina no aparece, asegúrate de haberla creado en la sección de Disciplinas.
                    </p>
                </div>

                {/* Campo Presentación */}
                <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Presentación / Bio</label>
                    <textarea
                        name="presentacion"
                        className="flex min-h-[100px] w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/50 focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all font-body resize-y"
                        placeholder="Describe brevemente la trayectoria, cinturones o especialidades técnicas..."
                        value={formData.presentacion}
                        onChange={onChange}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                {isEditing && (
                    <Button variant="ghost" className="text-gray-500 hover:text-gray-900 hover:bg-gray-100" onClick={onCancel}>
                        Cancelar
                    </Button>
                )}
                <Button 
                    onClick={onSave}
                    className="bg-brand-red hover:bg-red-700 text-white font-bold shadow-lg shadow-red-500/20 px-8"
                >
                    {isEditing ? 'Actualizar Información' : 'Guardar Instructor'}
                </Button>
            </div>
        </div>
    );
}