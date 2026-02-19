import { useState, useEffect, useCallback } from 'react';
import { Teacher } from '../types';
import { TeacherForm } from '../components/TeacherForm';
import { TeacherList } from '../components/TeacherList';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { api } from '../../../services/api';
import { Loader2 } from 'lucide-react';

// Interfaces para tipar la respuesta del Backend
interface Disciplina {
    id_disciplina: number;
    nombre_disciplina: string;
}

interface ProfesorBackend {
    id_profesor: number;
    nombre: string;
    apellido: string;
    id_disciplina: number;
    activo: boolean;
    disciplinas: Disciplina;
}

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [disciplines, setDisciplines] = useState<Disciplina[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        id: 0,
        nombre: '',
        apellido: '',
        id_disciplina: '', // Usaremos el ID de la DB
        presentacion: ''   // Nota: No está en Prisma, se mantiene local por ahora
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

    // --- CARGA DE DATOS ---
    const fetchAllData = useCallback(async () => {
        try {
            setLoading(true);
            const [resProf, resDisc] = await Promise.all([
                api.get<ProfesorBackend[]>('/profesores'),
                api.get<Disciplina[]>('/diciplinas') // Corregido según DisciplinasPage
            ]);

            console.log("Profesores cargados:", resProf.data);
            console.log("Disciplinas cargadas:", resDisc.data);

            const mappedTeachers: Teacher[] = resProf.data.map(p => ({
                id: p.id_profesor,
                nombre: p.nombre,
                apellido: p.apellido,
                id_disciplina: p.id_disciplina,
                disciplinas: [p.disciplinas.nombre_disciplina], // Mapeo para TeacherList
                presentacion: '',
                estado: p.activo ? 'Activo' : 'Inactivo'
            }));

            setTeachers(mappedTeachers);
            setDisciplines(resDisc.data);
        } catch (error) {
            console.error("Error en carga:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAllData(); }, [fetchAllData]);

    // --- MANEJADORES ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = () => {
        if (!formData.nombre || !formData.apellido || !formData.id_disciplina) {
            alert("Completa los campos obligatorios.");
            return;
        }
        setIsConfirmModalOpen(true);
    };

    const handleConfirmSave = async () => {
        try {
            const payload = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                id_disciplina: Number(formData.id_disciplina)
            };

            if (isEditing) {
                await api.put(`/profesores/${formData.id}`, payload);
            } else {
                await api.post('/profesores', payload);
            }

            await fetchAllData();
            handleDiscard();
            setIsConfirmModalOpen(false);
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    const handleConfirmDelete = async () => {
        if (pendingDeleteId) {
            await api.delete(`/profesores/${pendingDeleteId}`);
            await fetchAllData();
            setPendingDeleteId(null);
        }
    };

    const handleStatusChange = async (id: number, status: Teacher['estado']) => {
        await api.put(`/profesores/${id}`, { activo: status === 'Activo' });
        await fetchAllData();
    };

    const handleDiscard = () => {
        setFormData({ id: 0, nombre: '', apellido: '', id_disciplina: '', presentacion: '' });
        setIsEditing(false);
    };

    const handleEditClick = (teacher: Teacher) => {
        setFormData({
            id: teacher.id,
            nombre: teacher.nombre,
            apellido: teacher.apellido,
            id_disciplina: teacher.id_disciplina ? teacher.id_disciplina.toString() : '',
            presentacion: teacher.presentacion
        });
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-brand-red w-10 h-10" /></div>;

    return (
        <div className="flex flex-col gap-8">
            <header>
                <h1 className="text-2xl font-heading font-black uppercase tracking-wide text-gray-900">Gestión de Profesores</h1>
                <p className="text-gray-500 text-sm font-medium">Panel administrativo de instructores.</p>
            </header>

            <TeacherForm
                formData={formData}
                disciplines={disciplines}
                onChange={handleInputChange}
                onSave={handleSaveClick}
                onCancel={handleDiscard}
                isEditing={isEditing}
            />

            <TeacherList
                teachers={teachers}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onEdit={handleEditClick}
                onDelete={(id) => setPendingDeleteId(id)}
                onStatusChange={handleStatusChange}
            />

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmSave}
                title={isEditing ? "Actualizar" : "Crear"}
                message="¿Confirmas los cambios en la nómina de profesores?"
                type="success"
            />

            <ConfirmModal
                isOpen={!!pendingDeleteId}
                onClose={() => setPendingDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Eliminar Profesor"
                message="Esta acción realizará un borrado lógico del instructor."
                type="danger"
            />
        </div>
    );
}