import { Pencil, Trash2 } from 'lucide-react';
import { User } from '../data/mockUsers';
import { cn } from '../../../lib/utils';

interface UserListProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (userId: string) => void;
}

export default function UserList({ users, onEdit, onDelete }: UserListProps) {
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
                            <tr key={user.id} className="group hover:bg-gray-50 transition-colors">
                                <td className="py-4 pl-6 pr-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.nombre} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold">
                                                    {user.nombre.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <span className="font-bold text-gray-900 group-hover:text-brand-red transition-colors">
                                            {user.nombre}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-gray-600 text-sm">
                                    {user.email}
                                </td>
                                <td className="py-4 px-4">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                                        user.rol === 'Administrador' && "bg-blue-100 text-blue-700",
                                        user.rol === 'Entrenador' && "bg-green-100 text-green-700",
                                        user.rol === 'Recepción' && "bg-orange-100 text-orange-700"
                                    )}>
                                        {user.rol}
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
                                            onClick={() => onDelete(user.id)}
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
