import { useState, useEffect } from 'react';
import { Alumno, ClienteBackend } from '../types';
import { cn } from '../../../lib/utils';
import { Search, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import StudentModal from '../components/StudentModal';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { api } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

// Mapeo temporal de disciplinas (Debería venir del backend)
const DISCIPLINA_ID_MAP: Record<string, number> = {
    'Kickboxing': 3,
    'Boxeo': 4,
    'Fuerza': 5
};

export default function AlumnosPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Alumno | undefined>(undefined);
    const navigate = useNavigate();

    // Estados para ConfirmModals
    const [studentToDelete, setStudentToDelete] = useState<Alumno | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const [pendingStudentData, setPendingStudentData] = useState<Omit<Alumno, 'id' | 'fechaRegistro'> | null>(null);
    const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false);

    const fetchAlumnos = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await api.get<ClienteBackend[]>('/clientes');

            const mappedAlumnos: Alumno[] = response.data.map(cliente => ({
                id: String(cliente.id_cliente),
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                disciplina: cliente.disciplinas?.nombre_disciplina || 'Sin Disciplina',
                estadoPago: cliente.fecha_ultimo_pago ? 'al día' : 'pendiente',
                fechaRegistro: cliente.fecha_ultimo_pago ? new Date(cliente.fecha_ultimo_pago).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            }));

            setAlumnos(mappedAlumnos);
        } catch (err) {
            console.error('Error fetching alumnos:', err);

            if (err instanceof AxiosError && err.response?.status === 401) {
                localStorage.clear(); // Or remove specific items: localStorage.removeItem('token'); localStorage.removeItem('usuario');
                navigate('/login');
                return;
            }

            setError('Error al cargar los alumnos. Por favor, intente nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAlumnos();
    }, []);

    const filteredAlumnos = alumnos.filter((alumno) =>
        alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumno.apellido.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddClick = () => {
        setSelectedStudent(undefined);
        setIsModalOpen(true);
    };

    const handleEditClick = (alumno: Alumno) => {
        setSelectedStudent(alumno);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (alumno: Alumno) => {
        setStudentToDelete(alumno);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (studentToDelete) {
            try {
                // studentToDelete.id corresponde a id_cliente según el mapeo en fetchAlumnos
                await api.delete(`/clientes/${studentToDelete.id}`);
                await fetchAlumnos();
                setStudentToDelete(null);
                setIsDeleteConfirmOpen(false);
            } catch (error) {
                console.error('Error deleting student:', error);
                alert('Error al eliminar el alumno. Por favor intente nuevamente.');
            }
        }
    };

    const handleSaveStudent = async (studentData: Omit<Alumno, 'id' | 'fechaRegistro'>) => {
        if (selectedStudent) {
            // Edit mode - Ask for confirmation
            setPendingStudentData(studentData);
            setIsSaveConfirmOpen(true);
        } else {
            // Add mode - Save immediately to Backend
            try {
                const payload = {
                    nombre: studentData.nombre,
                    apellido: studentData.apellido,
                    id_disciplina: Number(DISCIPLINA_ID_MAP[studentData.disciplina] || 3),
                    // Optional fields
                    dni: null,
                    fecha_nacimiento: null,
                    grupo_sanguineo: null,
                    id_profesor_que_cargo: null
                };

                await api.post('/clientes', payload);

                // Refresh list
                await fetchAlumnos();
                setIsModalOpen(false);
            } catch (error) {
                console.error('Error creating student:', error);
                alert('Error al crear el alumno. Por favor intente nuevamente.');
            }
        }
    };

    const confirmSave = async () => {
        if (pendingStudentData && selectedStudent) {
            try {
                // Edit mode
                const payload = {
                    nombre: pendingStudentData.nombre,
                    apellido: pendingStudentData.apellido,
                    id_disciplina: Number(DISCIPLINA_ID_MAP[pendingStudentData.disciplina] || 3),
                    // Mantener otros campos si es necesario o enviarlos como están
                    dni: null,
                    fecha_nacimiento: null,
                    grupo_sanguineo: null,
                    id_profesor_que_cargo: null
                };

                // selectedStudent.id mapea a id_cliente
                await api.put(`/clientes/${selectedStudent.id}`, payload);

                await fetchAlumnos();

                setIsSaveConfirmOpen(false);
                setPendingStudentData(null);
                setIsModalOpen(false);
            } catch (error) {
                console.error('Error updating student:', error);
                alert('Error al actualizar el alumno. Por favor intente nuevamente.');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 text-red-600">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
                <h2 className="text-3xl font-heading font-bold text-gray-900">Gestión de Alumnos</h2>
                <button
                    onClick={handleAddClick}
                    className="flex items-center justify-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto"
                >
                    <Plus size={20} />
                    <span>Agregar Alumno</span>
                </button>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="mb-6 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o apellido..."
                        className="pl-10 w-full sm:w-80 rounded-lg border border-gray-300 focus:border-brand-red focus:ring-1 focus:ring-brand-red py-2 text-gray-900 placeholder:text-gray-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="w-full overflow-x-auto shadow-inner rounded-lg">
                    <table className="w-full min-w-[600px] text-left">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="pb-3 font-bold text-gray-500">Nombre</th>
                                <th className="pb-3 font-bold text-gray-500">Disciplina</th>
                                <th className="pb-3 font-bold text-gray-500">Estado de Pago</th>
                                <th className="pb-3 font-bold text-gray-500">Fecha Registro</th>
                                <th className="pb-3 font-bold text-gray-500 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAlumnos.map((alumno) => (
                                <tr key={alumno.id} className="group hover:bg-gray-50">
                                    <td className="py-4 font-medium text-gray-900 group-hover:text-brand-red transition-colors">
                                        {alumno.nombre} {alumno.apellido}
                                    </td>
                                    <td className="py-4 text-gray-600">{alumno.disciplina}</td>
                                    <td className="py-4">
                                        <span
                                            className={cn(
                                                'px-3 py-1 rounded-full text-sm font-medium',
                                                alumno.estadoPago === 'al día' && 'bg-green-100 text-green-700',
                                                alumno.estadoPago === 'pendiente' && 'bg-yellow-100 text-yellow-700',
                                                alumno.estadoPago === 'vencido' && 'bg-red-100 text-red-700'
                                            )}
                                        >
                                            {alumno.estadoPago}
                                        </span>
                                    </td>
                                    <td className="py-4 text-gray-500">{alumno.fechaRegistro}</td>
                                    <td className="py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEditClick(alumno)}
                                                className="p-1.5 text-gray-500 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(alumno)}
                                                className="p-1.5 text-gray-500 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredAlumnos.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500">
                                        No se encontraron alumnos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <StudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveStudent}
                initialData={selectedStudent}
                onDelete={selectedStudent ? () => {
                    handleDeleteClick(selectedStudent);
                    setIsModalOpen(false); // Close the edit modal when delete confirmation opens
                } : undefined}
            />

            {/* Modal de confirmación para eliminar */}
            <ConfirmModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Eliminar Alumno"
                message={`¿Estás seguro de que deseas eliminar a ${studentToDelete?.nombre} ${studentToDelete?.apellido}? Esta acción no se puede deshacer.`}
                type="danger"
            />

            {/* Modal de confirmación para crear/editar */}
            <ConfirmModal
                isOpen={isSaveConfirmOpen}
                onClose={() => setIsSaveConfirmOpen(false)}
                onConfirm={confirmSave}
                title="Confirmar Edición"
                message="¿Deseas guardar los cambios realizados?"
                type="success"
            />
        </div>
    );
}
