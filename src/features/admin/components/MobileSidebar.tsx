import { LayoutDashboard, Users, Calendar, CreditCard, Settings, LogOut, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../../lib/utils";

const NAV_ITEMS = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Alumnos", path: "/admin/alumnos", icon: Users },
    { name: "Clases", path: "/admin/clases", icon: Calendar },
    { name: "Pagos", path: "/admin/pagos", icon: CreditCard },
    { name: "Configuración", path: "/admin/settings", icon: Settings },
];

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
    const location = useLocation();

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Drawer */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 w-64 bg-black text-white z-50 lg:hidden transform transition-transform duration-300 ease-in-out border-r border-zinc-800 flex flex-col",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo Area & Close Button */}
                <div className="p-6 flex items-center justify-between border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-brand-red rounded transform skew-x-[-10deg]" />
                        <span className="text-lg font-heading font-bold uppercase tracking-wider">
                            LOMAS <span className="text-brand-red">FIGHT</span>
                        </span>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
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
                <div className="p-4 border-t border-zinc-800">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-zinc-400 hover:bg-zinc-900 hover:text-red-500 transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="font-heading font-semibold tracking-wide text-sm uppercase">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
