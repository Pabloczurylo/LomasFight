import { PublicLayout } from "../../components/layout/PublicLayout";
import { HeroSection } from "./components/HeroSection";
import { DisciplinesSection } from "./components/DisciplinesSection";
import { MembershipSection } from "./components/MembershipSection";
import { ScheduleSection } from "./components/ScheduleSection";

export default function LandingPage() {
    return (
        <PublicLayout>
            <HeroSection />
            <DisciplinesSection />
            <MembershipSection />
            <ScheduleSection />
        </PublicLayout>
    );
}
