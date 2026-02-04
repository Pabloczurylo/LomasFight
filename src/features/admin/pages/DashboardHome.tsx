export default function DashboardHome() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-heading font-bold text-gray-900">Bienvenido al Panel</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-500 mb-2">Alumnos Activos</h3>
                    <p className="text-4xl font-heading font-bold text-brand-black">124</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-500 mb-2">Clases Hoy</h3>
                    <p className="text-4xl font-heading font-bold text-brand-black">8</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-500 mb-2">Pagos Pendientes</h3>
                    <p className="text-4xl font-heading font-bold text-brand-red">12</p>
                </div>
            </div>
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center text-gray-400">
                <p>Gráficos y estadísticas vendrán en el siguiente sprint.</p>
            </div>
        </div>
    );
}
