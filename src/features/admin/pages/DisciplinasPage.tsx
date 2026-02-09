import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import DisciplinaModal from '../components/DisciplinaModal';
import ProfesorModal from '../components/ProfesorModal';
import { Disciplina, Profesor } from '../types';
import { MOCK_DISCIPLINAS, MOCK_PROFESORES } from '../data/mockData';

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

    const [disciplinaModal, setDisciplinaModal] = useState<{
        isOpen: boolean;
        data: Disciplina | null;
    }>({
        isOpen: false,
        data: null
    });

    const [profesorModal, setProfesorModal] = useState<{
        isOpen: boolean;
        data: Profesor | null;
    }>({
        isOpen: false,
        data: null
    });

    // Delete Handlers
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

    // Disciplina Handlers
    const handleSaveDisciplina = (disciplina: Disciplina) => {
        if (disciplinaModal.data) {
            // Edit
            setDisciplinas(prev => prev.map(d => d.id === disciplina.id ? disciplina : d));
        } else {
            // Create
            setDisciplinas(prev => [...prev, disciplina]);
        }
    };

    // Profesor Handlers
    const handleSaveProfesor = (profesor: Profesor) => {
        if (profesorModal.data) {
            // Edit
            setProfesores(prev => prev.map(p => p.id === profesor.id ? profesor : p));
        } else {
            // Create
            setProfesores(prev => [...prev, profesor]);
        }
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
                    <button
                        onClick={() => setDisciplinaModal({ isOpen: true, data: null })}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md"
                    >
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
                                    <button
                                        onClick={() => setDisciplinaModal({ isOpen: true, data: disciplina })}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
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
                    <button
                        onClick={() => setProfesorModal({ isOpen: true, data: null })}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md"
                    >
                        <Plus className="w-5 h-5" />
                        AGREGAR PROFESOR
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profesores.map((profesor) => (
                        <div key={profesor.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={profesor.imagen}
                                    alt={profesor.nombre}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-heading font-bold text-gray-900 mb-1">
                                    {profesor.nombre}
                                </h3>
                                <p className="text-sm font-bold text-brand-red mb-6 uppercase tracking-wide">
                                    {profesor.especialidad}
                                </p>

                                <div className="flex gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => setProfesorModal({ isOpen: true, data: profesor })}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        EDITAR
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick('profesor', profesor.id, profesor.nombre)}
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

            {/* Modals */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={handleConfirmDelete}
                title={`Eliminar ${deleteModal.type === 'disciplina' ? 'Disciplina' : 'Profesor'}`}
                message={`¿Estás seguro que deseas eliminar a ${deleteModal.name}? Esta acción no se puede deshacer.`}
                type="danger"
            />

            <DisciplinaModal
                isOpen={disciplinaModal.isOpen}
                onClose={() => setDisciplinaModal({ ...disciplinaModal, isOpen: false })}
                onSave={handleSaveDisciplina}
                initialData={disciplinaModal.data}
            />

            <ProfesorModal
                isOpen={profesorModal.isOpen}
                onClose={() => setProfesorModal({ ...profesorModal, isOpen: false })}
                onSave={handleSaveProfesor}
                disciplinas={disciplinas}
                initialData={profesorModal.data}
            />
        </div>
    );
}
