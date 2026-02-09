import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Mail, Lock, CheckSquare, Square, Trophy } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
    const [rememberMe, setRememberMe] = useState(false);

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Image & Branding */}
            <div className="hidden lg:flex w-1/2 relative bg-black items-end p-12 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop"
                        alt="Lomas Fight Athlete"
                        className="w-full h-full object-cover opacity-50 grayscale"
                    />
                </div>

                {/* Content Overlay */}
                <div className="relative z-20 text-white max-w-xl">
                    <h1 className="text-6xl font-heading font-bold uppercase leading-none mb-4">
                        FORJADO <br />
                        <span className="text-brand-red">CAMPEONES</span>
                    </h1>
                    <div className="h-16 w-1 bg-brand-red absolute -left-6 top-2 hidden xl:block"></div>
                    <p className="border-l-4 border-brand-red pl-6 text-gray-300 text-lg font-light leading-relaxed">
                        Sistema centralizado para la gestión de alto rendimiento y administración deportiva.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo & Header */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-brand-red mb-6">
                            <div className="bg-brand-red text-white p-2 rounded-lg">
                                <Trophy size={28} strokeWidth={2.5} />
                            </div>
                            <span className="text-2xl font-heading font-bold text-black tracking-tight">
                                LOMAS <span className="text-brand-red">FIGHT</span>
                            </span>
                        </div>
                        <h2 className="text-3xl font-heading font-bold text-gray-900">
                            Iniciar Sesión
                        </h2>
                        <p className="text-gray-500">
                            Bienvenido al panel de gestión administrativa.
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">
                                    Correo electrónico
                                </label>
                                <Input
                                    type="email"
                                    placeholder="usuario@lomasfight.com"
                                    startIcon={<Mail size={18} />}
                                    className="bg-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">
                                    Contraseña
                                </label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    startIcon={<Lock size={18} />}
                                    className="bg-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2 cursor-pointer group">
                                <div
                                    className="relative"
                                    onClick={() => setRememberMe(!rememberMe)}
                                >
                                    {rememberMe ? (
                                        <CheckSquare className="text-brand-red" size={20} />
                                    ) : (
                                        <Square className="text-gray-300 group-hover:text-gray-400 transition-colors" size={20} />
                                    )}
                                </div>
                                <span className="text-sm text-gray-600 select-none" onClick={() => setRememberMe(!rememberMe)}>
                                    Recordarme
                                </span>
                            </label>
                            <Link to="#" className="text-sm font-bold text-brand-red hover:text-red-700 transition-colors">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <Button className="w-full h-12 text-lg shadow-lg shadow-brand-red/30" size="lg">
                            ACCEDER
                        </Button>
                    </form>

                    {/* Footer Links */}
                    <div className="pt-8 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                        <p>© 2024 Lomas Fight Gym Management.</p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-gray-600">Privacidad</a>
                            <a href="#" className="hover:text-gray-600">Soporte</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
