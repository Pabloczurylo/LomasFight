import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, DollarSign, AlertCircle, Calendar, Dumbbell } from 'lucide-react';
import { ClienteBackend, Disciplina, PagoBackend, PagoDisciplinaBackend, UnifiedPago } from '../types';
import { cn } from '../../../lib/utils';
import RegistroPagoModal, { CuotaPayload, AlquilerPayload } from '../components/RegistroPagoModal';
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
    const [isModalOpen, setIsModalOpen] = useState(false);

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

            // Fetch payments with individual error handling
            const [pagosRes, pagosDisciplinaRes] = await Promise.allSettled([
                api.get('/pagos'),
                api.get('/pago-disciplina')
            ]);

            const cuotas: PagoBackend[] = pagosRes.status === 'fulfilled' ? pagosRes.value.data : [];
            const alquileres: PagoDisciplinaBackend[] = pagosDisciplinaRes.status === 'fulfilled' ? pagosDisciplinaRes.value.data : [];

            if (pagosRes.status === 'rejected') console.error("Error fetching pagos:", pagosRes.reason);
            if (pagosDisciplinaRes.status === 'rejected') console.error("Error fetching pagos-disciplina:", pagosDisciplinaRes.reason);

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
                // Si tienes nombre_disciplina en endpoint, usarlo. Sino fallback.
                concepto: a.disciplinas ? `Alquiler - ${a.disciplinas.nombre_disciplina}` : `Alquiler - Disciplina ID: ${a.id_disciplina}`,
                monto: Number(a.monto_cuota),
                estado: 'Pagado',
                originalId: a.id_pago_disciplina,
                disciplinaNombre: a.disciplinas?.nombre_disciplina
            }));

            const allPagos = [...normalizedCuotas, ...normalizedAlquileres];

            // Sort by Date DESC
            allPagos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

            setPagos(allPagos);
        } catch (error) {
            console.error("Error inesperado cargando datos de pagos:", error);
            // Mostrar error (idealmente con toast), pero no bloquear UI completamente
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Métricas
    const metrics = useMemo(() => {
        const currentMonthIndex = new Date().getMonth() + 1; // 1 to 12. MESES[1] = Enero
        const targetMonth = MESES[currentMonthIndex];

        let totalMensual = 0;
        let pendientes = 0;
        let totalAlquileres = 0;

        pagos.forEach(p => {
            const pDate = new Date(p.fecha);
            const pMonth = MESES[pDate.getMonth() + 1];

            if (p.estado === 'Pagado') {
                if (targetMonth === 'Todos' || pMonth === targetMonth) {
                    totalMensual += p.monto;
                }
            }

            if (p.tipo === 'ALQUILER' && p.estado === 'Pagado') {
                if (targetMonth === 'Todos' || pMonth === targetMonth) {
                    totalAlquileres += p.monto;
                }
            }
        });

        // Cálculo dinámico de Deudores (Solo para KICKBOXING)
        const currentDate = new Date();
        const activeStudents = clientes.filter(c => c.activo);

        activeStudents.forEach(student => {
            // Solo el administrador gestiona cuotas de Kickboxing
            const isKickboxing = student.disciplinas?.nombre_disciplina?.toUpperCase() === 'KICKBOXING';
            if (!isKickboxing) return;

            // Get all CUOTA payments for this student
            const studentCuotas = pagos.filter(p =>
                p.idCliente === student.id_cliente &&
                p.tipo === 'CUOTA' &&
                p.estado === 'Pagado'
            );

            // Sort by date DESC
            const sortedCuotas = [...studentCuotas].sort((a, b) =>
                new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
            );

            if (sortedCuotas.length > 0) {
                const latestPagoDate = new Date(sortedCuotas[0].fecha);
                const diffTime = Math.abs(currentDate.getTime() - latestPagoDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                // If it's more than 30 days, we count it as pending
                if (diffDays > 30) {
                    pendientes++;
                }
            } else {
                // Never paid
                pendientes++;
            }
        });

        return { totalMensual, pendientes, totalAlquileres };
    }, [pagos, clientes]);

    const filteredPagos = pagos.filter(pago => {
        const matchesSearch = pago.concepto.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesMonth = true;
        if (selectedMonth !== 'Todos' && pago.fecha) {
            const date = new Date(pago.fecha);
            // MESES[1] is Enero, date.getMonth() is 0 for Enero
            const pMonth = MESES[date.getMonth() + 1];
            matchesMonth = pMonth === selectedMonth;
        }

        return matchesSearch && matchesMonth;
    });

    const handleSaveCuota = async (payload: CuotaPayload) => {
        try {
            await api.post('/pagos', payload);
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error("Error guarding cuota:", error);
            alert("Error al guardar la cuota.");
        }
    };

    const handleSaveAlquiler = async (payload: AlquilerPayload) => {
        try {
            await api.post('/pago-disciplina', payload);
            setIsModalOpen(false);
            fetchData(); // reload
        } catch (error) {
            console.error("Error guarding alquiler:", error);
            alert("Error al guardar el alquiler.");
        }
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
                    <h2 className="text-3xl font-heading font-bold text-gray-900">Gestión de Ingresos</h2>
                    <p className="text-gray-600">Control de cuotas y alquiler de salón</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-3 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    REGISTRAR INGRESO
                </button>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                        <DollarSign className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Ingresos Totales (Mes)</p>
                        <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalMensual)}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Dumbbell className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Ingresos por Profesores (Mes)</p>
                        <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalAlquileres)}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Pagos Pendientes / Atrasados</p>
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
                            placeholder="Buscar por alumno o disciplina..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                        />
                    </div>

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
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="py-8 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red mx-auto mb-4"></div>
                            Cargando ingresos...
                        </div>
                    ) : (
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider pl-4">Fecha Pago</th>
                                    <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Concepto</th>
                                    <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Clasificación</th>
                                    <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Monto</th>
                                    <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Estado</th>
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
                                                pago.tipo === 'CUOTA' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                                            )}>
                                                {pago.tipo}
                                            </span>
                                        </td>
                                        <td className="py-5 font-bold text-gray-900">{formatCurrency(pago.monto)}</td>
                                        <td className="py-5">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                                                pago.estado === 'Pagado' && "bg-green-100 text-green-700",
                                                pago.estado === 'Pendiente' && "bg-yellow-100 text-yellow-700",
                                                pago.estado === 'Vencido' && "bg-red-100 text-red-700"
                                            )}>
                                                {pago.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPagos.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-500">
                                            No se encontraron registros de ingreso.
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
                onClose={() => setIsModalOpen(false)}
                onSaveCuota={handleSaveCuota}
                onSaveAlquiler={handleSaveAlquiler}
                clientes={clientes}
                disciplinas={disciplinas}
            />
        </div>
    );
}
