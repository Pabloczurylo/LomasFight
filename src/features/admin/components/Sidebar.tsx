import { LayoutDashboard, Users, Calendar, CreditCard, LogOut, Dumbbell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../../lib/utils"; // Assuming utils exist, or I will use clsx/tailwind-merge directly if needed

const NAV_ITEMS = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Alumnos", path: "/admin/alumnos", icon: Users },
    { name: "Clases", path: "/admin/clases", icon: Calendar },
    { name: "Disciplinas", path: "/admin/disciplinas", icon: Dumbbell },
    { name: "Pagos", path: "/admin/pagos", icon: CreditCard },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <aside className="hidden lg:flex flex-col w-64 bg-black text-white h-screen fixed left-0 top-0 border-r border-zinc-800">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-2 border-b border-zinc-800">
                <div className="h-8 w-8 bg-brand-red rounded transform skew-x-[-10deg]" />
                <span className="text-xl font-heading font-bold uppercase tracking-wider">
                    LOMAS <span className="text-brand-red">FIGHT</span>
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-brand-red text-white shadow-lg shadow-brand-red/20"
                                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-zinc-400 group-hover:text-white")} />
                            <span className="font-heading font-semibold tracking-wide text-sm uppercase">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout/Footer */}
            <div className="p-4 border-t border-zinc-800 space-y-4">
                <div className="flex items-center gap-3 px-4">
                    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                        <span className="text-xs font-bold text-brand-red">
                            {JSON.parse(localStorage.getItem('usuario') || '{}').nombre_usuario?.charAt(0).toUpperCase() || 'A'}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-white leading-none">
                            {JSON.parse(localStorage.getItem('usuario') || '{}').nombre_usuario || 'Administrador'}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                            {JSON.parse(localStorage.getItem('usuario') || '{}').rol_usuario || 'Staff'}
                        </span>
                    </div>
                </div>

                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-zinc-400 hover:bg-zinc-900 hover:text-red-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="font-heading font-semibold tracking-wide text-sm uppercase">Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
}
