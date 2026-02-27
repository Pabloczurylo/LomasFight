import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../services/api';
import { Loader2, Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { Pagination } from '../../../components/ui/Pagination';

const PAGE_SIZE = 10;

// ─── Types ──────────────────────────────────────────────────────────────────────

interface Disciplina {
    id_disciplina: number;
    nombre_disciplina: string;
}

type EstadoAlumno = 'al día' | 'pendiente' | 'inactivo';

interface Alumno {
    id_cliente: number;
    nombre: string;
    apellido: string;
    fecha_registro: string;
    fecha_ultimo_pago: string | null;
    activo: boolean;
    id_disciplina: number;
    // computed
    estado: EstadoAlumno;
}

// Derive 3-state status from raw data
function deriveEstado(activo: boolean, fecha_ultimo_pago: string | null): EstadoAlumno {
    if (!activo) return 'inactivo';
    if (!fecha_ultimo_pago) return 'pendiente';
    const pago = new Date(fecha_ultimo_pago);
    const now = new Date();
    // Consider "al día" if paid within the last 35 days (roughly current month)
    const diffDays = (now.getTime() - pago.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 35 ? 'al día' : 'pendiente';
}

// Payload to send to backend based on selected estado
function estadoToPayload(estado: EstadoAlumno): object {
    switch (estado) {
        case 'al día':
            return { activo: true, fecha_ultimo_pago: new Date().toISOString() };
        case 'pendiente':
            return { activo: true, fecha_ultimo_pago: null };
        case 'inactivo':
            return { activo: false };
    }
}

const ESTADO_CONFIG: Record<EstadoAlumno, { label: string; classes: string }> = {
    'al día': { label: 'Al día', classes: 'bg-green-100 text-green-700 border-green-200' },
    'pendiente': { label: 'Pendiente', classes: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    'inactivo': { label: 'Inactivo', classes: 'bg-gray-100 text-gray-500 border-gray-200' },
};

// ─── Inline form modal ──────────────────────────────────────────────────────────

interface AlumnoFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { nombre: string; apellido: string }) => void;
    initialData?: Alumno | null;
    fixedDisciplina: string;
}

function AlumnoFormModal({ isOpen, onClose, onSave, initialData, fixedDisciplina }: AlumnoFormModalProps) {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [errors, setErrors] = useState({ nombre: '', apellido: '' });

    useEffect(() => {
        if (isOpen) {
            setNombre(initialData?.nombre || '');
            setApellido(initialData?.apellido || '');
            setErrors({ nombre: '', apellido: '' });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const validate = () => {
        const e = { nombre: '', apellido: '' };
        let ok = true;
        if (!nombre.trim()) { e.nombre = 'El nombre es obligatorio.'; ok = false; }
        if (!apellido.trim()) { e.apellido = 'El apellido es obligatorio.'; ok = false; }
        setErrors(e);
        return ok;
    };

    const handleSubmit = (ev: React.FormEvent) => {
        ev.preventDefault();
        if (validate()) onSave({ nombre: nombre.trim(), apellido: apellido.trim() });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-xl font-heading font-bold text-gray-900">
                        {initialData ? 'Editar Alumno' : 'Nuevo Alumno'}
                    </h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-700">Disciplina</label>
                        <div className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-100 text-gray-600 font-semibold">
                            {fixedDisciplina}
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-700">Nombre <span className="text-red-500">*</span></label>
                        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Juan"
                            className={cn("w-full px-4 py-2.5 rounded-lg border bg-white outline-none text-gray-900 transition-all focus:ring-2 focus:ring-opacity-20",
                                errors.nombre ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-brand-red focus:ring-brand-red")}
                        />
                        {errors.nombre && <p className="text-xs text-red-500">{errors.nombre}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-700">Apellido <span className="text-red-500">*</span></label>
                        <input type="text" value={apellido} onChange={e => setApellido(e.target.value)} placeholder="Ej: Pérez"
                            className={cn("w-full px-4 py-2.5 rounded-lg border bg-white outline-none text-gray-900 transition-all focus:ring-2 focus:ring-opacity-20",
                                errors.apellido ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-brand-red focus:ring-brand-red")}
                        />
                        {errors.apellido && <p className="text-xs text-red-500">{errors.apellido}</p>}
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-gray-50">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" className="flex-1 px-4 py-2.5 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 transition-all">
                            {initialData ? 'Guardar Cambios' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function AlumnosPorDisciplina() {
    const currentUser = JSON.parse(localStorage.getItem('usuario') || '{}');
    const isAdmin = currentUser.rol === 'admin';
    const teacherDisciplineName: string = isAdmin ? '' : (currentUser.rol || '');

    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [selectedDisciplina, setSelectedDisciplina] = useState<number | null>(null);
    const [selectedDisciplinaName, setSelectedDisciplinaName] = useState('');
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAlumno, setEditingAlumno] = useState<Alumno | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingAlumno, setDeletingAlumno] = useState<Alumno | null>(null);

    // 1. Load disciplines
    useEffect(() => {
        const fetchDisciplinas = async () => {
            try {
                const response = await api.get<Disciplina[]>('/diciplinas');
                setDisciplinas(response.data);
                if (isAdmin) {
                    if (response.data.length > 0) {
                        setSelectedDisciplina(response.data[0].id_disciplina);
                        setSelectedDisciplinaName(response.data[0].nombre_disciplina);
                    }
                } else {
                    const match = response.data.find(
                        d => d.nombre_disciplina.toLowerCase() === teacherDisciplineName.toLowerCase()
                    );
                    if (match) {
                        setSelectedDisciplina(match.id_disciplina);
                        setSelectedDisciplinaName(match.nombre_disciplina);
                    }
                }
            } catch (error) {
                console.error('Error fetching disciplinas:', error);
            }
        };
        fetchDisciplinas();
    }, []);

    // 2. Load students by discipline
    const fetchAlumnos = useCallback(async () => {
        if (!selectedDisciplina) return;
        setLoading(true);
        try {
            const response = await api.get('/clientes');
            const filtered = (response.data as any[]).filter(c => c.id_disciplina === selectedDisciplina);
            const mapped: Alumno[] = filtered.map(c => ({
                id_cliente: c.id_cliente || c.id,
                nombre: c.nombre,
                apellido: c.apellido,
                fecha_registro: c.fecha_registro || new Date().toISOString(),
                fecha_ultimo_pago: c.fecha_ultimo_pago || null,
                activo: c.activo !== false,
                id_disciplina: c.id_disciplina,
                estado: deriveEstado(c.activo !== false, c.fecha_ultimo_pago || null),
            }));
            setAlumnos(mapped);
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    }, [selectedDisciplina, navigate]);

    useEffect(() => { fetchAlumnos(); }, [fetchAlumnos]);

    // Change estado (Al día / Pendiente / Inactivo)
    const handleEstadoChange = async (id: number, nuevoEstado: EstadoAlumno) => {
        setUpdatingId(id);
        const prev = alumnos.find(a => a.id_cliente === id);
        // Optimistic
        setAlumnos(prev2 => prev2.map(a => a.id_cliente === id ? { ...a, estado: nuevoEstado } : a));
        try {
            await api.put(`/clientes/${id}`, estadoToPayload(nuevoEstado));
        } catch {
            // Rollback
            if (prev) setAlumnos(p => p.map(a => a.id_cliente === id ? { ...a, estado: prev.estado } : a));
            alert('Error al actualizar el estado.');
        } finally {
            setUpdatingId(null);
        }
    };

    // Create / Edit
    const handleSave = async (data: { nombre: string; apellido: string }) => {
        try {
            if (editingAlumno) {
                await api.put(`/clientes/${editingAlumno.id_cliente}`, { nombre: data.nombre, apellido: data.apellido, id_disciplina: selectedDisciplina });
            } else {
                await api.post('/clientes', { nombre: data.nombre, apellido: data.apellido, id_disciplina: selectedDisciplina, dni: null, fecha_nacimiento: null, grupo_sanguineo: null, id_profesor_que_cargo: null });
            }
            await fetchAlumnos();
            setIsFormOpen(false);
            setEditingAlumno(null);
        } catch {
            alert('Error al guardar el alumno.');
        }
    };

    // Delete
    const handleConfirmDelete = async () => {
        if (!deletingAlumno) return;
        try {
            await api.delete(`/clientes/${deletingAlumno.id_cliente}`);
            await fetchAlumnos();
        } catch {
            alert('Error al eliminar el alumno.');
        } finally {
            setDeletingAlumno(null);
            setIsDeleteOpen(false);
        }
    };

    const STATUS_ORDER: Record<EstadoAlumno, number> = { 'al día': 0, 'pendiente': 1, 'inactivo': 2 };

    const filteredAlumnos = alumnos
        .filter(a =>
            a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.apellido.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => STATUS_ORDER[a.estado] - STATUS_ORDER[b.estado]);

    const totalPages = Math.ceil(filteredAlumnos.length / PAGE_SIZE);
    const pagedAlumnos = filteredAlumnos.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    // Reset to page 1 when search or discipline changes
    useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedDisciplina]);

    if (loading && disciplinas.length === 0) {
        return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brand-red" /></div>;
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-heading font-bold text-gray-900">
                        {isAdmin ? 'Gestión de Estados' : `Mis Alumnos — ${selectedDisciplinaName}`}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {isAdmin ? 'Administrá los estados de alumnos por disciplina.' : `Gestioná los alumnos de tu disciplina: ${selectedDisciplinaName}.`}
                    </p>
                </div>
                <button
                    onClick={() => { setEditingAlumno(null); setIsFormOpen(true); }}
                    className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto justify-center"
                >
                    <Plus size={20} /><span>Agregar Alumno</span>
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                {isAdmin ? (
                    <div className="w-full sm:w-auto">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
                        <select
                            value={selectedDisciplina || ''}
                            onChange={e => {
                                const id = Number(e.target.value);
                                setSelectedDisciplina(id);
                                setSelectedDisciplinaName(disciplinas.find(d => d.id_disciplina === id)?.nombre_disciplina || '');
                            }}
                            className="w-full sm:w-64 rounded-lg border-gray-300 text-black focus:border-brand-red focus:ring-brand-red shadow-sm"
                        >
                            {disciplinas.map(d => <option key={d.id_disciplina} value={d.id_disciplina}>{d.nombre_disciplina}</option>)}
                        </select>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 font-medium">Disciplina:</span>
                        <span className="px-3 py-1 bg-brand-red/10 text-brand-red font-bold rounded-full text-sm uppercase tracking-wide">{selectedDisciplinaName}</span>
                    </div>
                )}
                <div className="w-full sm:w-auto relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar alumno..."
                        className="pl-10 w-full sm:w-64 rounded-lg border-gray-300 text-black focus:border-brand-red focus:ring-brand-red shadow-sm"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[580px]">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-heading font-bold text-gray-900 uppercase text-xs tracking-wider">Alumno</th>
                                <th className="hidden md:table-cell px-6 py-4 font-heading font-bold text-gray-900 uppercase text-xs tracking-wider">Fecha Inicio</th>
                                <th className="px-6 py-4 font-heading font-bold text-gray-900 uppercase text-xs tracking-wider">Estado</th>
                                <th className="px-6 py-4 font-heading font-bold text-gray-900 uppercase text-xs tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={4} className="px-6 py-12 text-center"><Loader2 className="w-6 h-6 animate-spin text-brand-red mx-auto" /></td></tr>
                            ) : filteredAlumnos.length > 0 ? (
                                pagedAlumnos.map(alumno => (
                                    <tr key={alumno.id_cliente} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs flex-shrink-0">
                                                    {alumno.nombre.charAt(0)}{alumno.apellido.charAt(0)}
                                                </div>
                                                <span className="font-medium text-gray-900 group-hover:text-brand-red transition-colors">
                                                    {alumno.nombre} {alumno.apellido}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell px-6 py-4 text-gray-500 text-sm">
                                            {new Date(alumno.fecha_registro).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {/* 3-state dropdown */}
                                            <select
                                                value={alumno.estado}
                                                disabled={updatingId === alumno.id_cliente}
                                                onChange={e => handleEstadoChange(alumno.id_cliente, e.target.value as EstadoAlumno)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border cursor-pointer appearance-none text-center focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition-colors",
                                                    ESTADO_CONFIG[alumno.estado].classes,
                                                    updatingId === alumno.id_cliente && "opacity-50 cursor-wait"
                                                )}
                                            >
                                                <option value="al día">Al día</option>
                                                <option value="pendiente">Pendiente</option>
                                                <option value="inactivo">Inactivo</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 text-gray-400">
                                                <button
                                                    onClick={() => { setEditingAlumno(alumno); setIsFormOpen(true); }}
                                                    className="p-1.5 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => { setDeletingAlumno(alumno); setIsDeleteOpen(true); }}
                                                    className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">No se encontraron alumnos para esta disciplina.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wide">
                        <div className="flex gap-4">
                            {(['al día', 'pendiente', 'inactivo'] as EstadoAlumno[]).map(est => (
                                <span key={est} className={cn('px-2 py-0.5 rounded-full border', ESTADO_CONFIG[est].classes)}>
                                    {ESTADO_CONFIG[est].label}: {alumnos.filter(a => a.estado === est).length}
                                </span>
                            ))}
                        </div>
                        <span>{filteredAlumnos.length} alumno{filteredAlumnos.length !== 1 ? 's' : ''}</span>
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredAlumnos.length}
                        itemsPerPage={PAGE_SIZE}
                    />
                </div>
            </div>

            <AlumnoFormModal
                isOpen={isFormOpen}
                onClose={() => { setIsFormOpen(false); setEditingAlumno(null); }}
                onSave={handleSave}
                initialData={editingAlumno}
                fixedDisciplina={selectedDisciplinaName}
            />
            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setDeletingAlumno(null); }}
                onConfirm={handleConfirmDelete}
                title="Eliminar Alumno"
                message={`¿Estás seguro de que deseas eliminar a ${deletingAlumno?.nombre} ${deletingAlumno?.apellido}?`}
                type="danger"
            />
        </div>
    );
}
