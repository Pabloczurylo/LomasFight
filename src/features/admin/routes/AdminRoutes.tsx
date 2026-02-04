import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import DashboardHome from "../pages/DashboardHome";

export function AdminRoutes() {
    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="alumnos" element={<div>Gestión de Alumnos (Próximamente)</div>} />
                <Route path="clases" element={<div>Gestión de Clases (Próximamente)</div>} />
                <Route path="pagos" element={<div>Gestión de Pagos (Próximamente)</div>} />
                <Route path="settings" element={<div>Configuración (Próximamente)</div>} />
            </Route>
        </Routes>
    );
}
