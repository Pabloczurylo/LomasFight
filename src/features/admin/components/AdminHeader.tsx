import { Bell, Search, Menu } from "lucide-react";


interface AdminHeaderProps {
    onMenuClick: () => void;
    title?: string;
}

export function AdminHeader({ onMenuClick, title = "Dashboard" }: AdminHeaderProps) {
    return (
        <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-heading font-bold text-gray-900 uppercase tracking-wide">{title}</h1>
            </div>

            <div className="flex items-center gap-4">
                {/* Search Bar - Hidden on small mobile */}
                <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 border border-transparent focus-within:border-brand-red/50 focus-within:bg-white transition-all">
                    <Search className="w-4 h-4 text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="bg-transparent border-none outline-none text-sm w-full font-body"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-brand-red rounded-full border border-white" />
                    </button>

                    {/* User Avatar Placeholder */}
                    <div className="w-9 h-9 rounded-full bg-brand-dark flex items-center justify-center text-white font-heading font-bold text-sm border-2 border-brand-red cursor-pointer">
                        AD
                    </div>
                </div>
            </div>
        </header>
    );
}
