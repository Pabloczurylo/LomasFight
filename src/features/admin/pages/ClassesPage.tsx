import { Plus, Search, Clock, MoreHorizontal } from "lucide-react";

const MOCK_SCHEDULE = [
    {
        id: 1,
        day: "LUNES",
        shift: "Primer Turno",
        time: "18:00 - 19:30",
        duration: "90 min",
        discipline: "KICKBOXING",
    },
    {
        id: 2,
        day: "LUNES",
        shift: "Segundo Turno",
        time: "20:00 - 21:00",
        duration: "60 min",
        discipline: "BOXEO",
    },
    {
        id: 3,
        day: "MARTES",
        shift: "Turno Mañana",
        time: "09:00 - 10:30",
        duration: "90 min",
        discipline: "MUAY THAI",
    },
    {
        id: 4,
        day: "MIÉRCOLES",
        shift: "Turno Noche",
        time: "19:00 - 20:30",
        duration: "90 min",
        discipline: "KICKBOXING",
    },
    {
        id: 5,
        day: "JUEVES",
        shift: "Turno Tarde",
        time: "17:00 - 18:30",
        duration: "90 min",
        discipline: "BOXEO",
    },
];

export default function ClassesPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold uppercase tracking-wide">CRONOGRAMA DE CLASES</h1>
                    <p className="text-gray-500 mt-1">Control centralizado de disciplinas, días y horarios de entrenamiento.</p>
                </div>
                <button className="bg-brand-red text-white py-2 px-6 rounded-lg font-heading font-semibold tracking-wide uppercase flex items-center gap-2 hover:bg-red-700 transition-colors shadow-lg shadow-brand-red/20">
                    <Plus className="w-5 h-5" />
                    Añadir Horario
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por disciplina o día..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm border-none focus:ring-0 outline-none"
                    />
                </div>
                <select className="bg-gray-50 px-4 py-2 rounded-lg text-sm border-none outline-none font-medium text-gray-700 md:w-64">
                    <option>Todas las Disciplinas</option>
                    <option>Kickboxing</option>
                    <option>Boxeo</option>
                    <option>Muay Thai</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Día</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Horario</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Duración</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Disciplina</th>
                                <th className="text-right py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {MOCK_SCHEDULE.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-5 px-6">
                                        <div className="font-bold text-gray-900 uppercase font-heading tracking-wide text-lg">{item.day}</div>
                                        <div className="text-xs text-gray-400 mt-1 uppercase">{item.shift}</div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                                            <Clock className="w-4 h-4 text-brand-red" />
                                            {item.time}
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="text-gray-500 italic">{item.duration}</div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <span className="inline-block px-3 py-1 rounded-md bg-red-50 text-brand-red text-xs font-bold uppercase tracking-wider border border-red-100">
                                            {item.discipline}
                                        </span>
                                    </td>
                                    <td className="py-5 px-6 text-right">
                                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">Mostrando 5 de 12 registros de horarios</span>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors shadow-sm">
                            Anterior
                        </button>
                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors shadow-sm">
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
