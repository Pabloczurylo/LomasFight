import { useState, useEffect } from 'react';
import { ClienteBackend } from '../types';
import { cn } from '../../../lib/utils';
import { Search, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import StudentModal, { StudentFormData } from '../components/StudentModal';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { Pagination } from '../../../components/ui/Pagination';
import { api } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

const PAGE_SIZE = 10;

// ─── Types ──────────────────────────────────────────────────────────────────────

interface DisciplinaOption { id_disciplina: number; nombre_disciplina: string; }

type EstadoPago = 'al día' | 'pendiente' | 'inactivo';

interface AlumnoRow {
    id: string;
    nombre: string;
    apellido: string;
    dni: string | null;
    domicilio: string | null;
    disciplinaNombre: string;
    id_disciplina: number;
    estadoPago: EstadoPago;
    fechaUltimoPago: string | null;
    fechaNacimiento: string | null;
    grupoSanguineo: string | null;
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function deriveEstado(inactivo: boolean, fecha_ultimo_pago: string | null): EstadoPago {
    if (inactivo) return 'inactivo';
    if (!fecha_ultimo_pago) return 'pendiente';
    const diffDays = (Date.now() - new Date(fecha_ultimo_pago).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 31 ? 'al día' : 'pendiente';
}

const dash = (v: string | null | undefined) => v || '-';

const STATUS_BADGE: Record<EstadoPago, string> = {
    'al día':   'bg-green-100 text-green-700',
    'pendiente':'bg-yellow-100 text-yellow-700',
    'inactivo': 'bg-gray-100 text-gray-500',
};
const STATUS_LABEL: Record<EstadoPago, string> = {
    'al día':   'Al día',
    'pendiente':'Pendiente',
    'inactivo': 'Inactivo',
};
const STATUS_ORDER: Record<EstadoPago, number> = { 'al día': 0, 'pendiente': 1, 'inactivo': 2 };

// ─── Component ──────────────────────────────────────────────────────────────────

export default function AlumnosPage() {
    const [alumnos,              setAlumnos]           = useState<AlumnoRow[]>([]);
    const [disciplinas,          setDisciplinas]       = useState<DisciplinaOption[]>([]);
    const [searchTerm,           setSearchTerm]        = useState('');
    const [selectedDisciplina,   setSelectedDisciplina] = useState<string>('Todas');
    const [isLoading,            setIsLoading]         = useState(true);
    const [error,                setError]             = useState<string | null>(null);
    const [currentPage,          setCurrentPage]       = useState(1);
    const navigate = useNavigate();

    // Modal state
    const [isModalOpen,   setIsModalOpen]   = useState(false);
    const [editingAlumno, setEditingAlumno] = useState<AlumnoRow | null>(null);

    // Confirm modals
    const [alumnoToDelete,     setAlumnoToDelete]     = useState<AlumnoRow | null>(null);
    const [isDeleteOpen,       setIsDeleteOpen]       = useState(false);
    const [pendingData,        setPendingData]         = useState<StudentFormData | null>(null);
    const [isSaveConfirmOpen,  setIsSaveConfirmOpen]  = useState(false);

    // ── Fetch ──────────────────────────────────────────────────────────────────

    const fetchAll = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [clientesRes, discRes] = await Promise.allSettled([
                api.get<ClienteBackend[]>('/clientes'),
                api.get('/diciplinas'),
            ]);

            if (clientesRes.status === 'rejected') {
                if (clientesRes.reason instanceof AxiosError && clientesRes.reason.response?.status === 401) {
                    localStorage.clear();
                    navigate('/login');
                    return;
                }
                throw clientesRes.reason;
            }

            const discData: DisciplinaOption[] = discRes.status === 'fulfilled' ? discRes.value.data : [];

            setDisciplinas(discData);

            const rows: AlumnoRow[] = clientesRes.value.data.map(c => ({
                id:              String(c.id_cliente),
                nombre:          c.nombre,
                apellido:        c.apellido,
                dni:             c.dni || null,
                domicilio:       c.domicilio || null,
                disciplinaNombre:c.disciplinas?.nombre_disciplina || '-',
                id_disciplina:   c.id_disciplina,
                estadoPago:      deriveEstado(c.inactivo === true, c.fecha_ultimo_pago || null),
                fechaUltimoPago: c.fecha_ultimo_pago || null,
                fechaNacimiento: c.fecha_nacimiento  || null,
                grupoSanguineo:  c.grupo_sanguineo   || null,
            }));

            setAlumnos(rows);
        } catch (err) {
            console.error('Error fetching alumnos:', err);
            setError('Error al cargar los alumnos. Por favor, intente nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    // ── Derived list ──────────────────────────────────────────────────────────

    const filtered = alumnos
        .filter(a => {
            const matchesSearch =
                a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (a.dni || '').includes(searchTerm);
            const matchesDisciplina =
                selectedDisciplina === 'Todas' || a.disciplinaNombre === selectedDisciplina;
            return matchesSearch && matchesDisciplina;
        })
        .sort((a, b) => (STATUS_ORDER[a.estadoPago] ?? 3) - (STATUS_ORDER[b.estadoPago] ?? 3));

    const pendientesCount = filtered.filter(a => a.estadoPago === 'pendiente').length;

    const totalPages  = Math.ceil(filtered.length / PAGE_SIZE);
    const paged       = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleAdd  = () => { setEditingAlumno(null); setIsModalOpen(true); };
    const handleEdit = (a: AlumnoRow) => { setEditingAlumno(a); setIsModalOpen(true); };

    // Build initialData for the modal from an AlumnoRow
    const modalInitialData = editingAlumno ? {
        id:                    editingAlumno.id,
        nombre:                editingAlumno.nombre,
        apellido:              editingAlumno.apellido,
        id_disciplina:         editingAlumno.id_disciplina,
        estadoPago:            editingAlumno.estadoPago,
        dni:                   editingAlumno.dni,
        fecha_nacimiento:      editingAlumno.fechaNacimiento,
        grupo_sanguineo:       editingAlumno.grupoSanguineo,
        domicilio:             editingAlumno.domicilio,
    } : undefined;

    const handleSave = (data: StudentFormData) => {
        if (editingAlumno) {
            setPendingData(data);
            setIsSaveConfirmOpen(true);
        } else {
            // Create immediately
            const payload = {
                nombre:           data.nombre,
                apellido:         data.apellido,
                id_disciplina:    data.id_disciplina,
                dni:              data.dni,
                fecha_nacimiento: data.fecha_nacimiento,
                grupo_sanguineo:  data.grupo_sanguineo,
                domicilio:        data.domicilio,
            };
            api.post('/clientes', payload)
                .then(() => { fetchAll(); setIsModalOpen(false); })
                .catch(e => { console.error(e); alert('Error al crear el alumno.'); });
        }
    };

    const confirmSave = async () => {
        if (!pendingData || !editingAlumno) return;
        try {
            const inactivo = pendingData.estadoPago === 'inactivo';
            const fecha_ultimo_pago = pendingData.estadoPago === 'al día'
                ? new Date().toISOString() : null;

            await api.put(`/clientes/${editingAlumno.id}`, {
                nombre:           pendingData.nombre,
                apellido:         pendingData.apellido,
                id_disciplina:    pendingData.id_disciplina,
                activo:           true,
                inactivo,
                fecha_ultimo_pago,
                dni:              pendingData.dni,
                fecha_nacimiento: pendingData.fecha_nacimiento,
                grupo_sanguineo:  pendingData.grupo_sanguineo,
                domicilio:        pendingData.domicilio,
            });
            await fetchAll();
            setIsSaveConfirmOpen(false);
            setPendingData(null);
            setIsModalOpen(false);
        } catch (e) {
            console.error(e);
            alert('Error al actualizar el alumno.');
        }
    };

    const handleDeleteClick = (a: AlumnoRow) => { setAlumnoToDelete(a); setIsDeleteOpen(true); };

    const confirmDelete = async () => {
        if (!alumnoToDelete) return;
        try {
            await api.delete(`/clientes/${alumnoToDelete.id}`);
            await fetchAll();
            setAlumnoToDelete(null);
            setIsDeleteOpen(false);
        } catch (e) {
            console.error(e);
            alert('Error al eliminar el alumno.');
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────

    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-64 text-red-600"><p>{error}</p></div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
                <h2 className="text-3xl font-heading font-bold text-gray-900">Gestión de Alumnos</h2>
                <button onClick={handleAdd}
                    className="flex items-center justify-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto">
                    <Plus size={20} /><span>Agregar Alumno</span>
                </button>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="mb-6 flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="text" placeholder="Buscar por nombre, apellido o DNI..."
                            className="pl-10 w-full rounded-lg border border-gray-300 focus:border-brand-red focus:ring-1 focus:ring-brand-red py-2 text-gray-900 placeholder:text-gray-500"
                            value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                    </div>

                    {/* Discipline filter */}
                    <select
                        className="rounded-lg border border-gray-300 focus:border-brand-red focus:ring-1 focus:ring-brand-red py-2 px-3 text-gray-900 bg-white"
                        value={selectedDisciplina}
                        onChange={e => { setSelectedDisciplina(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="Todas">Todas las disciplinas</option>
                        {disciplinas.map(d => (
                            <option key={d.id_disciplina} value={d.nombre_disciplina}>
                                {d.nombre_disciplina}
                            </option>
                        ))}
                    </select>

                    {/* Pending badge */}
                    {pendientesCount > 0 && (
                        <div className="flex items-center gap-1 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm font-semibold whitespace-nowrap">
                            <span>{pendientesCount}</span>
                            <span>pendiente{pendientesCount !== 1 ? 's' : ''}</span>
                        </div>
                    )}
                </div>

                <div className="w-full overflow-x-auto rounded-lg">
                    <table className="w-full min-w-[800px] text-left">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="pb-3 pt-3 pl-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Nombre</th>
                                <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider">DNI</th>
                                <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider">Domicilio</th>
                                <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider">Disciplina</th>
                                <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider">Fecha Nac.</th>
                                <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider">Grupo</th>
                                <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider">Estado</th>
                                <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider text-right pr-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paged.map(a => (
                                <tr key={a.id} className="group hover:bg-gray-50 transition-colors">
                                    <td className="py-4 pl-4 font-medium text-gray-900 group-hover:text-brand-red transition-colors">
                                        {a.nombre} {a.apellido}
                                    </td>
                                    <td className="py-4 text-gray-500 text-sm">{dash(a.dni)}</td>
                                    <td className="py-4 text-gray-500 text-sm">{dash(a.domicilio)}</td>
                                    <td className="py-4 text-gray-600 text-sm">{a.disciplinaNombre}</td>
                                    <td className="py-4 text-gray-500 text-sm">
                                        {a.fechaNacimiento ? new Date(a.fechaNacimiento).toLocaleDateString('es-AR') : '-'}
                                    </td>
                                    <td className="py-4 text-gray-500 text-sm">{dash(a.grupoSanguineo)}</td>
                                    <td className="py-4">
                                        <span className={cn(
                                            'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide',
                                            STATUS_BADGE[a.estadoPago]
                                        )}>
                                            {STATUS_LABEL[a.estadoPago]}
                                        </span>
                                    </td>
                                    <td className="py-4 pr-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleEdit(a)}
                                                className="p-1.5 text-gray-500 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors" title="Editar">
                                                <Pencil size={18} />
                                            </button>
                                            <button onClick={() => handleDeleteClick(a)}
                                                className="p-1.5 text-gray-500 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={8} className="py-8 text-center text-gray-500">No se encontraron alumnos.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="px-4">
                <Pagination currentPage={currentPage} totalPages={totalPages}
                    onPageChange={setCurrentPage} totalItems={filtered.length} itemsPerPage={PAGE_SIZE} />
            </div>

            <StudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={modalInitialData}
                onDelete={editingAlumno ? () => { handleDeleteClick(editingAlumno); setIsModalOpen(false); } : undefined}
                disciplinas={disciplinas}
            />

            <ConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete} title="Eliminar Alumno"
                message={`¿Estás seguro de que deseas eliminar a ${alumnoToDelete?.nombre} ${alumnoToDelete?.apellido}?`}
                type="danger" />

            <ConfirmModal isOpen={isSaveConfirmOpen} onClose={() => setIsSaveConfirmOpen(false)}
                onConfirm={confirmSave} title="Confirmar Edición"
                message="¿Deseas guardar los cambios realizados?"
                type="success" />
        </div>
    );
}
