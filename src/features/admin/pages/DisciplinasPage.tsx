import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { Disciplina, Profesor } from '../types';

const MOCK_DISCIPLINAS: Disciplina[] = [
    {
        id: '1',
        nombre: 'Kickboxing',
        descripcion: 'Entrenamiento de alta intensidad que combina técnicas de boxeo con patadas de artes marciales.',
        imagen: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: '2',
        nombre: 'Boxeo',
        descripcion: 'Deporte de combate en el que dos personas luchan utilizando únicamente sus puños con guantes.',
        imagen: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: '3',
        nombre: 'Muay Thai',
        descripcion: 'Arte marcial tailandés conocido como "el arte de las ocho extremidades".',
        imagen: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=600'
    }
];

const MOCK_PROFESORES: Profesor[] = [
    {
        id: '1',
        nombre: 'Martín Silva',
        especialidad: 'Head Coach - Kickboxing',
        imagen: 'https://i.pravatar.cc/150?u=martin'
    },
    {
        id: '2',
        nombre: 'Laura González',
        especialidad: 'Instructora de Boxeo',
        imagen: 'https://i.pravatar.cc/150?u=laura'
    },
    {
        id: '3',
        nombre: 'Carlos Ruiz',
        especialidad: 'Maestro de Muay Thai',
        imagen: 'https://i.pravatar.cc/150?u=carlos'
    }
];

export default function DisciplinasPage() {
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>(MOCK_DISCIPLINAS);
    const [profesores, setProfesores] = useState<Profesor[]>(MOCK_PROFESORES);

    // Modal states
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        type: 'disciplina' | 'profesor' | null;
        id: string | null;
        name: string | null;
    }>({
        isOpen: false,
        type: null,
        id: null,
        name: null
    });

    const handleDeleteClick = (type: 'disciplina' | 'profesor', id: string, name: string) => {
        setDeleteModal({
            isOpen: true,
            type,
            id,
            name
        });
    };

    const handleConfirmDelete = () => {
        if (deleteModal.type === 'disciplina' && deleteModal.id) {
            setDisciplinas(prev => prev.filter(d => d.id !== deleteModal.id));
        } else if (deleteModal.type === 'profesor' && deleteModal.id) {
            setProfesores(prev => prev.filter(p => p.id !== deleteModal.id));
        }
        setDeleteModal({ isOpen: false, type: null, id: null, name: null });
    };

    return (
        <div className="space-y-12 pb-12">
            {/* Sección Disciplinas */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-heading font-bold text-gray-900">Disciplinas</h2>
                        <p className="text-gray-600">Gestiona las disciplinas disponibles en el gimnasio</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md">
                        <Plus className="w-5 h-5" />
                        AÑADIR NUEVA DISCIPLINA
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {disciplinas.map((disciplina) => (
                        <div key={disciplina.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={disciplina.imagen}
                                    alt={disciplina.nombre}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-heading font-bold text-gray-900 group-hover:text-brand-red transition-colors">
                                        {disciplina.nombre}
                                    </h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                                    {disciplina.descripcion}
                                </p>

                                <div className="flex gap-3 pt-4 border-t border-gray-100">
                                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                        EDITAR
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick('disciplina', disciplina.id, disciplina.nombre)}
                                        className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        ELIMINAR
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Sección Profesores */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-heading font-bold text-gray-900">Profesores</h2>
                        <p className="text-gray-600">Gestiona al equipo de entrenadores</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md">
                        <Plus className="w-5 h-5" />
                        AGREGAR PROFESOR
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {profesores.map((profesor) => (
                        <div key={profesor.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100 text-center">
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <img
                                    src={profesor.imagen}
                                    alt={profesor.nombre}
                                    className="w-full h-full rounded-full object-cover border-4 border-gray-50 shadow-sm"
                                />
                                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full" title="Activo"></div>
                            </div>

                            <h3 className="text-lg font-heading font-bold text-gray-900 mb-1">
                                {profesor.nombre}
                            </h3>
                            <p className="text-sm font-medium text-brand-red mb-6">
                                {profesor.especialidad}
                            </p>

                            <div className="flex gap-2 justify-center">
                                <button className="p-2 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick('profesor', profesor.id, profesor.nombre)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={handleConfirmDelete}
                title={`Eliminar ${deleteModal.type === 'disciplina' ? 'Disciplina' : 'Profesor'}`}
                message={`¿Estás seguro que deseas eliminar a ${deleteModal.name}? Esta acción no se puede deshacer.`}
                type="danger"
            />
        </div>
    );
}
