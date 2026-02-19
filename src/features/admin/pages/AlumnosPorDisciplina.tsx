import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { Loader2, Search } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

// Types
interface Disciplina {
    id_disciplina: number;
    nombre_disciplina: string;
}

interface Alumno {
    id_cliente: number;
    nombre: string;
    apellido: string;
    fecha_registro: string;
    activo: boolean;
    id_disciplina: number;
}

export default function AlumnosPorDisciplina() {
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [selectedDisciplina, setSelectedDisciplina] = useState<number | null>(null);
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Fetch Disciplinas
    useEffect(() => {
        const fetchDisciplinas = async () => {
            try {
                const response = await api.get('/diciplinas');
                setDisciplinas(response.data);
                if (response.data.length > 0) {
                    setSelectedDisciplina(response.data[0].id_disciplina);
                }
            } catch (error) {
                console.error('Error fetching disciplinas:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDisciplinas();
    }, []);

    // Fetch Alumnos when discipline changes
    useEffect(() => {
        if (!selectedDisciplina) return;

        const fetchAlumnos = async () => {
            setLoading(true);
            try {
                // Fetch all clients, filter by discipline in frontend
                // Ideally backend should support filtering: /clientes?id_disciplina=...
                const response = await api.get('/clientes');
                const allClients = response.data;

                // Filter by selected discipline
                const filtered = allClients.filter((c: any) => c.id_disciplina === selectedDisciplina);

                // Map to local interface
                const mappedAlumnos: Alumno[] = filtered.map((c: any) => {
                    console.log('Mapping client:', c); // Debug log
                    return {
                        id_cliente: c.id_cliente || c.id, // Robust ID check
                        nombre: c.nombre,
                        apellido: c.apellido,
                        fecha_registro: c.fecha_registro || new Date().toISOString(), // Fallback
                        activo: c.activo !== false, // Default to true if null/undefined
                        id_disciplina: c.id_disciplina
                    };
                });

                setAlumnos(mappedAlumnos);

            } catch (error) {
                console.error('Error fetching alumnos:', error);
                if (error instanceof AxiosError && error.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAlumnos();
    }, [selectedDisciplina, navigate]);

    const handleToggleStatus = async (id: number, currentStatus: boolean) => {
        setUpdatingId(id);
        const newStatus = !currentStatus;

        // Optimistic Update
        setAlumnos(prev => prev.map(a =>
            a.id_cliente === id ? { ...a, activo: newStatus } : a
        ));

        try {
            // Fix: Clean ID to avoid any suffix like :1
            const cleanId = String(id).split(':')[0];
            const endpoint = `/clientes/${cleanId}`;
            console.log('Sending PUT to:', endpoint);

            // Backend logic `...(activo !== undefined && { activo })` allows partial update of status
            await api.put(endpoint, { activo: newStatus });
        } catch (error) {
            console.error('Error updating status:', error);
            // Rollback
            setAlumnos(prev => prev.map(a =>
                a.id_cliente === id ? { ...a, activo: currentStatus } : a
            ));
            alert('Error al actualizar el estado. Por favor intente nuevamente.');
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredAlumnos = alumnos.filter((alumno) =>
        alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumno.apellido.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && disciplinas.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            <div>
                <h2 className="text-3xl font-heading font-bold text-gray-900">Gestión de Estados</h2>
                <p className="text-gray-600">Administra la vigencia de los alumnos por disciplina.</p>
            </div>

            {/* Controls: Selector & Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">

                <div className="w-full sm:w-auto">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
                    <select
                        value={selectedDisciplina || ''}
                        onChange={(e) => setSelectedDisciplina(Number(e.target.value))}
                        className="w-full sm:w-64 rounded-lg border-gray-300 text-black focus:border-brand-red focus:ring-brand-red shadow-sm"
                    >
                        {disciplinas.map(d => (
                            <option key={d.id_disciplina} value={d.id_disciplina}>
                                {d.nombre_disciplina}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full sm:w-auto relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar alumno..."
                        className="pl-10 w-full sm:w-64 rounded-lg border-gray-300 text-black focus:border-brand-red focus:ring-brand-red shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-heading font-bold text-gray-900 uppercase text-xs tracking-wider">Alumno</th>
                                <th className="hidden md:table-cell px-6 py-4 font-heading font-bold text-gray-900 uppercase text-xs tracking-wider">Fecha Inicio</th>
                                <th className="px-6 py-4 font-heading font-bold text-gray-900 uppercase text-xs tracking-wider text-right">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAlumnos.length > 0 ? (
                                filteredAlumnos.map((alumno) => (
                                    <tr key={alumno.id_cliente} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                                                    {alumno.nombre.charAt(0)}{alumno.apellido.charAt(0)}
                                                </div>
                                                <span className="font-medium text-gray-900">
                                                    {alumno.nombre} {alumno.apellido}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell px-6 py-4 text-gray-600 text-sm">
                                            {new Date(alumno.fecha_registro).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleToggleStatus(alumno.id_cliente, alumno.activo)}
                                                disabled={updatingId === alumno.id_cliente}
                                                className={cn(
                                                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2",
                                                    alumno.activo ? "bg-green-500" : "bg-gray-200"
                                                )}
                                            >
                                                <span className="sr-only">Toggle status</span>
                                                <span
                                                    aria-hidden="true"
                                                    className={cn(
                                                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                                        alumno.activo ? "translate-x-5" : "translate-x-0"
                                                    )}
                                                />
                                            </button>
                                            <span className={cn(
                                                "ml-2 text-xs font-semibold uppercase w-16 inline-block text-center",
                                                alumno.activo ? "text-green-600" : "text-gray-500"
                                            )}>
                                                {alumno.activo ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                        No se encontraron alumnos para esta disciplina.
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
