import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import DashboardHome from "../pages/DashboardHome";
import ClassesPage from "../pages/ClassesPage";
import AlumnosPage from "../pages/AlumnosPage";
import DisciplinasPage from "../pages/DisciplinasPage";
import PagosPage from "../pages/PagosPage";
import UsuariosPage from "../pages/UsuariosPage";
import TeachersPage from "../pages/TeachersPage";
import AlumnosPorDisciplina from "../pages/AlumnosPorDisciplina";
import { AdminOnlyRoute } from "../../../components/auth/ProtectedRoute";

export function AdminRoutes() {
    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                {/* Accesible para admin y profesores (cada profesor ve solo sus alumnos) */}
                <Route path="estados-alumnos" element={<AlumnosPorDisciplina />} />

                {/* Solo administradores */}
                <Route element={<AdminOnlyRoute />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="alumnos" element={<AlumnosPage />} />
                    <Route path="clases" element={<ClassesPage />} />
                    <Route path="disciplinas" element={<DisciplinasPage />} />
                    <Route path="pagos" element={<PagosPage />} />
                    <Route path="usuarios" element={<UsuariosPage />} />
                    <Route path="profesores" element={<TeachersPage />} />
                    <Route path="settings" element={<div>Configuración (Próximamente)</div>} />
                </Route>
            </Route>
        </Routes>
    );
}
