import { Menu } from "lucide-react";


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
        </header>
    );
}
