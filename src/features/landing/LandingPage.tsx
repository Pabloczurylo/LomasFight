
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { AboutUs } from "./components/AboutUs";
import { DisciplinesSection } from "./components/DisciplinesSection";
import { ScheduleSection } from "./components/ScheduleSection";
import { META_HOME, usePageMeta } from "../../lib/seo";

export default function LandingPage() {
    // Restaura título/descripción de la home al volver desde otra página
    usePageMeta(META_HOME);
    return (
        <>
            <HeroSection />
            <AboutUs />
            <DisciplinesSection />
            <ScheduleSection id="horarios-general" />
            <AboutSection />
        </>
    );
}
