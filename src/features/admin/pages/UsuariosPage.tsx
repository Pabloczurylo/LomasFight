import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import UserForm from '../components/UserForm';
import UserList from '../components/UserList';
import { MOCK_USERS, User } from '../data/mockUsers';

export default function UsuariosPage() {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);

    const handleCreateUser = (userData: Omit<User, 'id' | 'avatar'>) => {
        const newUser: User = {
            ...userData,
            id: Date.now().toString(),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.nombre)}&background=random`
        };
        setUsers(prev => [newUser, ...prev]);
    };

    const handleEditUser = (user: User) => {
        // Mock edit functionality - just logging for now as mockup focused on creation
        console.log("Edit user", user);
        alert(`Editar usuario: ${user.nombre} (Funcionalidad pendiente)`);
    };

    const handleDeleteUser = (userId: string) => {
        if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            setUsers(prev => prev.filter(u => u.id !== userId));
        }
    };

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
