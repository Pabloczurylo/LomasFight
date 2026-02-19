import { useState } from 'react';
import { Search, Trash2, Pencil, GraduationCap } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';

// --- INTERFACES ---
interface Teacher {
    id: number;
    nombre: string;
    apellido: string;
    disciplinas: string[];
    presentacion: string;
    estado: 'Activo' | 'De Vacaciones';
}

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
        estado: 'De Vacaciones'
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

    // --- MANEJADORES ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDiscard = () => {
        setFormData({ id: 0, nombre: '', apellido: '', disciplinaInput: '', presentacion: '' });
        setIsEditing(false);
    };

    const handleSave = () => {
        if (!formData.nombre || !formData.apellido) {
            alert("El nombre y apellido son obligatorios.");
            return;
        }

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
                        disciplinas: disciplinasArray.length > 0 ? disciplinasArray : t.disciplinas, // Mantener anteriores si no pone nada, o limpiar? Asumimos reemplazar.
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

    // --- FILTRADO ---
    const filteredTeachers = teachers.filter(t =>
        t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.disciplinas.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-heading font-black uppercase tracking-wide text-gray-900 flex items-center gap-2">
                    <GraduationCap className="h-8 w-8 text-brand-red" /> Gestíon de Profesores
                </h1>
                <p className="text-gray-500 text-sm mt-0.5 font-medium">Administra el equipo de instructores y sus disciplinas.</p>
            </div>

            {/* SECCIÓN 1: FORMULARIO */}
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
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Apellido</label>
                        <Input
                            name="apellido"
                            placeholder="Ej. Pérez"
                            value={formData.apellido}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Disciplina (Separadas por coma)</label>
                        <Input
                            name="disciplinaInput"
                            placeholder="Ej. Muay Thai, Boxeo"
                            value={formData.disciplinaInput}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Presentación</label>
                        <textarea
                            name="presentacion"
                            className="flex min-h-[100px] w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/50 focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all font-body resize-y"
                            placeholder="Describe la experiencia y formación del profesor..."
                            value={formData.presentacion}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                    <Button variant="ghost" className="text-gray-500 hover:text-gray-900 hover:bg-gray-100" onClick={handleDiscard}>
                        Descartar
                    </Button>
                    <Button onClick={handleSave}>
                        {isEditing ? 'Actualizar Profesor' : 'Guardar Profesor'}
                    </Button>
                </div>
            </div>

            {/* SECCIÓN 2: LISTADO */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-gray-900">Listado de Profesores</h2>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar profesor..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:bg-white transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 text-gray-500 font-bold uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4">Profesor</th>
                                <th className="px-6 py-4">Disciplina</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredTeachers.length > 0 ? (
                                filteredTeachers.map((teacher) => (
                                    <tr key={teacher.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{teacher.nombre} {teacher.apellido}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {teacher.disciplinas.map((disc, idx) => (
                                                    <Badge key={idx} variant="red" className="bg-red-50 text-brand-red border-red-100">
                                                        {disc}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-2 h-2 rounded-full ${teacher.estado === 'Activo' ? 'bg-green-500' : 'bg-gray-400'}`} />
                                                <span className={`text-xs font-bold ${teacher.estado === 'Activo' ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {teacher.estado}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(teacher)}
                                                    className="p-1.5 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-md transition-all"
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(teacher.id)}
                                                    className="p-1.5 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-md transition-all"
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
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                        No se encontraron profesores.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
