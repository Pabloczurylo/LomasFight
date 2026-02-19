import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface TeacherFormProps {
    formData: {
        id: number;
        nombre: string;
        apellido: string;
        disciplinaInput: string;
        presentacion: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSave: () => void;
    isEditing: boolean;
}

export function TeacherForm({ formData, onChange, onSave, isEditing }: TeacherFormProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-gray-900">Crear / Editar Profesor</h2>
                <p className="text-gray-500 text-sm">Ingresa la información detallada del instructor para el sistema.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</label>
                    <Input
                        name="nombre"
                        placeholder="Ej. Juan"
                        value={formData.nombre}
                        onChange={onChange}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Apellido</label>
                    <Input
                        name="apellido"
                        placeholder="Ej. Pérez"
                        value={formData.apellido}
                        onChange={onChange}
                    />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Disciplina (Separadas por coma)</label>
                    <Input
                        name="disciplinaInput"
                        placeholder="Ej. Muay Thai, Boxeo"
                        value={formData.disciplinaInput}
                        onChange={onChange}
                    />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Presentación</label>
                    <textarea
                        name="presentacion"
                        className="flex min-h-[100px] w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/50 focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all font-body resize-y"
                        placeholder="Describe la experiencia y formación del profesor..."
                        value={formData.presentacion}
                        onChange={onChange}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <Button onClick={onSave}>
                    {isEditing ? 'Actualizar Profesor' : 'Guardar Profesor'}
                </Button>
            </div>
        </div>
    );
}
