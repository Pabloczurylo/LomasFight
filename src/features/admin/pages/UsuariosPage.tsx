import { useState, useEffect } from 'react';
import { ChevronRight, Shield, X } from 'lucide-react';
import UserForm from '../components/UserForm';
import UserList from '../components/UserList';
import { Usuario } from '../types';
import { api } from '../../../services/api';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';

interface Disciplina {
    id_disciplina: number;
    nombre_disciplina: string;
}

// ─── Edit User Modal ───────────────────────────────────────────────────────────

interface EditUserModalProps {
    user: Usuario | null;
    disciplines: Disciplina[];
    onClose: () => void;
    onSave: (userId: number, data: { nombre_usuario: string; mail_usuario: string; rol: string }) => Promise<void>;
}

function EditUserModal({ user, disciplines, onClose, onSave }: EditUserModalProps) {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [rol, setRol] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setNombre(user.nombre_usuario);
            setEmail(user.mail_usuario);
            setRol(user.rol);
        }
    }, [user]);

    if (!user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre || !email || !rol) return;
        setSaving(true);
        try {
            await onSave(user.id_usuario, { nombre_usuario: nombre, mail_usuario: email, rol });
            onClose();
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-xl font-heading font-bold text-gray-900">Editar Usuario</h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-700">Nombre</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white outline-none text-gray-900 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-700">Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white outline-none text-gray-900 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-700">Rol</label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                                <Shield size={18} />
                            </div>
                            <select
                                value={rol}
                                onChange={e => setRol(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white outline-none appearance-none text-gray-900 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 transition-all cursor-pointer"
                            >
                                <option value="" disabled>Seleccione un rol</option>
                                <option value="admin">Administrador</option>
                                {disciplines.map(d => (
                                    <option key={d.id_disciplina} value={d.nombre_disciplina}>
                                        {d.nombre_disciplina}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 italic">El rol determina el acceso del usuario al sistema.</p>
                    </div>

                    <div className={cn(
                        "text-xs p-3 rounded-lg",
                        rol === 'admin' ? "bg-red-50 text-red-700 border border-red-100" : "bg-blue-50 text-blue-700 border border-blue-100"
                    )}>
                        {rol === 'admin'
                            ? '⚠️ Los administradores tienen acceso total al sistema.'
                            : rol
                                ? `Este usuario será profesor de ${rol} y solo gestionará sus alumnos.`
                                : 'Seleccioná un rol para continuar.'
                        }
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-4 py-2.5 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 transition-all disabled:opacity-60"
                        >
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function UsuariosPage() {
    const [users, setUsers] = useState<Usuario[]>([]);
    const [disciplines, setDisciplines] = useState<Disciplina[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<Usuario | null>(null);
    const navigate = useNavigate();

    const fetchUsuarios = async () => {
        try {
            const [usersRes, discsRes] = await Promise.all([
                api.get('/usuarios'),
                api.get<Disciplina[]>('/diciplinas')
            ]);
            setUsers(usersRes.data);
            setDisciplines(discsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error instanceof AxiosError && error.response?.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleCreateUser = async (userData: { nombre_usuario: string; mail_usuario: string; contrasena_usuario: string; rol: string }) => {
        try {
            await api.post('/usuarios', userData);
            fetchUsuarios();
        } catch (error) {
            console.error("Error creating usuario:", error);
            if (error instanceof AxiosError && error.response?.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
    };

    const handleEditUser = (user: Usuario) => {
        setEditingUser(user);
    };

    const handleSaveEdit = async (userId: number, data: { nombre_usuario: string; mail_usuario: string; rol: string }) => {
        await api.put(`/usuarios/${userId}`, data);
        await fetchUsuarios();
    };

    const handleDeleteUser = async (userId: number) => {
        if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            try {
                await api.delete(`/usuarios/${userId}`);
                setUsers(prev => prev.filter(u => u.id_usuario !== userId));
            } catch (error) {
                console.error("Error deleting usuario:", error);
                if (error instanceof AxiosError && error.response?.status === 401) {
                    localStorage.clear();
                    navigate('/login');
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header / Breadcrumbs */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                    <span>Admin</span>
                    <ChevronRight size={14} />
                    <span>Usuarios</span>
                    <ChevronRight size={14} />
                    <span className="text-gray-900 font-bold">Nuevo</span>
                </div>
                <h1 className="text-4xl font-heading font-black text-gray-900 mt-2">
                    Crear Nuevo Usuario
                </h1>
                <p className="text-gray-600 text-lg">
                    Ingrese los datos para registrar un nuevo integrante al equipo administrativo.
                </p>
            </div>

            {/* Form Section */}
            <UserForm
                onSubmit={handleCreateUser}
                onCancel={() => console.log("Cancel clicked")}
                disciplines={disciplines}
            />

            {/* List Section */}
            <div className="space-y-6 pt-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-heading font-bold text-gray-900">
                        Usuarios Recientes
                    </h2>
                </div>
                <UserList
                    users={users}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                />
            </div>

            {/* Edit Modal */}
            <EditUserModal
                user={editingUser}
                disciplines={disciplines}
                onClose={() => setEditingUser(null)}
                onSave={handleSaveEdit}
            />
        </div>
    );
}
