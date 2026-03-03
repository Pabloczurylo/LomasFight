import { useState, useEffect, useMemo, useCallback } from 'react';
import { DollarSign, Dumbbell, AlertCircle, Users, TrendingUp, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../../../services/api';
import { ClienteBackend, PagoBackend, PagoDisciplinaBackend, UnifiedPago } from '../../admin/types';
import { cn } from '../../../lib/utils';

const MESES = [
    'Todos', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const MESES_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(amount);

// ─── Monthly Bar Chart (pure SVG, no deps) ──────────────────────────────────

interface MonthlyData { month: number; label: string; total: number; }

function MonthlyChart({ data, maxVal }: { data: MonthlyData[]; maxVal: number }) {
    const BAR_H = 160;
    const BAR_W = 28;
    const GAP   = 14;
    const PL    = 52;
    const PT    = 16;
    const PB    = 28;
    const width  = PL + data.length * (BAR_W + GAP);
    const height = PT + BAR_H + PB;
    const ticks  = 4;
    const tickValues = Array.from({ length: ticks + 1 }, (_, i) => Math.round((maxVal / ticks) * i));

    return (
        <div className="w-full overflow-x-auto">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full"
                style={{ minWidth: `${Math.max(width, 340)}px`, maxWidth: '100%' }}
                aria-label="Ingresos mensuales"
            >
                <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e53e3e" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#fc8181" stopOpacity="0.65" />
                    </linearGradient>
                </defs>

                {/* Grid lines + Y labels */}
                {tickValues.map((v, i) => {
                    const y = PT + BAR_H - (maxVal > 0 ? (v / maxVal) * BAR_H : 0);
                    return (
                        <g key={i}>
                            <line x1={PL} y1={y} x2={width - 4} y2={y} stroke="#f0f0f0" strokeWidth="1" />
                            <text x={PL - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#bbb">
                                {v >= 1000 ? `${Math.round(v / 1000)}k` : v}
                            </text>
                        </g>
                    );
                })}

                {/* Bars */}
                {data.map((d, i) => {
                    const barH = maxVal > 0 ? (d.total / maxVal) * BAR_H : 0;
                    const x = PL + i * (BAR_W + GAP);
                    const y = PT + BAR_H - barH;
                    return (
                        <g key={d.month}>
                            <rect x={x} y={PT} width={BAR_W} height={BAR_H} rx="4" fill="#f9f9f9" />
                            {d.total > 0 && (
                                <>
                                    <rect x={x} y={y} width={BAR_W} height={barH} rx="4" fill="url(#barGrad)" />
                                    <text x={x + BAR_W / 2} y={y - 4} textAnchor="middle" fontSize="8" fill="#e53e3e" fontWeight="bold">
                                        {d.total >= 1000 ? `${Math.round(d.total / 1000)}k` : d.total}
                                    </text>
                                </>
                            )}
                            <text x={x + BAR_W / 2} y={height - 6} textAnchor="middle" fontSize="9" fill="#999">
                                {d.label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function IngresosMensualesModal({
    isOpen, onClose, data, year
}: { isOpen: boolean; onClose: () => void; data: MonthlyData[]; year: number }) {
    if (!isOpen) return null;
    const total = data.reduce((s, d) => s + d.total, 0);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h3 className="text-xl font-heading font-bold text-gray-900">Ingresos {year}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Total anual: <span className="font-bold text-brand-red">{formatCurrency(total)}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="overflow-y-auto flex-1 p-2">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <th className="py-3 px-4 text-left">Mes</th>
                                <th className="py-3 px-4 text-right">Total</th>
                                <th className="py-3 px-4 text-right">% del año</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data.map(d => {
                                const pct = total > 0 ? ((d.total / total) * 100).toFixed(1) : '0.0';
                                const isCurrentMonth = d.month - 1 === new Date().getMonth() && year === new Date().getFullYear();
                                return (
                                    <tr key={d.month} className={cn(
                                        "hover:bg-gray-50/80 transition-colors",
                                        isCurrentMonth && "bg-red-50/50"
                                    )}>
                                        <td className="py-3 px-4 font-medium text-gray-800">
                                            <span className="flex items-center gap-2">
                                                {MESES[d.month]}
                                                {isCurrentMonth && (
                                                    <span className="text-[10px] font-bold bg-brand-red text-white px-1.5 py-0.5 rounded-full">HOY</span>
                                                )}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right font-bold text-gray-900">
                                            {d.total > 0 ? formatCurrency(d.total) : <span className="text-gray-400 font-normal">—</span>}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            {d.total > 0 ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-brand-red rounded-full" style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span className="text-xs text-gray-500 w-10 text-right">{pct}%</span>
                                                </div>
                                            ) : <span className="text-gray-400 text-xs">—</span>}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardHome() {
    const [clientes, setClientes] = useState<ClienteBackend[]>([]);
    const [pagos, setPagos] = useState<UnifiedPago[]>([]);
    const [classesToday, setClassesToday] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [showModal, setShowModal] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [clientesRes, pagosRes, pagosDisciplinaRes, horariosRes] = await Promise.allSettled([
                api.get('/clientes'),
                api.get('/pagos'),
                api.get('/pago-disciplina'),
                api.get('/horarios')
            ]);

            const clientesData = clientesRes.status === 'fulfilled' ? clientesRes.value.data : [];
            const cuotasData: PagoBackend[] = pagosRes.status === 'fulfilled' ? pagosRes.value.data : [];
            const alquileresData: PagoDisciplinaBackend[] = pagosDisciplinaRes.status === 'fulfilled' ? pagosDisciplinaRes.value.data : [];
            const horariosData: { dia_y_hora: string }[] = horariosRes.status === 'fulfilled' ? horariosRes.value.data : [];

            setClientes(clientesData);

            const daysMap = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
            const todayName = daysMap[new Date().getDay()];
            const todayCount = horariosData.filter(h => daysMap[new Date(h.dia_y_hora).getDay()] === todayName).length;
            setClassesToday(todayCount);

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
            console.error('Error cargando datos del dashboard:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // ── Metrics ──────────────────────────────────────────────────────────────

    const metrics = useMemo(() => {
        const currentMonthIndex = new Date().getMonth() + 1;
        const targetMonth = MESES[currentMonthIndex];
        let totalRecaudadoMes = 0;
        let pendientesKickboxing = 0;

        pagos.forEach(p => {
            const pMonth = MESES[new Date(p.fecha).getMonth() + 1];
            if (p.estado === 'Pagado' && pMonth === targetMonth) totalRecaudadoMes += p.monto;
        });

        const activeStudents = clientes.filter(c => c.activo && !c.inactivo);
        activeStudents.forEach(student => {
            if (student.disciplinas?.nombre_disciplina?.toUpperCase() !== 'KICKBOXING') return;
            const hasPaid = pagos.some(p =>
                p.tipo === 'CUOTA' && p.estado === 'Pagado' &&
                MESES[new Date(p.fecha).getMonth() + 1] === targetMonth &&
                p.idCliente === student.id_cliente
            );
            if (!hasPaid) pendientesKickboxing++;
        });

        return { activeStudents: activeStudents.length, totalRecaudadoMes, pendientesKickboxing };
    }, [pagos, clientes]);

    // ── Monthly chart data ────────────────────────────────────────────────────

    const availableYears = useMemo(() => {
        const years = new Set<number>([new Date().getFullYear()]);
        pagos.forEach(p => years.add(new Date(p.fecha).getFullYear()));
        return Array.from(years).sort((a, b) => a - b);
    }, [pagos]);

    const monthlyData: MonthlyData[] = useMemo(() =>
        Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            label: MESES_SHORT[i],
            total: pagos
                .filter(p => {
                    const d = new Date(p.fecha);
                    return d.getFullYear() === selectedYear && d.getMonth() === i;
                })
                .reduce((sum, p) => sum + p.monto, 0),
        })),
        [pagos, selectedYear]
    );

    const maxMonthly = useMemo(() => Math.max(...monthlyData.map(d => d.total), 1), [monthlyData]);
    const recentPayments = pagos.slice(0, 5);

    const formatDate = (isoString: string) => {
        if (!isoString) return '-';
        return new Date(isoString).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    if (isLoading) {
        return (
            <div className="py-12 text-center text-gray-500 flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-red mb-4" />
                <p>Cargando información del panel...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-heading font-bold text-gray-900">Bienvenido al Panel</h2>

            {/* ── Metric cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-brand-red/10 text-brand-red rounded-lg"><Users className="w-8 h-8" /></div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 mb-1">Alumnos Activos</h3>
                        <p className="text-2xl font-heading font-bold text-brand-black">{metrics.activeStudents}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg"><DollarSign className="w-8 h-8" /></div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 mb-1">Recaudación (Mes)</h3>
                        <p className="text-2xl font-heading font-bold text-brand-black">{formatCurrency(metrics.totalRecaudadoMes)}</p>
                    </div>
                </div>
                <div className={cn(
                    "bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4 transition-colors",
                    metrics.pendientesKickboxing > 0 ? "border-red-500 bg-red-50" : "border-gray-100"
                )}>
                    <div className={cn("p-3 rounded-lg flex-shrink-0",
                        metrics.pendientesKickboxing > 0 ? "bg-red-500 text-white" : "bg-yellow-100 text-yellow-600"
                    )}>
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className={cn("text-sm font-bold mb-1",
                            metrics.pendientesKickboxing > 0 ? "text-red-700" : "text-gray-500"
                        )}>Pagos Pendientes</h3>
                        <p className={cn("text-2xl font-heading font-bold",
                            metrics.pendientesKickboxing > 0 ? "text-red-600" : "text-brand-black"
                        )}>{metrics.pendientesKickboxing}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Dumbbell className="w-8 h-8" /></div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 mb-1">Clases Hoy</h3>
                        <p className="text-2xl font-heading font-bold text-brand-black">{classesToday}</p>
                    </div>
                </div>
            </div>

            {/* ── Monthly Income Chart ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 pt-6 pb-4 border-b border-gray-100">
                    <div>
                        <h3 className="text-xl font-heading font-bold text-gray-900">Ingresos Mensuales</h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Total {selectedYear}:{' '}
                            <span className="font-semibold text-gray-700">
                                {formatCurrency(monthlyData.reduce((s, d) => s + d.total, 0))}
                            </span>
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-brand-red text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors self-start sm:self-auto"
                    >
                        <TrendingUp size={16} />
                        Ver ingresos mensuales
                    </button>
                </div>

                {/* Chart */}
                <div className="px-4 pt-5 pb-2">
                    <MonthlyChart data={monthlyData} maxVal={maxMonthly} />
                </div>

                {/* Year pagination */}
                <div className="flex items-center justify-center gap-2 px-6 pb-5 pt-1">
                    <button
                        onClick={() => setSelectedYear(y => y - 1)}
                        disabled={selectedYear <= Math.min(...availableYears)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div className="flex gap-1.5 flex-wrap justify-center">
                        {availableYears.map(y => (
                            <button
                                key={y}
                                onClick={() => setSelectedYear(y)}
                                className={cn(
                                    "px-3 py-1 rounded-lg text-sm font-semibold transition-all",
                                    selectedYear === y
                                        ? "bg-brand-red text-white shadow-sm"
                                        : "text-gray-500 hover:bg-gray-100"
                                )}
                            >
                                {y}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setSelectedYear(y => y + 1)}
                        disabled={selectedYear >= Math.max(...availableYears)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* ── Recent payments ── */}
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
                                {recentPayments.map(pago => (
                                    <tr key={pago.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 pl-4 text-sm text-gray-600">{formatDate(pago.fecha)}</td>
                                        <td className="py-4 text-sm font-semibold text-gray-900">
                                            {pago.concepto}
                                            {pago.disciplinaNombre && (
                                                <span className="block text-xs font-normal text-gray-500 mt-0.5">{pago.disciplinaNombre}</span>
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

            {/* ── Modal ── */}
            <IngresosMensualesModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                data={monthlyData}
                year={selectedYear}
            />
        </div>
    );
}
