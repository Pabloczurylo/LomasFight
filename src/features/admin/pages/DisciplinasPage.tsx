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
        const endpoint = '/diciplinas';
        console.log('URL Final GET:', api.defaults.baseURL + endpoint);
        try {
            const response = await api.get(endpoint);
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
            const endpoint = `/diciplinas/${deleteModal.id}`;
            console.log('URL Final DELETE:', api.defaults.baseURL + endpoint);
            try {
                await api.delete(endpoint);
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
        // Prepare Payload for Backend (names must match controller expectations)
        const payload = {
            nombre_disciplina: disciplina.nombre_disciplina,
            descripcion: disciplina.descripcion,
            img_banner: disciplina.img_banner,
            img_preview: disciplina.img_banner, // Sending same image for both
            cuota: 0 // Required by backend
        };

        try {
            if (disciplina.id_disciplina) {
                // Update
                const endpoint = `/diciplinas/${disciplina.id_disciplina}`;
                console.log(`[UPDATE] Enviando PUT a: ${api.defaults.baseURL}${endpoint}`);
                console.log('[UPDATE] Payload:', payload);

                const response = await api.put(endpoint, payload);
                console.log('[UPDATE] Respuesta Servidor:', response.status, response.data);

                setDisciplinas(prev => prev.map(d => d.id_disciplina === disciplina.id_disciplina ? { ...disciplina, ...payload } : d));
            } else {
                // Create
                const endpoint = '/diciplinas';
                console.log(`[CREATE] Enviando POST a: ${api.defaults.baseURL}${endpoint}`);
                console.log('[CREATE] Payload:', payload);

                const response = await api.post(endpoint, payload);
                console.log('[CREATE] Respuesta Servidor:', response.status, response.data);

                if (response.data && response.data.id_disciplina) {
                    fetchDisciplinas();
                } else {
                    fetchDisciplinas();
                }
            }
        } catch (error) {
            console.error("Error saving disciplina (CRITICAL):", error);
            if (error instanceof AxiosError) {
                console.error("Detalles del Error Axios:", {
                    status: error.response?.status,
                    data: error.response?.data,
                    headers: error.response?.headers
                });
                if (error.response?.status === 401) {
                    localStorage.clear();
                    navigate('/login');
                }
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
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-heading font-bold text-gray-900">Disciplinas</h2>
                    <p className="text-gray-600">Gestiona las disciplinas disponibles en el gimnasio</p>
                </div>
                <button
                    onClick={() => setDisciplinaModal({ isOpen: true, data: null })}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md transform hover:scale-105 duration-200"
                >
                    <Plus className="w-5 h-5" />
                    AÑADIR DISCIPLINA
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-heading font-bold text-gray-900 uppercase text-xs tracking-wider w-24">Imagen</th>
                                <th className="px-6 py-4 font-heading font-bold text-gray-900 uppercase text-xs tracking-wider">Nombre</th>
                                <th className="px-6 py-4 font-heading font-bold text-gray-900 uppercase text-xs tracking-wider">Descripción</th>
                                <th className="px-6 py-4 font-heading font-bold text-gray-900 uppercase text-xs tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {disciplinas.length > 0 ? (
                                disciplinas.map((disciplina) => (
                                    <tr key={disciplina.id_disciplina} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                                {disciplina.img_preview || disciplina.img_banner ? (
                                                    <img
                                                        src={disciplina.img_preview || disciplina.img_banner}
                                                        alt={disciplina.nombre_disciplina}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <Layers className="w-8 h-8" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-gray-900 text-lg">
                                                {disciplina.nombre_disciplina}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-500 text-sm line-clamp-2 max-w-md">
                                                {disciplina.descripcion}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setDisciplinaModal({ isOpen: true, data: disciplina })}
                                                    className="p-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-900 transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(disciplina.id_disciplina, disciplina.nombre_disciplina)}
                                                    className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No hay disciplinas registradas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

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
