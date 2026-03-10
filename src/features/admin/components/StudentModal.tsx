import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

const GRUPOS_SANGUINEOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export interface StudentFormData {
    nombre: string;
    apellido: string;
    id_disciplina: number;
    estadoPago: 'al día' | 'pendiente' | 'inactivo';
    dni: string | null;
    fecha_nacimiento: string | null;
    grupo_sanguineo: string | null;
    domicilio: string | null;
}

interface DisciplinaOption { id_disciplina: number; nombre_disciplina: string; }

interface StudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: StudentFormData) => void;
    initialData?: StudentFormData & { id?: string };
    onDelete?: () => void;
    disciplinas: DisciplinaOption[];
}

export default function StudentModal({
    isOpen, onClose, onSave, initialData, onDelete, disciplinas
}: StudentModalProps) {
    const [nombre,             setNombre]            = useState('');
    const [apellido,           setApellido]          = useState('');
    const [idDisciplina,       setIdDisciplina]      = useState<number>(0);
    const [estadoPago,         setEstadoPago]        = useState<StudentFormData['estadoPago']>('pendiente');
    const [dni,                setDni]               = useState('');
    const [fechaNacimiento,    setFechaNacimiento]   = useState('');
    const [grupoSanguineo,     setGrupoSanguineo]    = useState('');
    const [domicilio,          setDomicilio]         = useState('');

    const [errors, setErrors] = useState({ nombre: '', apellido: '' });

    useEffect(() => {
        if (!isOpen) return;
        if (initialData) {
            setNombre(initialData.nombre);
            setApellido(initialData.apellido);
            setIdDisciplina(initialData.id_disciplina || disciplinas[0]?.id_disciplina || 0);
            setEstadoPago(initialData.estadoPago || 'pendiente');
            setDni(initialData.dni || '');
            setFechaNacimiento(initialData.fecha_nacimiento
                ? new Date(initialData.fecha_nacimiento).toISOString().split('T')[0]
                : '');
            setGrupoSanguineo(initialData.grupo_sanguineo || '');
            setDomicilio(initialData.domicilio || '');
        } else {
            setNombre('');
            setApellido('');
            setIdDisciplina(disciplinas[0]?.id_disciplina || 0);
            setEstadoPago('pendiente');
            setDni('');
            setFechaNacimiento('');
            setGrupoSanguineo('');
            setDomicilio('');
        }
        setErrors({ nombre: '', apellido: '' });
    }, [isOpen, initialData, disciplinas]);

    if (!isOpen) return null;

    const validate = () => {
        const e = { nombre: '', apellido: '' };
        let ok = true;
        if (!nombre.trim()) { e.nombre  = 'El nombre es obligatorio.';   ok = false; }
        if (!apellido.trim()) { e.apellido = 'El apellido es obligatorio.'; ok = false; }
        setErrors(e);
        return ok;
    };

    const handleSubmit = (ev: React.FormEvent) => {
        ev.preventDefault();
        if (!validate()) return;
        onSave({
            nombre:   nombre.trim(),
            apellido: apellido.trim(),
            id_disciplina: idDisciplina,
            estadoPago,
            dni:                   dni.trim()            || null,
            fecha_nacimiento:      fechaNacimiento        || null,
            grupo_sanguineo:       grupoSanguineo         || null,
            domicilio:             domicilio.trim()       || null,
        });
        onClose();
    };

    const isEditing = !!initialData?.id;

    const inputClass = (err?: string) => cn(
        'w-full px-4 py-2.5 rounded-lg border bg-white outline-none text-gray-900 transition-all focus:ring-2 focus:ring-opacity-20 placeholder:text-gray-400',
        err ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-brand-red focus:ring-brand-red'
    );
    const labelClass = 'text-sm font-bold text-gray-700';
    const optionalClass = 'text-xs font-normal text-gray-400 ml-1';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
                    <h3 className="text-xl font-heading font-bold text-gray-900">
                        {isEditing ? 'Editar Alumno' : 'Nuevo Alumno'}
                    </h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form — scrollable */}
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">

                    {/* Nombre + Apellido */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className={labelClass}>Nombre <span className="text-red-500">*</span></label>
                            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
                                placeholder="Ej: Juan" className={inputClass(errors.nombre)} />
                            {errors.nombre && <p className="text-xs text-red-500">{errors.nombre}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>Apellido <span className="text-red-500">*</span></label>
                            <input type="text" value={apellido} onChange={e => setApellido(e.target.value)}
                                placeholder="Ej: Pérez" className={inputClass(errors.apellido)} />
                            {errors.apellido && <p className="text-xs text-red-500">{errors.apellido}</p>}
                        </div>
                    </div>

                    {/* DNI */}
                    <div className="space-y-1.5">
                        <label className={labelClass}>DNI <span className={optionalClass}>(opcional)</span></label>
                        <input type="text" value={dni} onChange={e => setDni(e.target.value)}
                            placeholder="Ej: 38123456" className={inputClass()} />
                    </div>

                    {/* Domicilio */}
                    <div className="space-y-1.5">
                        <label className={labelClass}>Domicilio <span className={optionalClass}>(opcional)</span></label>
                        <input type="text" value={domicilio} onChange={e => setDomicilio(e.target.value)}
                            placeholder="Ej: Av. Siempre Viva 123" className={inputClass()} />
                    </div>

                    {/* Disciplina */}
                    <div className="space-y-1.5">
                        <label className={labelClass}>Disciplina <span className="text-red-500">*</span></label>
                        <select value={idDisciplina} onChange={e => setIdDisciplina(Number(e.target.value))}
                            className={inputClass()}>
                            {disciplinas.map(d => (
                                <option key={d.id_disciplina} value={d.id_disciplina}>{d.nombre_disciplina}</option>
                            ))}
                        </select>
                    </div>

                    {/* Estado de Pago */}
                    {isEditing && (
                        <div className="space-y-1.5">
                            <label className={labelClass}>Estado de Pago</label>
                            <select value={estadoPago} onChange={e => setEstadoPago(e.target.value as StudentFormData['estadoPago'])}
                                className={inputClass()}>
                                <option value="al día">Al día</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                        </div>
                    )}

                    {/* Fecha nacimiento + Grupo sanguíneo */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className={labelClass}>Fecha de Nacimiento <span className={optionalClass}>(opcional)</span></label>
                            <input type="date" value={fechaNacimiento} onChange={e => setFechaNacimiento(e.target.value)}
                                className={inputClass()} />
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>Grupo Sanguíneo <span className={optionalClass}>(opcional)</span></label>
                            <select value={grupoSanguineo} onChange={e => setGrupoSanguineo(e.target.value)}
                                className={inputClass()}>
                                <option value="">— Sin especificar —</option>
                                {GRUPOS_SANGUINEOS.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2 flex-shrink-0">
                        {isEditing && onDelete && (
                            <button type="button" onClick={onDelete}
                                className="px-4 py-2.5 border border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2">
                                <Trash2 size={18} /> Eliminar
                            </button>
                        )}
                        <button type="button" onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit"
                            className="flex-1 px-4 py-2.5 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/20 transition-all">
                            {isEditing ? 'Guardar Cambios' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
