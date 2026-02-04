import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { MobileSidebar } from "./MobileSidebar";
import { AdminHeader } from "./AdminHeader";

export function DashboardLayout() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop Sidebar - Fixed */}
            <Sidebar />

            {/* Mobile Sidebar - Drawer */}
            <MobileSidebar isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:ml-64 min-h-screen transition-all duration-300">
                <AdminHeader onMenuClick={() => setIsMobileOpen(true)} />

                <main className="flex-1 pt-16 p-4 md:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
