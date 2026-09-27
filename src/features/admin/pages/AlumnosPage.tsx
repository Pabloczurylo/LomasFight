import { useState, useEffect, Fragment } from 'react';
import { ClienteBackend } from '../types';
import { cn } from '../../../lib/utils';
import { Search, Plus, Pencil, Trash2, Loader2, PhoneCall, AlertCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import StudentModal, { StudentFormData } from '../components/StudentModal';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { Pagination } from '../../../components/ui/Pagination';
import { api } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

const PAGE_SIZE = 10;

// ─── Types ──────────────────────────────────────────────────────────────────────

interface DisciplinaOption { id_disciplina: number; nombre_disciplina: string; }
interface ProfesorOption { id_profesor: number; nombre: string; apellido: string; id_disciplina: number; }

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
    fechaVencimiento: string | null;
    fechaNacimiento: string | null;
    grupoSanguineo: string | null;
    id_profesor_que_cargo: number | null;
    profesorNombre: string | null;
    numeroCelular: string | null;
    numeroCelularEmergencia: string | null;
    alergiaMedicamento: string | null;
    tiempoEntrenamiento: string | null;
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function deriveEstado(inactivo: boolean, fecha_vencimiento: string | null): EstadoPago {
    if (inactivo) return 'inactivo';
    if (!fecha_vencimiento) return 'pendiente';
    const vencimiento = new Date(fecha_vencimiento);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return vencimiento >= hoy ? 'al día' : 'pendiente';
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
    const [profesores,           setProfesores]        = useState<ProfesorOption[]>([]);
    const [searchTerm,           setSearchTerm]        = useState('');
    const [selectedDisciplina,   setSelectedDisciplina] = useState<string>('Todas');
    const [selectedProfesor,     setSelectedProfesor]   = useState<string>('Todos');
    const [mostrarPendientes,    setMostrarPendientes]  = useState(false);
    const [isLoading,            setIsLoading]         = useState(true);
    const [error,                setError]             = useState<string | null>(null);
    const [currentPage,          setCurrentPage]       = useState(1);
    const [expandedId,           setExpandedId]        = useState<string | null>(null);
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
            const [clientesRes, discRes, profRes] = await Promise.allSettled([
                api.get<ClienteBackend[]>('/clientes'),
                api.get('/diciplinas'),
                api.get<ProfesorOption[]>('/profesores'),
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
            const profData: ProfesorOption[] = profRes.status === 'fulfilled' ? profRes.value.data : [];

            setDisciplinas(discData);
            setProfesores(profData);

            const rows: AlumnoRow[] = clientesRes.value.data.map(c => {
                const prof = (c as any).profesores;
                return {
                    id:                      String(c.id_cliente),
                    nombre:                  c.nombre,
                    apellido:                c.apellido,
                    dni:                     c.dni || null,
                    domicilio:               c.domicilio || null,
                    disciplinaNombre:        c.disciplinas?.nombre_disciplina || '-',
                    id_disciplina:           c.id_disciplina,
                    estadoPago:              deriveEstado(c.inactivo === true, c.fecha_vencimiento || null),
                    fechaUltimoPago:         c.fecha_ultimo_pago || null,
                    fechaVencimiento:        c.fecha_vencimiento || null,
                    fechaNacimiento:         c.fecha_nacimiento  || null,
                    grupoSanguineo:          c.grupo_sanguineo   || null,
                    id_profesor_que_cargo:   c.id_profesor_que_cargo || null,
                    profesorNombre:          prof ? `${prof.nombre} ${prof.apellido}` : null,
                    numeroCelular:           c.numero_celular || null,
                    numeroCelularEmergencia: c.numero_celular_emergencia || null,
                    alergiaMedicamento:      c.alergia_medicamento || null,
                    tiempoEntrenamiento:     c.tiempo_entrenamiento || null,
                };
            });

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
                (a.numeroCelular || '').includes(searchTerm) ||
                (a.numeroCelularEmergencia || '').includes(searchTerm) ||
                (a.alergiaMedicamento || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (a.tiempoEntrenamiento || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (a.dni || '').includes(searchTerm);
            const matchesDisciplina =
                selectedDisciplina === 'Todas' || a.disciplinaNombre === selectedDisciplina;
            const matchesProfesor =
                selectedProfesor === 'Todos' ||
                (selectedProfesor === 'sin_asignar' ? !a.id_profesor_que_cargo : a.profesorNombre === selectedProfesor);
            const matchesPendientes = !mostrarPendientes || a.estadoPago === 'pendiente';
            return matchesSearch && matchesDisciplina && matchesProfesor && matchesPendientes;
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
        id:                          editingAlumno.id,
        nombre:                      editingAlumno.nombre,
        apellido:                    editingAlumno.apellido,
        id_disciplina:               editingAlumno.id_disciplina,
        estadoPago:                  editingAlumno.estadoPago,
        dni:                         editingAlumno.dni,
        fecha_nacimiento:            editingAlumno.fechaNacimiento,
        grupo_sanguineo:             editingAlumno.grupoSanguineo,
        domicilio:                   editingAlumno.domicilio,
        id_profesor_que_cargo:       editingAlumno.id_profesor_que_cargo,
        numero_celular:              editingAlumno.numeroCelular,
        numero_celular_emergencia:   editingAlumno.numeroCelularEmergencia,
        alergia_medicamento:         editingAlumno.alergiaMedicamento,
        tiempo_entrenamiento:        editingAlumno.tiempoEntrenamiento,
    } : undefined;

    const handleSave = (data: StudentFormData) => {
        if (editingAlumno) {
            setPendingData(data);
            setIsSaveConfirmOpen(true);
        } else {
            // Create immediately
            const payload: any = {
                nombre:                    data.nombre,
                apellido:                  data.apellido,
                id_disciplina:             data.id_disciplina,
                dni:                       data.dni,
                fecha_nacimiento:          data.fecha_nacimiento,
                grupo_sanguineo:           data.grupo_sanguineo,
                domicilio:                 data.domicilio,
                id_profesor_que_cargo:     data.id_profesor_que_cargo ?? null,
                numero_celular:            data.numero_celular,
                numero_celular_emergencia: data.numero_celular_emergencia,
                alergia_medicamento:       data.alergia_medicamento,
                tiempo_entrenamiento:      data.tiempo_entrenamiento,
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
            const ahora = new Date();

            // Calcular fecha_vencimiento según la lógica inteligente
            let fecha_ultimo_pago: string | null = null;
            let fecha_vencimiento: string | null = null;

            if (pendingData.estadoPago === 'al día') {
                fecha_ultimo_pago = ahora.toISOString();
                // Si estaba inactivo: resetear desde hoy + 31 días
                if (editingAlumno.estadoPago === 'inactivo') {
                    const fv = new Date(ahora);
                    fv.setDate(fv.getDate() + 31);
                    fecha_vencimiento = fv.toISOString();
                } else if (editingAlumno.fechaVencimiento) {
                    // Si tenía vencimiento previo: sumar 31 días desde ahí
                    const fv = new Date(editingAlumno.fechaVencimiento);
                    fv.setDate(fv.getDate() + 31);
                    fecha_vencimiento = fv.toISOString();
                } else {
                    // Sin vencimiento previo: hoy + 31
                    const fv = new Date(ahora);
                    fv.setDate(fv.getDate() + 31);
                    fecha_vencimiento = fv.toISOString();
                }
            }

            await api.put(`/clientes/${editingAlumno.id}`, {
                nombre:                    pendingData.nombre,
                apellido:                  pendingData.apellido,
                id_disciplina:             pendingData.id_disciplina,
                activo:                    true,
                inactivo,
                fecha_ultimo_pago,
                fecha_vencimiento,
                dni:                       pendingData.dni,
                fecha_nacimiento:          pendingData.fecha_nacimiento,
                grupo_sanguineo:           pendingData.grupo_sanguineo,
                domicilio:                 pendingData.domicilio,
                id_profesor_que_cargo:     pendingData.id_profesor_que_cargo ?? null,
                numero_celular:            pendingData.numero_celular,
                numero_celular_emergencia: pendingData.numero_celular_emergencia,
                alergia_medicamento:       pendingData.alergia_medicamento,
                tiempo_entrenamiento:      pendingData.tiempo_entrenamiento,
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

                    {/* Professor filter */}
                    <select
                        className="rounded-lg border border-gray-300 focus:border-brand-red focus:ring-1 focus:ring-brand-red py-2 px-3 text-gray-900 bg-white"
                        value={selectedProfesor}
                        onChange={e => { setSelectedProfesor(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="Todos">Todos los profesores</option>
                        <option value="sin_asignar">Sin profesor asignado</option>
                        {profesores.map(p => (
                            <option key={p.id_profesor} value={`${p.nombre} ${p.apellido}`}>
                                {p.nombre} {p.apellido}
                            </option>
                        ))}
                    </select>

                    {/* Show pending checkbox */}
                    <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-semibold text-gray-700 hover:text-brand-red transition-colors bg-gray-50 hover:bg-gray-100/80 px-3 py-2 rounded-lg border border-gray-200 whitespace-nowrap">
                        <input
                            type="checkbox"
                            checked={mostrarPendientes}
                            onChange={e => { setMostrarPendientes(e.target.checked); setCurrentPage(1); }}
                            className="rounded border-gray-300 text-brand-red focus:ring-brand-red h-4 w-4 cursor-pointer transition-all"
                        />
                        <span>Mostrar pendientes</span>
                    </label>

                    {/* Pending badge */}
                    {pendientesCount > 0 && (
                        <div className="flex items-center gap-1 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm font-semibold whitespace-nowrap">
                            <span>{pendientesCount}</span>
                            <span>pendiente{pendientesCount !== 1 ? 's' : ''}</span>
                        </div>
                    )}
                </div>

                <div className="w-full overflow-x-auto rounded-lg">
                    <table className="w-full min-w-[1100px] text-left">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="pb-3 pt-3 pl-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Nombre</th>
                                <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider">Profesor</th>
                                <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider">Celular</th>
                                <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider">Cel. Emergencia</th>
                                <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider">Alergias</th>
                                <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider">Tiempo Entr.</th>
                                <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider">Domicilio</th>
                                <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider">Disciplina</th>
                                <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider">Fecha Nac.</th>
                                <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider">Grupo</th>
                                <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider">Estado</th>
                                <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider">Vencimiento</th>
                                <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider text-right pr-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paged.map(a => (
                                <Fragment key={a.id}>
                                    <tr className={cn(
                                        "group hover:bg-gray-50 transition-colors",
                                        expandedId === a.id && "bg-red-50/20"
                                    )}>
                                        <td className="py-4 pl-4 font-medium text-gray-900 group-hover:text-brand-red transition-colors cursor-pointer"
                                            onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}>
                                            <div className="flex items-center gap-2">
                                                <span>{a.nombre} {a.apellido}</span>
                                                <button
                                                    type="button"
                                                    className="text-gray-400 hover:text-brand-red transition-colors"
                                                    title={expandedId === a.id ? "Cerrar ficha" : "Ver ficha"}
                                                >
                                                    {expandedId === a.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-4 text-gray-500 text-sm whitespace-nowrap">{a.profesorNombre || <span className="text-gray-300">—</span>}</td>
                                        <td className="py-4 text-gray-700 text-sm whitespace-nowrap">
                                            {a.numeroCelular ? (
                                                <span className="font-medium text-gray-900">{a.numeroCelular}</span>
                                            ) : <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="py-4 text-sm whitespace-nowrap">
                                            {a.numeroCelularEmergencia ? (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                                                    <PhoneCall size={12} className="text-red-500 flex-shrink-0" />
                                                    <span>{a.numeroCelularEmergencia}</span>
                                                </span>
                                            ) : <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="py-4 text-sm max-w-[160px]">
                                            {a.alergiaMedicamento ? (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 truncate" title={a.alergiaMedicamento}>
                                                    <AlertCircle size={12} className="text-amber-600 flex-shrink-0" />
                                                    <span className="truncate">{a.alergiaMedicamento}</span>
                                                </span>
                                            ) : <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="py-4 text-sm whitespace-nowrap">
                                            {a.tiempoEntrenamiento ? (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                                    <Clock size={11} className="text-gray-500 flex-shrink-0" />
                                                    <span>{a.tiempoEntrenamiento}</span>
                                                </span>
                                            ) : <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="py-4 text-gray-500 text-sm max-w-[150px] truncate" title={a.domicilio || undefined}>{dash(a.domicilio)}</td>
                                        <td className="py-4 text-gray-600 text-sm whitespace-nowrap">{a.disciplinaNombre}</td>
                                        <td className="py-4 text-gray-500 text-sm whitespace-nowrap">
                                            {a.fechaNacimiento ? new Date(a.fechaNacimiento).toLocaleDateString('es-AR') : '-'}
                                        </td>
                                        <td className="py-4 text-gray-500 text-sm whitespace-nowrap">{dash(a.grupoSanguineo)}</td>
                                        <td className="py-4 whitespace-nowrap">
                                            <span className={cn(
                                                'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide',
                                                STATUS_BADGE[a.estadoPago]
                                            )}>
                                                {STATUS_LABEL[a.estadoPago]}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm whitespace-nowrap">
                                            {a.fechaVencimiento ? (
                                                <span className={cn(
                                                    'font-medium',
                                                    new Date(a.fechaVencimiento) < new Date() ? 'text-red-600' : 'text-gray-600'
                                                )}>
                                                    {new Date(a.fechaVencimiento).toLocaleDateString('es-AR')}
                                                </span>
                                            ) : (
                                                <span className="text-gray-300">—</span>
                                            )}
                                        </td>
                                        <td className="py-4 pr-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                                                    className={cn(
                                                        "p-1.5 text-gray-500 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors",
                                                        expandedId === a.id && "bg-red-50 text-brand-red"
                                                    )}
                                                    title={expandedId === a.id ? "Cerrar ficha" : "Ver ficha completa"}
                                                >
                                                    {expandedId === a.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </button>
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
                                    {expandedId === a.id && (
                                        <tr className="bg-red-50/20 border-b border-gray-100">
                                            <td colSpan={13} className="px-6 py-4">
                                                <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                                    <div className="space-y-1.5 bg-gray-50/60 p-3 rounded-lg border border-gray-100">
                                                        <span className="font-bold text-gray-700 uppercase tracking-wider block text-[11px]">📞 Contacto</span>
                                                        <div className="text-gray-900 font-medium">
                                                            <span className="text-gray-500 font-normal">Celular: </span>
                                                            {a.numeroCelular || <span className="text-gray-400">Sin registrar</span>}
                                                        </div>
                                                        <div className="text-red-700 font-medium flex items-center gap-1">
                                                            <span className="text-gray-500 font-normal">Emergencia (SOS): </span>
                                                            {a.numeroCelularEmergencia || <span className="text-gray-400 font-normal">Sin registrar</span>}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5 bg-gray-50/60 p-3 rounded-lg border border-gray-100">
                                                        <span className="font-bold text-gray-700 uppercase tracking-wider block text-[11px]">🏥 Salud</span>
                                                        <div className="text-amber-800 font-medium">
                                                            <span className="text-gray-500 font-normal">Alergias a Medicamentos: </span>
                                                            {a.alergiaMedicamento || <span className="text-gray-500 font-normal">Ninguna declarada</span>}
                                                        </div>
                                                        <div className="text-gray-700">
                                                            <span className="text-gray-500">Grupo Sanguíneo: </span>
                                                            {a.grupoSanguineo || '—'}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5 bg-gray-50/60 p-3 rounded-lg border border-gray-100">
                                                        <span className="font-bold text-gray-700 uppercase tracking-wider block text-[11px]">🥋 Entrenamiento</span>
                                                        <div className="text-gray-900 font-medium">
                                                            <span className="text-gray-500 font-normal">Tiempo de Entr.: </span>
                                                            {a.tiempoEntrenamiento || 'No especificado'}
                                                        </div>
                                                        <div className="text-gray-700">
                                                            <span className="text-gray-500">Disciplina: </span>
                                                            {a.disciplinaNombre}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5 bg-gray-50/60 p-3 rounded-lg border border-gray-100">
                                                        <span className="font-bold text-gray-700 uppercase tracking-wider block text-[11px]">📍 Personal & Cuota</span>
                                                        <div className="text-gray-700">
                                                            <span className="text-gray-500">Domicilio: </span>
                                                            {a.domicilio || '—'}
                                                        </div>
                                                        <div className="text-gray-700">
                                                            <span className="text-gray-500">Profesor: </span>
                                                            {a.profesorNombre || 'Sin asignar'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={13} className="py-8 text-center text-gray-500">No se encontraron alumnos.</td></tr>
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
                profesores={profesores}
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
