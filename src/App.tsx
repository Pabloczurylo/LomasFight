import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./features/landing/LandingPage";
import DisciplineDetailPage from "./features/landing/pages/DisciplineDetailPage";
import { PublicLayout } from "./components/layout/PublicLayout";

function App() {
  return (
    <BrowserRouter>
      <PublicLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/disciplina/:slug" element={<DisciplineDetailPage />} />
        </Routes>
      </PublicLayout>
    </BrowserRouter>
  );
}

export default App;
