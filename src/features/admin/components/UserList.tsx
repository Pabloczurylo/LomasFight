import { Pencil, Trash2, User as UserIcon } from 'lucide-react';
import { Usuario } from '../types';
import { cn } from '../../../lib/utils';

interface UserListProps {
    users: Usuario[];
    onEdit: (user: Usuario) => void;
    onDelete: (userId: number) => void;
}

export default function UserList({ users, onEdit, onDelete }: UserListProps) {
    const getRoleName = (user: Usuario) => {
        // Enforce role name based on string 'rol'
        if (user.rol === 'admin') return 'Administrador';
        if (user.rol === 'profesor') return 'Profesor';
        return user.rol || 'Desconocido';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-gray-50/50">
                        <tr className="border-b border-gray-100">
                            <th className="py-4 pl-6 pr-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Nombre</th>
                            <th className="py-4 px-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Correo Electrónico</th>
                            <th className="py-4 px-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Rol</th>
                            <th className="py-4 pr-6 pl-4 font-bold text-gray-500 text-xs uppercase tracking-wider text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.id_usuario} className="group hover:bg-gray-50 transition-colors">
                                <td className="py-4 pl-6 pr-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center text-gray-500">
                                            <UserIcon size={20} />
                                        </div>
                                        <span className="font-bold text-gray-900 group-hover:text-brand-red transition-colors">
                                            {user.nombre_usuario}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-gray-600 text-sm">
                                    {user.mail_usuario}
                                </td>
                                <td className="py-4 px-4">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                                        (user.rol === 'admin' || getRoleName(user) === 'Administrador') && "bg-red-100 text-red-700",
                                        (user.rol === 'profesor' || getRoleName(user) === 'Profesor') && "bg-green-100 text-green-700"
                                    )}>
                                        {getRoleName(user)}
                                    </span>
                                </td>
                                <td className="py-4 pr-6 pl-4 text-right">
                                    <div className="flex items-center justify-end gap-2 text-gray-400">
                                        <button
                                            onClick={() => onEdit(user)}
                                            className="p-1.5 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(user.id_usuario)}
                                            className="p-1.5 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-right text-xs font-bold text-gray-500 uppercase tracking-wide">
                <span>{users.length} usuarios registrados</span>
            </div>
        </div>
    );
}
