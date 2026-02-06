import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import DashboardHome from "../pages/DashboardHome";
import ClassesPage from "../pages/ClassesPage";
import AlumnosPage from "../pages/AlumnosPage";

export function AdminRoutes() {
    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="alumnos" element={<AlumnosPage />} />
                <Route path="clases" element={<ClassesPage />} />
                <Route path="pagos" element={<div>Gestión de Pagos (Próximamente)</div>} />
                <Route path="settings" element={<div>Configuración (Próximamente)</div>} />
            </Route>
        </Routes>
    );
}
