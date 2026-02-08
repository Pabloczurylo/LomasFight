import { useState, useMemo } from 'react';
import { Plus, Search, DollarSign, AlertCircle, CreditCard, Calendar } from 'lucide-react';
import { Pago, Alumno, Disciplina } from '../types';
import { cn } from '../../../lib/utils';
import RegistroPagoModal from '../components/RegistroPagoModal';

// MOCK DATA - To be replaced with real data fetching
const MOCK_PAGOS: Pago[] = [
    {
        id: '1',
        alumnoId: '1',
        alumnoNombre: 'Juan Pérez',
        disciplinaId: '1',
        disciplinaNombre: 'Kickboxing',
        monto: 15000,
        mes: 'Febrero',
        anio: 2024,
        fechaPago: '2024-02-05',
        metodoPago: 'Efectivo',
        estado: 'Pagado'
    },
    {
        id: '2',
        alumnoId: '2',
        alumnoNombre: 'María Gómez',
        disciplinaId: '2',
        disciplinaNombre: 'Boxeo',
        monto: 12000,
        mes: 'Febrero',
        anio: 2024,
        fechaPago: '2024-02-06',
        metodoPago: 'Transferencia',
        estado: 'Pagado'
    },
    {
        id: '3',
        alumnoId: '3',
        alumnoNombre: 'Carlos López',
        disciplinaId: '3',
        disciplinaNombre: 'Fuerza',
        monto: 10000,
        mes: 'Enero',
        anio: 2024,
        fechaPago: '2024-01-10',
        metodoPago: 'Efectivo',
        estado: 'Vencido'
    }
];

// Necesitamos mock alumnos y disciplinas para el modal
const MOCK_ALUMNOS: Alumno[] = [
    { id: '1', nombre: 'Juan', apellido: 'Pérez', disciplina: 'Kickboxing', estadoPago: 'al día', fechaRegistro: '2023-01-15' },
    { id: '2', nombre: 'María', apellido: 'Gómez', disciplina: 'Boxeo', estadoPago: 'pendiente', fechaRegistro: '2023-02-20' },
    { id: '3', nombre: 'Carlos', apellido: 'López', disciplina: 'Fuerza', estadoPago: 'vencido', fechaRegistro: '2023-03-10' },
];

const MOCK_DISCIPLINAS: Disciplina[] = [
    { id: '1', nombre: 'Kickboxing', descripcion: '', imagen: '' },
    { id: '2', nombre: 'Boxeo', descripcion: '', imagen: '' },
    { id: '3', nombre: 'Fuerza', descripcion: '', imagen: '' },
];

const MESES = [
    'Todos', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function PagosPage() {
    const [pagos, setPagos] = useState<Pago[]>(MOCK_PAGOS);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('Todos');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Métricas
    const metrics = useMemo(() => {
        const currentMonth = new Date().toLocaleString('es-ES', { month: 'long' });

        // 1. Total Mensual (Current Month)
        // Note: Using hardcoded 'Febrero' for demo consistency with mock data, 
        // in real app use capitalizedMonth
        const targetMonth = 'Febrero';

        const totalMensual = pagos
            .filter(p => p.mes === targetMonth && p.estado === 'Pagado')
            .reduce((sum, p) => sum + p.monto, 0);

        // 2. Pendientes (Total Count)
        const pendientes = pagos.filter(p => p.estado === 'Pendiente' || p.estado === 'Vencido').length;

        // 3. Método Preferido
        const methods = pagos.reduce((acc, p) => {
            acc[p.metodoPago] = (acc[p.metodoPago] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const preferredMethod = Object.entries(methods).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

        return { totalMensual, pendientes, preferredMethod };
    }, [pagos]);

    const filteredPagos = pagos.filter(pago => {
        const matchesSearch = pago.alumnoNombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMonth = selectedMonth === 'Todos' || pago.mes === selectedMonth;
        return matchesSearch && matchesMonth;
    });

    const handleSavePago = (newPagoData: Omit<Pago, 'id'>) => {
        const newPago: Pago = {
            ...newPagoData,
            id: Date.now().toString()
        };
        setPagos(prev => [newPago, ...prev]);
        setIsModalOpen(false);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-heading font-bold text-gray-900">Gestión de Pagos</h2>
                    <p className="text-gray-600">Control de cuotas y estado financiero</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    REGISTRAR PAGO
                </button>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                        <DollarSign className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Ingresos del Mes</p>
                        <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalMensual)}</h3>
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

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <CreditCard className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Método Preferido</p>
                        <h3 className="text-2xl font-bold text-gray-900">{metrics.preferredMethod}</h3>
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
                            placeholder="Buscar alumno..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="text-gray-400 w-5 h-5" />
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red bg-white"
                        >
                            {MESES.map(mes => (
                                <option key={mes} value={mes}>{mes}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Alumno</th>
                                <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Disciplina</th>
                                <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Monto</th>
                                <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Mes/Año</th>
                                <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Fecha Pago</th>
                                <th className="pb-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPagos.map((pago) => (
                                <tr key={pago.id} className="group hover:bg-gray-50 transition-colors">
                                    <td className="py-4 font-medium text-gray-900">{pago.alumnoNombre}</td>
                                    <td className="py-4 text-gray-600">{pago.disciplinaNombre}</td>
                                    <td className="py-4 font-medium text-gray-900">{formatCurrency(pago.monto)}</td>
                                    <td className="py-4 text-gray-600">{pago.mes} {pago.anio}</td>
                                    <td className="py-4 text-gray-600">{pago.fechaPago}</td>
                                    <td className="py-4">
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
                                    <td colSpan={6} className="py-8 text-center text-gray-500">
                                        No se encontraron registros de pago.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <RegistroPagoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePago}
                alumnos={MOCK_ALUMNOS}
                disciplinas={MOCK_DISCIPLINAS}
            />
        </div>
    );
}
