import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./features/landing/LandingPage";
import DisciplineDetailPage from "./features/landing/pages/DisciplineDetailPage";
import { PublicLayout } from "./components/layout/PublicLayout";
import { AdminRoutes } from "./features/admin/routes/AdminRoutes";
import LoginPage from "./features/auth/pages/LoginPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes - Isolated from Public Layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Public Routes - Wrapped in PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/disciplina/:slug" element={<DisciplineDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
