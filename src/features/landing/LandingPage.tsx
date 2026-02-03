
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { DisciplinesSection } from "./components/DisciplinesSection";
import { ScheduleSection } from "./components/ScheduleSection";

export default function LandingPage() {
    return (
        <>
            <HeroSection />
            <AboutSection />
            <DisciplinesSection />
            <ScheduleSection id="horarios-general" />
        </>
    );
}
