import { useState, useEffect } from 'react';
import { Search, Trash2, Pencil } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Pagination } from '../../../components/ui/Pagination';
import { Teacher } from '../types';

const PAGE_SIZE = 10;

interface TeacherListProps {
    teachers: Teacher[];
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onEdit: (teacher: Teacher) => void;
    onDelete: (id: number) => void;
}

export function TeacherList({ teachers, searchTerm, onSearchChange, onEdit, onDelete }: TeacherListProps) {
    const [currentPage, setCurrentPage] = useState(1);

    // Filtrado inteligente: Busca por nombre, apellido o nombre de la disciplina
    const filteredTeachers = teachers.filter(t =>
        t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.disciplinas.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredTeachers.length / PAGE_SIZE);
    const pagedTeachers = filteredTeachers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    // Reset to page 1 on search change
    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden min-h-[400px]">
            {/* Header del Listado */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Instructores Registrados</h2>
                    <p className="text-xs text-gray-400 mt-1">Total: {filteredTeachers.length} profesores encontrados</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o arte..."
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:bg-white transition-all"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50/50 text-gray-500 font-bold uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4">Profesor</th>
                            <th className="px-6 py-4">Especialidad</th>
                            <th className="px-6 py-4 text-right">Gestión</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {pagedTeachers.length > 0 ? (
                            pagedTeachers.map((teacher) => (
                                <tr key={teacher.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{teacher.nombre} {teacher.apellido}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {teacher.disciplinas.map((disc, idx) => (
                                                <Badge key={idx} variant="red" className="bg-red-50 text-brand-red border-red-100 font-bold px-2 py-0.5">
                                                    {disc}
                                                </Badge>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onEdit(teacher)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Editar perfil"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(teacher.id)}
                                                className="p-2 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-lg transition-all"
                                                title="Eliminar de la nómina"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center">
                                    <p className="text-gray-400 font-medium">No se encontraron profesores que coincidan con la búsqueda.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-6 border-t border-gray-100">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredTeachers.length}
                    itemsPerPage={PAGE_SIZE}
                />
            </div>
        </div>
    );
}