import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, DollarSign, AlertCircle, Calendar, Edit2, Trash2, ArrowDown, Activity } from 'lucide-react';
import { ClienteBackend, Disciplina, PagoBackend, PagoDisciplinaBackend, GastoBackend, UnifiedPago } from '../types';
import { cn } from '../../../lib/utils';
import RegistroPagoModal, { CuotaPayload, GastoPayload } from '../components/RegistroPagoModal';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { api } from '../../../services/api';

const MESES = [
    'Todos', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function PagosPage() {
    const [pagos, setPagos] = useState<UnifiedPago[]>([]);
    const [clientes, setClientes] = useState<ClienteBackend[]>([]);
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('Todos');
    const [filterTipo, setFilterTipo] = useState<'TODOS' | 'CUOTA' | 'ALQUILER' | 'ENTRADA' | 'GASTO'>('TODOS');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPago, setEditingPago] = useState<UnifiedPago | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; pago: UnifiedPago | null }>({ isOpen: false, pago: null });

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch dependencies with individual error handling
            const [clientesRes, disciplinasRes] = await Promise.allSettled([
                api.get('/clientes'),
                api.get('/diciplinas')
            ]);

            const clientesData = clientesRes.status === 'fulfilled' ? clientesRes.value.data : [];
            const disciplinasData = disciplinasRes.status === 'fulfilled' ? disciplinasRes.value.data : [];

            setClientes(clientesData);
            setDisciplinas(disciplinasData);

            if (clientesRes.status === 'rejected') console.error("Error fetching clientes:", clientesRes.reason);
            if (disciplinasRes.status === 'rejected') console.error("Error fetching disciplinas:", disciplinasRes.reason);

            // Fetch payments and gastos with individual error handling
            const [pagosRes, pagosDisciplinaRes, gastosRes] = await Promise.allSettled([
                api.get('/pagos'),
                api.get('/pago-disciplina'),
                api.get('/gastos')
            ]);

            const cuotas: PagoBackend[] = pagosRes.status === 'fulfilled' ? pagosRes.value.data : [];
            const alquileres: PagoDisciplinaBackend[] = pagosDisciplinaRes.status === 'fulfilled' ? pagosDisciplinaRes.value.data : [];
            const gastos: GastoBackend[] = gastosRes.status === 'fulfilled' ? gastosRes.value.data : [];

            if (pagosRes.status === 'rejected') console.error("Error fetching pagos:", pagosRes.reason);
            if (pagosDisciplinaRes.status === 'rejected') console.error("Error fetching pagos-disciplina:", pagosDisciplinaRes.reason);
            if (gastosRes.status === 'rejected') console.error("Error fetching gastos:", gastosRes.reason);

            // Normalize
            const normalizedCuotas: UnifiedPago[] = cuotas.map(c => ({
                id: `cuota-${c.id_pago}`,
                tipo: 'CUOTA',
                fecha: c.fecha_pago,
                concepto: c.clientes ? `${c.clientes.nombre} ${c.clientes.apellido}` : `Cliente ID: ${c.id_cliente}`,
                monto: Number(c.monto),
                estado: 'Pagado',
                originalId: c.id_pago,
                disciplinaNombre: c.disciplinas?.nombre_disciplina,
                idCliente: c.id_cliente
            }));

            const normalizedAlquileres: UnifiedPago[] = alquileres.map(a => ({
                id: `alquiler-${a.id_pago_disciplina}`,
                tipo: 'ALQUILER',
                fecha: a.fecha_pago,
                concepto: a.disciplinas ? `Alquiler - ${a.disciplinas.nombre_disciplina}` : `Alquiler - Disciplina ID: ${a.id_disciplina}`,
                monto: Number(a.monto_cuota),
                estado: 'Pagado',
                originalId: a.id_pago_disciplina,
                disciplinaNombre: a.disciplinas?.nombre_disciplina
            }));

            const normalizedGastos: UnifiedPago[] = gastos.map(g => {
                const isEntrada = g.concepto.startsWith('[ENTRADA] ');
                return {
                    id: isEntrada ? `entrada-${g.id_gasto}` : `gasto-${g.id_gasto}`,
                    tipo: isEntrada ? 'ENTRADA' : 'GASTO',
                    fecha: g.fecha_gasto,
                    concepto: isEntrada ? g.concepto.replace('[ENTRADA] ', '') : g.concepto,
                    monto: Number(g.monto),
                    estado: 'Pagado',
                    originalId: g.id_gasto
                };
            });

            const allPagos = [...normalizedCuotas, ...normalizedAlquileres, ...normalizedGastos];

            // Sort by Date DESC
            allPagos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

            setPagos(allPagos);
        } catch (error) {
            console.error("Error inesperado cargando datos de pagos:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Métricas
    const metrics = useMemo(() => {
        const currentMonthIndex = new Date().getMonth() + 1;
        const targetMonth = MESES[currentMonthIndex];

        let totalIngresos = 0;
        let totalGastos = 0;
        let pendientes = 0;
        let totalAlquileres = 0;

        pagos.forEach(p => {
            const pDate = new Date(p.fecha);
            const pMonth = MESES[pDate.getMonth() + 1];
            const isCurrentMonth = targetMonth === 'Todos' || pMonth === targetMonth;

            if (p.tipo === 'GASTO' && isCurrentMonth) {
                totalGastos += p.monto;
            } else if ((p.tipo === 'CUOTA' || p.tipo === 'ENTRADA') && p.estado === 'Pagado' && isCurrentMonth) {
                totalIngresos += p.monto;
            }

            if (p.tipo === 'ALQUILER' && p.estado === 'Pagado' && isCurrentMonth) {
                totalAlquileres += p.monto;
                totalIngresos += p.monto; // Old alquileres should also count to ingresos
            }
        });

        // Deudores: basado en fecha_vencimiento
        const activeStudents = clientes.filter(c => c.activo && !c.inactivo);
        activeStudents.forEach(student => {
            const fv = student.fecha_vencimiento;
            const isPendiente = !fv || new Date(fv) < new Date();
            if (isPendiente) pendientes++;
        });

        const balance = totalIngresos - totalGastos;

        return { totalIngresos, totalGastos, balance, pendientes, totalAlquileres };
    }, [pagos, clientes]);

    const filteredPagos = pagos.filter(pago => {
        const matchesSearch = pago.concepto.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesMonth = true;
        if (selectedMonth !== 'Todos' && pago.fecha) {
            const date = new Date(pago.fecha);
            const pMonth = MESES[date.getMonth() + 1];
            matchesMonth = pMonth === selectedMonth;
        }

        const matchesTipo = filterTipo === 'TODOS' || pago.tipo === filterTipo;

        return matchesSearch && matchesMonth && matchesTipo;
    });

    const handleSaveCuota = async (payload: CuotaPayload) => {
        try {
            if (editingPago && editingPago.tipo === 'CUOTA') {
                await api.put(`/pagos/${editingPago.originalId}`, payload);
            } else {
                await api.post('/pagos', payload);
            }
            setIsModalOpen(false);
            setEditingPago(null);
            fetchData();
        } catch (error) {
            console.error("Error guarding cuota:", error);
            alert("Error al guardar la cuota.");
        }
    };

    const handleSaveGasto = async (payload: GastoPayload) => {
        try {
            if (editingPago && editingPago.tipo === 'GASTO') {
                await api.put(`/gastos/${editingPago.originalId}`, payload);
            } else {
                await api.post('/gastos', payload);
            }
            setIsModalOpen(false);
            setEditingPago(null);
            fetchData();
        } catch (error) {
            console.error("Error guarding gasto:", error);
            alert("Error al guardar el gasto.");
        }
    };

    const handleDeleteClick = (pago: UnifiedPago) => {
        setDeleteModal({ isOpen: true, pago });
    };

    const handleConfirmDelete = async () => {
        const pago = deleteModal.pago;
        if (!pago) return;

        try {
            if (pago.tipo === 'CUOTA') {
                await api.delete(`/pagos/${pago.originalId}`);
            } else if (pago.tipo === 'ALQUILER') {
                await api.delete(`/pago-disciplina/${pago.originalId}`);
            } else if (pago.tipo === 'GASTO' || pago.tipo === 'ENTRADA') {
                await api.delete(`/gastos/${pago.originalId}`);
            }
            fetchData();
        } catch (error) {
            console.error("Error al eliminar el pago:", error);
            alert("Error al eliminar el registro.");
        } finally {
            setDeleteModal({ isOpen: false, pago: null });
        }
    };

    const handleEditClick = (pago: UnifiedPago) => {
        setEditingPago(pago);
        setIsModalOpen(true);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (isoString: string) => {
        if (!isoString) return '-';
        return new Date(isoString).toLocaleDateString('es-AR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-heading font-bold text-gray-900">Gestión de Caja</h2>
                    <p className="text-gray-600">Control de ingresos (cuotas, alquileres) y gastos</p>
                </div>
                <button
                    onClick={() => {
                        setEditingPago(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-3 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    REGISTRAR MOVIMIENTO
                </button>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                        <DollarSign className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Ingresos (Mes)</p>
                        <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalIngresos)}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                        <ArrowDown className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Gastos (Mes)</p>
                        <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalGastos)}</h3>
                    </div>
                </div>

                <div className={cn(
                    "bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4",
                    metrics.balance >= 0 ? "border-gray-100" : "border-red-200 bg-red-50"
                )}>
                    <div className={cn(
                        "p-3 rounded-lg",
                        metrics.balance >= 0 ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"
                    )}>
                        <Activity className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Balance (Mes)</p>
                        <h3 className={cn(
                            "text-2xl font-bold",
                            metrics.balance >= 0 ? "text-gray-900" : "text-red-600"
                        )}>{formatCurrency(metrics.balance)}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Pagos Pendientes</p>
                        <h3 className="text-2xl font-bold text-gray-900">{metrics.pendientes}</h3>
                    </div>
                </div>
            </div>

            {/* Filters & Table */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por concepto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                        />
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Calendar className="text-gray-400 w-5 h-5" />
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red bg-white"
                            >
                                {MESES.map(mes => (
                                    <option key={mes} value={mes}>{mes}</option>
                                ))}
                            </select>
                        </div>
                        <select
                            value={filterTipo}
                            onChange={(e) => setFilterTipo(e.target.value as typeof filterTipo)}
                            className="px-4 py-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red bg-white"
                        >
                            <option value="TODOS">Todos los tipos</option>
                            <option value="CUOTA">Cuotas</option>
                            <option value="ALQUILER">Alquileres</option>
                            <option value="ENTRADA">Entradas (Ingresos extras)</option>
                            <option value="GASTO">Gastos</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="py-8 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red mx-auto mb-4"></div>
                            Cargando movimientos...
                        </div>
                    ) : (
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider pl-4">Fecha</th>
                                    <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Concepto</th>
                                    <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Tipo</th>
                                    <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Monto</th>
                                    <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider text-right pr-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredPagos.map((pago) => (
                                    <tr key={pago.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="py-5 pl-4 text-gray-600">{formatDate(pago.fecha)}</td>
                                        <td className="py-5 font-bold text-gray-900">
                                            {pago.concepto}
                                            <div className="text-xs font-normal text-gray-500 mt-1">
                                                {pago.disciplinaNombre && `Disciplina: ${pago.disciplinaNombre}`}
                                            </div>
                                        </td>
                                        <td className="py-5">
                                            <span className={cn(
                                                "px-2 py-1 rounded text-xs font-bold uppercase tracking-wide",
                                                pago.tipo === 'CUOTA' && "bg-purple-100 text-purple-700",
                                                pago.tipo === 'ALQUILER' && "bg-blue-100 text-blue-700",
                                                pago.tipo === 'ENTRADA' && "bg-green-100 text-green-700",
                                                pago.tipo === 'GASTO' && "bg-orange-100 text-orange-700"
                                            )}>
                                                {pago.tipo}
                                            </span>
                                        </td>
                                        <td className={cn(
                                            "py-5 font-bold",
                                            pago.tipo === 'GASTO' ? "text-red-600" : "text-gray-900"
                                        )}>
                                            {pago.tipo === 'GASTO' ? `- ${formatCurrency(pago.monto)}` : formatCurrency(pago.monto)}
                                        </td>
                                        <td className="py-5 pr-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEditClick(pago)}
                                                    className="p-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-900 transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(pago)}
                                                    className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPagos.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-500">
                                            No se encontraron registros.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <RegistroPagoModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingPago(null);
                }}
                onSaveCuota={handleSaveCuota}
                onSaveGasto={handleSaveGasto}
                clientes={clientes}
                disciplinas={disciplinas}
                initialData={editingPago}
            />

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, pago: null })}
                onConfirm={handleConfirmDelete}
                title="Eliminar Registro"
                message={`¿Estás seguro que deseas eliminar "${deleteModal.pago?.concepto}"? Esta acción no se puede deshacer.`}
                type="danger"
            />
        </div>
    );
}
