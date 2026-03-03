import { useState, useEffect, useMemo, useCallback } from 'react';
import { DollarSign, Dumbbell, AlertCircle, Users } from 'lucide-react';
import { api } from '../../../services/api';
import { ClienteBackend, PagoBackend, PagoDisciplinaBackend, UnifiedPago } from '../../admin/types';
import { cn } from '../../../lib/utils';
import { MOCK_SCHEDULE } from '../data/mockData';

const MESES = [
    'Todos', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function DashboardHome() {
    const [clientes, setClientes] = useState<ClienteBackend[]>([]);
    const [pagos, setPagos] = useState<UnifiedPago[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [clientesRes, pagosRes, pagosDisciplinaRes] = await Promise.allSettled([
                api.get('/clientes'),
                api.get('/pagos'),
                api.get('/pago-disciplina')
            ]);

            const clientesData = clientesRes.status === 'fulfilled' ? clientesRes.value.data : [];
            const cuotasData: PagoBackend[] = pagosRes.status === 'fulfilled' ? pagosRes.value.data : [];
            const alquileresData: PagoDisciplinaBackend[] = pagosDisciplinaRes.status === 'fulfilled' ? pagosDisciplinaRes.value.data : [];

            setClientes(clientesData);

            // Normalize payments (similar to PagosPage)
            const normalizedCuotas: UnifiedPago[] = cuotasData.map(c => ({
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

            const normalizedAlquileres: UnifiedPago[] = alquileresData.map(a => ({
                id: `alquiler-${a.id_pago_disciplina}`,
                tipo: 'ALQUILER',
                fecha: a.fecha_pago,
                concepto: a.disciplinas ? `Alquiler - ${a.disciplinas.nombre_disciplina}` : `Alquiler - Disciplina ID: ${a.id_disciplina}`,
                monto: Number(a.monto_cuota),
                estado: 'Pagado',
                originalId: a.id_pago_disciplina,
                disciplinaNombre: a.disciplinas?.nombre_disciplina
            }));

            const allPagos = [...normalizedCuotas, ...normalizedAlquileres];
            allPagos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

            setPagos(allPagos);

        } catch (error) {
            console.error("Error cargando datos del dashboard:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const metrics = useMemo(() => {
        const currentMonthIndex = new Date().getMonth() + 1; // 1 to 12. MESES[1] = Enero
        const targetMonth = MESES[currentMonthIndex];

        let totalRecaudadoMes = 0;
        let pendientesKickboxing = 0;

        // 1. Calculate Revenue for current month
        pagos.forEach(p => {
            const pDate = new Date(p.fecha);
            const pMonth = MESES[pDate.getMonth() + 1];

            if (p.estado === 'Pagado' && pMonth === targetMonth) {
                totalRecaudadoMes += p.monto;
            }
        });

        // 2. Active Students count
        const activeStudents = clientes.filter(c => c.activo);

        // 3. Pending payments (Focusing on Kickboxing specifically as requested)
        const currentDate = new Date();

        activeStudents.forEach(student => {
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
                    pendientesKickboxing++;
                }
            } else {
                // Never paid
                pendientesKickboxing++;
            }
        });

        return {
            activeStudents: activeStudents.length,
            totalRecaudadoMes,
            pendientesKickboxing
        };
    }, [pagos, clientes]);

    const recentPayments = pagos.slice(0, 5);

    // MOCK Classes for today until API for classes is live
    const daysMap = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
    const todayIndex = new Date().getDay();
    const todayName = daysMap[todayIndex];
    const classesToday = MOCK_SCHEDULE.filter(c => c.day === todayName).length;

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

    if (isLoading) {
        return (
            <div className="py-12 text-center text-gray-500 flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-red mb-4"></div>
                <p>Cargando información del panel...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-heading font-bold text-gray-900">Bienvenido al Panel</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-brand-red/10 text-brand-red rounded-lg">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 mb-1">Alumnos Activos</h3>
                        <p className="text-2xl font-heading font-bold text-brand-black">{metrics.activeStudents}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                        <DollarSign className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 mb-1">Recaudación (Mes)</h3>
                        <p className="text-2xl font-heading font-bold text-brand-black">{formatCurrency(metrics.totalRecaudadoMes)}</p>
                    </div>
                </div>

                <div className={cn(
                    "bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4 transition-colors",
                    metrics.pendientesKickboxing > 0 ? "border-red-500 bg-red-50" : "border-gray-100"
                )}>
                    <div className={cn(
                        "p-3 rounded-lg flex-shrink-0",
                        metrics.pendientesKickboxing > 0 ? "bg-red-500 text-white" : "bg-yellow-100 text-yellow-600"
                    )}>
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className={cn(
                            "text-sm font-bold mb-1",
                            metrics.pendientesKickboxing > 0 ? "text-red-700" : "text-gray-500"
                        )}>Pagos Pendientes</h3>
                        <p className={cn(
                            "text-2xl font-heading font-bold",
                            metrics.pendientesKickboxing > 0 ? "text-red-600" : "text-brand-black"
                        )}>{metrics.pendientesKickboxing}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Dumbbell className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 mb-1">Clases Hoy</h3>
                        <p className="text-2xl font-heading font-bold text-brand-black">{classesToday}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-heading font-bold text-gray-900 mb-6">Actividad Reciente (Últimos 5 pagos)</h3>
                <div className="overflow-x-auto">
                    {recentPayments.length > 0 ? (
                        <table className="w-full text-left min-w-[600px]">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider pl-4 rounded-tl-lg">Fecha</th>
                                    <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider">Concepto</th>
                                    <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider">Tipo</th>
                                    <th className="pb-3 pt-3 font-bold text-gray-500 text-xs uppercase tracking-wider rounded-tr-lg">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentPayments.map((pago) => (
                                    <tr key={pago.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 pl-4 text-sm text-gray-600">{formatDate(pago.fecha)}</td>
                                        <td className="py-4 text-sm font-semibold text-gray-900">
                                            {pago.concepto}
                                            {pago.disciplinaNombre && (
                                                <span className="block text-xs font-normal text-gray-500 mt-0.5">
                                                    {pago.disciplinaNombre}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                                                pago.tipo === 'CUOTA' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                                            )}>
                                                {pago.tipo}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm font-bold text-gray-900">{formatCurrency(pago.monto)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-lg">
                            Aún no se han registrado ingresos.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
