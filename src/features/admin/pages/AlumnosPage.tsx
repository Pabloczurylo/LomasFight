import { useState } from 'react';
import { Alumno } from '../types';
import { cn } from '../../../lib/utils';
import { Search, Plus } from 'lucide-react';

const MOCK_ALUMNOS: Alumno[] = [
    {
        id: '1',
        nombre: 'Juan',
        apellido: 'Pérez',
        disciplina: 'Kickboxing',
        estadoPago: 'al día',
        fechaRegistro: '2023-01-15',
    },
    {
        id: '2',
        nombre: 'María',
        apellido: 'Gómez',
        disciplina: 'Boxeo',
        estadoPago: 'pendiente',
        fechaRegistro: '2023-02-20',
    },
    {
        id: '3',
        nombre: 'Carlos',
        apellido: 'López',
        disciplina: 'Fuerza',
        estadoPago: 'vencido',
        fechaRegistro: '2023-03-10',
    },
    {
        id: '4',
        nombre: 'Ana',
        apellido: 'Martínez',
        disciplina: 'Kickboxing',
        estadoPago: 'al día',
        fechaRegistro: '2023-04-05',
    },
    {
        id: '5',
        nombre: 'Pedro',
        apellido: 'Sánchez',
        disciplina: 'Boxeo',
        estadoPago: 'al día',
        fechaRegistro: '2023-05-12',
    },
    {
        id: '6',
        nombre: 'Laura',
        apellido: 'Rodríguez',
        disciplina: 'Fuerza',
        estadoPago: 'vencido',
        fechaRegistro: '2023-06-25',
    },
    {
        id: '7',
        nombre: 'Sofía',
        apellido: 'Fernández',
        disciplina: 'Kickboxing',
        estadoPago: 'pendiente',
        fechaRegistro: '2023-07-30',
    },
];

export default function AlumnosPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAlumnos = MOCK_ALUMNOS.filter((alumno) =>
        alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumno.apellido.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-3xl font-heading font-bold text-gray-900">Gestión de Alumnos</h2>
                <button className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    <Plus size={20} />
                    <span>Agregar Alumno</span>
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="mb-6 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o apellido..."
                        className="pl-10 w-full sm:w-80 rounded-lg border border-gray-300 focus:border-brand-red focus:ring-1 focus:ring-brand-red py-2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="pb-3 font-bold text-gray-500">Nombre</th>
                                <th className="pb-3 font-bold text-gray-500">Disciplina</th>
                                <th className="pb-3 font-bold text-gray-500">Estado de Pago</th>
                                <th className="pb-3 font-bold text-gray-500">Fecha Registro</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAlumnos.map((alumno) => (
                                <tr key={alumno.id} className="group hover:bg-gray-50">
                                    <td className="py-4 font-medium text-gray-900 group-hover:text-brand-red transition-colors">
                                        {alumno.nombre} {alumno.apellido}
                                    </td>
                                    <td className="py-4 text-gray-600">{alumno.disciplina}</td>
                                    <td className="py-4">
                                        <span
                                            className={cn(
                                                'px-3 py-1 rounded-full text-sm font-medium',
                                                alumno.estadoPago === 'al día' && 'bg-green-100 text-green-700',
                                                alumno.estadoPago === 'pendiente' && 'bg-yellow-100 text-yellow-700',
                                                alumno.estadoPago === 'vencido' && 'bg-red-100 text-red-700'
                                            )}
                                        >
                                            {alumno.estadoPago}
                                        </span>
                                    </td>
                                    <td className="py-4 text-gray-500">{alumno.fechaRegistro}</td>
                                </tr>
                            ))}
                            {filteredAlumnos.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-gray-500">
                                        No se encontraron alumnos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
