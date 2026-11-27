import { Navigate, Outlet } from "react-router-dom";

type StoredUser = { rol?: string };

function getStoredUser(): StoredUser {
    try {
        return JSON.parse(localStorage.getItem("usuario") || "{}");
    } catch {
        return {};
    }
}

/**
 * true si el JWT está mal formado o tiene vencimiento y ya pasó.
 * Los tokens sin vencimiento (el default) son válidos; la firma y si el usuario
 * sigue activo los valida el backend en cada pedido.
 */
function isTokenExpired(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
        return typeof payload.exp === "number" && payload.exp * 1000 <= Date.now();
    } catch {
        return true;
    }
}

export const ProtectedRoute = () => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

/** Solo administradores. Un profesor es enviado a su vista de alumnos. */
export const AdminOnlyRoute = () => {
    if (getStoredUser().rol !== "admin") {
        return <Navigate to="/admin/estados-alumnos" replace />;
    }
    return <Outlet />;
};
