import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { Teacher } from '../types';
import { TeacherForm } from '../components/TeacherForm';
import { TeacherList } from '../components/TeacherList';
import ConfirmModal from '../../../components/ui/ConfirmModal';

// --- MOCK DATA ---
const MOCK_TEACHERS: Teacher[] = [
    {
        id: 1,
        nombre: 'Marco',
        apellido: "'El Toro' Torres",
        disciplinas: ['BOXEO PRO', 'MMA'],
        presentacion: 'Ex campeón regional de Boxeo con más de 10 años de experiencia enseñando.',
        estado: 'Activo'
    },
    {
        id: 2,
        nombre: 'Elena',
        apellido: 'Rodriguez',
        disciplinas: ['MUAY THAI'],
        presentacion: 'Especialista en técnicas de codo y rodilla. Formada en Tailandia.',
        estado: 'Activo'
    },
    {
        id: 3,
        nombre: 'Carlos',
        apellido: "'The King' Mendez",
        disciplinas: ['KRAV MAGA', 'BJJ'],
        presentacion: 'Instructor certificado en defensa personal y cinturón negro en BJJ.',
        estado: 'Inactivo'
    },
];

export default function TeachersPage() {
    // --- ESTADOS ---
    const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
    const [searchTerm, setSearchTerm] = useState('');

    // Estado del formulario
    const [formData, setFormData] = useState({
        id: 0,
        nombre: '',
        apellido: '',
        disciplinaInput: '',
        presentacion: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    // Estado para el modal de confirmación
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    // --- MANEJADORES ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDiscard = () => {
        setFormData({ id: 0, nombre: '', apellido: '', disciplinaInput: '', presentacion: '' });
        setIsEditing(false);
    };

    const handleSaveClick = () => {
        if (!formData.nombre || !formData.apellido) {
            alert("El nombre y apellido son obligatorios.");
            return;
        }
        setIsConfirmModalOpen(true);
    };

    const handleConfirmSave = () => {
        // Parsear disciplinas (separadas por coma)
        const disciplinasArray = formData.disciplinaInput
            .split(',')
            .map(d => d.trim())
            .filter(d => d !== '');

        if (isEditing) {
            // EDITAR
            setTeachers(prev => prev.map(t =>
                t.id === formData.id
                    ? {
                        ...t,
                        nombre: formData.nombre,
                        apellido: formData.apellido,
                        disciplinas: disciplinasArray.length > 0 ? disciplinasArray : t.disciplinas,
                        presentacion: formData.presentacion
                    }
                    : t
            ));
        } else {
            // CREAR
            const newTeacher: Teacher = {
                id: Date.now(), // Mock ID
                nombre: formData.nombre,
                apellido: formData.apellido,
                disciplinas: disciplinasArray,
                presentacion: formData.presentacion,
                estado: 'Activo' // Por defecto
            };
            setTeachers(prev => [...prev, newTeacher]);
        }

        handleDiscard(); // Limpiar form
        setIsConfirmModalOpen(false);
    };

    const handleEditClick = (teacher: Teacher) => {
        setFormData({
            id: teacher.id,
            nombre: teacher.nombre,
            apellido: teacher.apellido,
            disciplinaInput: teacher.disciplinas.join(', '),
            presentacion: teacher.presentacion
        });
        setIsEditing(true);
        // Scroll to top or form?
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = (id: number) => {
        if (window.confirm("¿Seguro que deseas eliminar este profesor?")) {
            setTeachers(prev => prev.filter(t => t.id !== id));
            // Si estaba editando este usuario, limpiar form
            if (formData.id === id) {
                handleDiscard();
            }
        }
    };

    const handleStatusChange = (id: number, newStatus: Teacher['estado']) => {
        setTeachers(prev => prev.map(t =>
            t.id === id ? { ...t, estado: newStatus } : t
        ));
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-heading font-black uppercase tracking-wide text-gray-900 flex items-center gap-2">
                    <GraduationCap className="h-8 w-8 text-brand-red" /> Gestíon de Profesores
                </h1>
                <p className="text-gray-500 text-sm mt-0.5 font-medium">Administra el equipo de instructores y sus disciplinas.</p>
            </div>

            {/* SECCIÓN 1: FORMULARIO */}
            <TeacherForm
                formData={formData}
                onChange={handleInputChange}
                onSave={handleSaveClick}
                isEditing={isEditing}
            />

            {/* SECCIÓN 2: LISTADO */}
            <TeacherList
                teachers={teachers}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onStatusChange={handleStatusChange}
            />

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmSave}
                title={isEditing ? "Confirmar Edición" : "Confirmar Creación"}
                message={isEditing
                    ? "¿Estás seguro de que deseas guardar los cambios realizados en este profesor?"
                    : "¿Estás seguro de que deseas crear este nuevo profesor?"}
                type="success"
            />
        </div>
    );
}
