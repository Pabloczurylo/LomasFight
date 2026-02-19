import { useState, useRef, useEffect } from 'react';
import { Search, Trash2, Pencil, ChevronDown, Check, XCircle } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Teacher } from '../types';

interface TeacherListProps {
    teachers: Teacher[];
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onEdit: (teacher: Teacher) => void;
    onDelete: (id: number) => void;
    onStatusChange: (id: number, status: Teacher['estado']) => void;
}

export function TeacherList({ teachers, searchTerm, onSearchChange, onEdit, onDelete, onStatusChange }: TeacherListProps) {
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredTeachers = teachers.filter(t =>
        t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.disciplinas.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdownId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden min-h-[400px]">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-gray-900">Listado de Profesores</h2>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar profesor..."
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
                            <th className="px-6 py-4">Disciplina</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredTeachers.length > 0 ? (
                            filteredTeachers.map((teacher) => (
                                <tr key={teacher.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{teacher.nombre} {teacher.apellido}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {teacher.disciplinas.map((disc, idx) => (
                                                <Badge key={idx} variant="red" className="bg-red-50 text-brand-red border-red-100">
                                                    {disc}
                                                </Badge>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative">
                                            <button
                                                onClick={(e) => toggleDropdown(teacher.id, e)}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs font-bold ${teacher.estado === 'Activo'
                                                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                                        : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                                    }`}
                                            >
                                                <span className={`w-2 h-2 rounded-full ${teacher.estado === 'Activo' ? 'bg-green-500' : 'bg-red-500'}`} />
                                                {teacher.estado}
                                                <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                                            </button>

                                            {openDropdownId === teacher.id && (
                                                <div
                                                    ref={dropdownRef}
                                                    className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-gray-100 z-50 animate-in fade-in zoom-in duration-200"
                                                >
                                                    <div className="p-1">
                                                        <button
                                                            onClick={() => {
                                                                onStatusChange(teacher.id, 'Activo');
                                                                setOpenDropdownId(null);
                                                            }}
                                                            className={`flex items-center w-full px-3 py-2 text-xs font-medium rounded-md transition-colors ${teacher.estado === 'Activo' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            <Check className="w-3 h-3 mr-2" />
                                                            Activo
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                onStatusChange(teacher.id, 'Inactivo');
                                                                setOpenDropdownId(null);
                                                            }}
                                                            className={`flex items-center w-full px-3 py-2 text-xs font-medium rounded-md transition-colors ${teacher.estado === 'Inactivo' ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            <XCircle className="w-3 h-3 mr-2" />
                                                            Inactivo
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(teacher)}
                                                className="p-1.5 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-md transition-all"
                                                title="Editar"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(teacher.id)}
                                                className="p-1.5 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-md transition-all"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                    No se encontraron profesores.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
