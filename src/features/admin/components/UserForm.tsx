import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Shield, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface UserFormProps {
    onSubmit: (userData: { nombre_usuario: string; mail_usuario: string; contrasena_usuario: string; rol: string }) => void;
    onCancel: () => void;
}

export default function UserForm({ onSubmit, onCancel }: UserFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        rol: '' as string
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.rol) {
            const payload = {
                nombre_usuario: formData.nombre,
                mail_usuario: formData.email,
                contrasena_usuario: formData.password,
                rol: formData.rol // Send as string directly
            };
            console.log('Enviando usuario:', payload);
            onSubmit(payload);
            // Reset form
            setFormData({ nombre: '', email: '', password: '', rol: '' });
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre Completo */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">
                            Nombre Completo
                        </label>
                        <Input
                            placeholder="Ej. Juan Perez"
                            startIcon={<UserIcon size={18} />}
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            required
                            className="text-black"
                        />
                    </div>

                    {/* Correo Electrónico */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">
                            Correo Electrónico
                        </label>
                        <Input
                            type="email"
                            placeholder="juan@lomasfight.com"
                            startIcon={<Mail size={18} />}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="text-black"
                        />
                    </div>

                    {/* Contraseña */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">
                            Contraseña
                        </label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                startIcon={<Lock size={18} />}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                minLength={8}
                                className="text-black"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 italic ml-1">
                            Mínimo 8 caracteres, incluir números y letras.
                        </p>
                    </div>

                    {/* Asignar Rol */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">
                            Asignar Rol
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                                <Shield size={18} />
                            </div>
                            <select
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red appearance-none text-gray-900"
                                value={formData.rol}
                                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                                required
                            >
                                <option value="" disabled>Seleccione un rol</option>
                                <option value="admin">Administrador</option>
                                <option value="profesor">Profesor</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-50">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 text-gray-500 font-bold hover:text-gray-700 transition-colors"
                    >
                        Cancelar
                    </button>
                    <Button
                        type="submit"
                        className="bg-brand-red hover:bg-red-700 text-white shadow-lg shadow-brand-red/30 px-6"
                    >
                        <Plus size={18} className="mr-2" />
                        Crear Usuario
                    </Button>
                </div>
            </form>

            {/* Info Message */}
            <div className="mt-8 bg-red-50 border border-red-100 rounded-lg p-4 flex items-start gap-3">
                <div className="bg-brand-red text-white p-1 rounded-full shrink-0 mt-0.5">
                    <span className="font-bold text-xs">i</span>
                </div>
                <p className="text-sm text-gray-700">
                    Asegúrese de seleccionar el rol correcto. Los administradores tienen acceso total, mientras que los profesores tienen acceso limitado.
                </p>
            </div>
        </div>
    );
}
