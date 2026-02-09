import { MOCK_ALUMNOS, MOCK_PAGOS, MOCK_SCHEDULE } from "../data/mockData";

export default function DashboardHome() {
    // 1. Alumnos Activos
    const activeStudents = MOCK_ALUMNOS.length;

    // 2. Pagos Pendientes (Pendiente o Vencido for simplicity, or just Pendiente as requested? Request says 'Pendiente')
    const pendingPayments = MOCK_PAGOS.filter(p => p.estado === 'Pendiente').length;

    // 3. Clases Hoy
    const daysMap = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
    const todayIndex = new Date().getDay();
    const todayName = daysMap[todayIndex];

    // MOCK_SCHEDULE days are "LUNES", etc.
    const classesToday = MOCK_SCHEDULE.filter(c => c.day === todayName).length;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-heading font-bold text-gray-900">Bienvenido al Panel</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-500 mb-2">Alumnos Activos</h3>
                    <p className="text-4xl font-heading font-bold text-brand-black">{activeStudents}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-500 mb-2">Clases Hoy</h3>
                    <p className="text-4xl font-heading font-bold text-brand-black">{classesToday}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-500 mb-2">Pagos Pendientes</h3>
                    <p className="text-4xl font-heading font-bold text-brand-red">{pendingPayments}</p>
                </div>
            </div>
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center text-gray-400">
                <p>Gráficos y estadísticas vendrán en el siguiente sprint.</p>
            </div>
        </div>
    );
}
