import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import UserForm from '../components/UserForm';
import UserList from '../components/UserList';
import { Usuario } from '../types';
import { api } from '../../../services/api';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UsuariosPage() {
    const [users, setUsers] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUsuarios = async () => {
        try {
            const response = await api.get('/usuarios');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching usuarios:', error);
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
            const response = await api.post('/usuarios', userData);
            if (response.data) { // Assuming response returns created user
                // If we had the created user with ID, we'd add it. 
                // But safest is refetch or assume structure. 
                // Let's refetch to be consistent and safe with IDs and server-side logic
                fetchUsuarios();
            }
        } catch (error) {
            console.error("Error creating usuario:", error);
            if (error instanceof AxiosError && error.response?.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
    };

    const handleEditUser = (user: Usuario) => {
        // Mock edit functionality - just logging for now as mockup focused on creation
        console.log("Edit user", user);
        alert(`Editar usuario: ${user.nombre_usuario} (Funcionalidad pendiente)`);
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
        </div>
    );
}
