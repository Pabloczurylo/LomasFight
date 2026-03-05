
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { AboutUs } from "./components/AboutUs";
import { DisciplinesSection } from "./components/DisciplinesSection";
import { ScheduleSection } from "./components/ScheduleSection";

export default function LandingPage() {
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
