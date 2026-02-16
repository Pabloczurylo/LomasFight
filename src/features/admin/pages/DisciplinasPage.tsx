import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Layers } from 'lucide-react';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import DisciplinaModal from '../components/DisciplinaModal';
import { Disciplina } from '../types';
import { api } from '../../../services/api';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DisciplinasPage() {
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Modal states
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        id: number | null;
        name: string | null;
    }>({
        isOpen: false,
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

    const fetchDisciplinas = async () => {
        try {
            const response = await api.get('/disciplinas');
            setDisciplinas(response.data);
        } catch (error) {
            console.error('Error fetching disciplinas:', error);
            if (error instanceof AxiosError && error.response?.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDisciplinas();
    }, []);

    const handleDeleteClick = (id: number, name: string) => {
        setDeleteModal({
            isOpen: true,
            id,
            name
        });
    };

    const handleConfirmDelete = async () => {
        if (deleteModal.id) {
            try {
                await api.delete(`/disciplinas/${deleteModal.id}`);
                setDisciplinas(prev => prev.filter(d => d.id_disciplina !== deleteModal.id));
            } catch (error) {
                console.error("Error al eliminar disciplina:", error);
                if (error instanceof AxiosError && error.response?.status === 401) {
                    localStorage.clear();
                    navigate('/login');
                }
            }
        }
        setDeleteModal({ isOpen: false, id: null, name: null });
    };

    const handleSaveDisciplina = async (disciplina: Disciplina) => {
        try {
            if (disciplina.id_disciplina) {
                // Update
                // We don't send id in body typically if it's strictly following REST, but let's see. 
                // Using PUT /disciplinas/:id
                const { id_disciplina, ...data } = disciplina;
                await api.put(`/disciplinas/${id_disciplina}`, data);
                setDisciplinas(prev => prev.map(d => d.id_disciplina === id_disciplina ? disciplina : d));
            } else {
                // Create
                const response = await api.post('/disciplinas', disciplina);
                // Assuming backend returns the created object with ID
                // If backend returns just "ok", we might need to refetch or assume ID if passed (but ID is usually auto-inc)
                // Let's refetch to be safe or use response data
                if (response.data && response.data.id_disciplina) {
                    setDisciplinas(prev => [...prev, response.data]);
                } else {
                    fetchDisciplinas();
                }
            }
        } catch (error) {
            console.error("Error saving disciplina:", error);
            if (error instanceof AxiosError && error.response?.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
            </div>
        );
    }

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
                        <div key={disciplina.id_disciplina} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                            <div className="relative h-48 overflow-hidden bg-gray-100">
                                {disciplina.imagen_disciplina ? (
                                    <img
                                        src={disciplina.imagen_disciplina}
                                        alt={disciplina.nombre_disciplina}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Layers className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-heading font-bold text-gray-900 group-hover:text-brand-red transition-colors">
                                        {disciplina.nombre_disciplina}
                                    </h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-6 line-clamp-2 min-h-[40px]">
                                    {disciplina.descripcion_disciplina}
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
                                        onClick={() => handleDeleteClick(disciplina.id_disciplina, disciplina.nombre_disciplina)}
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
                title="Eliminar Disciplina"
                message={`¿Estás seguro que deseas eliminar a ${deleteModal.name}? Esta acción no se puede deshacer.`}
                type="danger"
            />

            <DisciplinaModal
                isOpen={disciplinaModal.isOpen}
                onClose={() => setDisciplinaModal({ ...disciplinaModal, isOpen: false })}
                onSave={handleSaveDisciplina}
                initialData={disciplinaModal.data}
            />
        </div>
    );
}
