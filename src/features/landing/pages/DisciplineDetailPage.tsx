import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Target, Zap } from "lucide-react";

import { MembershipSection } from "../components/MembershipSection";
import { ScheduleSection } from "../components/ScheduleSection";
import { BenefitsSection } from "../components/BenefitsSection";
import { api } from "../../../services/api";
import { Button } from "../../../components/ui/Button";

interface DisciplineData {
    id_disciplina: number;
    nombre: string;
    descripcion: string;
    cuota_mensual: number;
    imagen_url: string;
}

const GENERIC_BENEFITS = [
    {
        title: "Enfoque Técnico",
        description: "Aprendé la ejecución correcta de cada movimiento con una base sólida que te acompañará siempre.",
        icon: Target
    },
    {
        title: "Acondicionamiento Integral",
        description: "Mejorá tu capacidad física, resistencia y energía a través de entrenamientos diseñados para tu progreso.",
        icon: Zap
    },
    {
        title: "Bienestar y Confianza",
        description: "Ganá seguridad en un ambiente motivador, ideal para liberar tensiones y alcanzar tu mejor versión.",
        icon: Shield
    }
];

export default function DisciplineDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [discipline, setDiscipline] = useState<DisciplineData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchDiscipline = async () => {
            try {
                setLoading(true);
                setError(false);
                // Respecting backend spelling: "diciplinas"
                const response = await api.get(`/diciplinas/${id}`);
                setDiscipline(response.data);
            } catch (err) {
                console.error("Error fetching discipline:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDiscipline();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white bg-black">
                <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mb-4"></div>
                Cargando disciplina...
            </div>
        );
    }

    if (error || !discipline) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white bg-black">
                <p className="text-xl mb-6">Disciplina no encontrada</p>
                <Button variant="outline" onClick={() => navigate('/#disciplinas')} className="gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Volver
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white">
            {/* Top Back Button */}
            <div className="absolute top-24 left-4 md:left-8 z-50">
                <Button
                    variant="outline"
                    className="bg-black/50 hover:bg-black/80 text-white border-white/20 backdrop-blur-sm gap-2"
                    onClick={() => navigate('/#disciplinas')}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </Button>
            </div>

            {/* Hero Section */}
            <div className="relative h-[60vh] w-full bg-black">
                <img
                    src={discipline.imagen_url || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop"}
                    alt={discipline.nombre}
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full px-4 py-8 md:p-16 container mx-auto max-w-full">
                    <h1 className="text-2xl md:text-7xl font-heading font-bold text-white uppercase mb-4 hyphens-auto break-words text-balance">
                        {discipline?.nombre || 'Cargando...'}
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mb-8">
                        {discipline?.descripcion || "Sumate a nuestras clases y superá tus límites día a día."}
                    </p>
                </div>
            </div>

            {/* Generic Benefits */}
            <BenefitsSection
                disciplineName={discipline?.nombre || 'Disciplina'}
                benefits={GENERIC_BENEFITS}
                image={discipline?.imagen_url || ''}
            />

            {/* Membresía (Prices) */}
            <MembershipSection
                planTitle={`PLAN ${(discipline?.nombre || 'CARGANDO...').toUpperCase()}`}
                price={discipline?.cuota_mensual?.toString() || ''}
                features={[
                    "3 Clases por semana",
                    "Equipo incluido",
                    "Acceso a vestuarios",
                    "Instructor certificado"
                ]}
            />

            {/* Static Schedule (Mocked for now since API might not have it or we don't have it in scope) */}
            <ScheduleSection
                id="horarios-disciplina"
                title="HORARIOS"
                subtitle={`CLASES DE ${(discipline?.nombre || 'CARGANDO...').toUpperCase()}`}
                scheduleData={[
                    {
                        day: "LUNES",
                        classes: [{ time: "18:00", class: discipline?.nombre || '', coach: "Staff" }, null, null]
                    },
                    {
                        day: "MIÉRCOLES",
                        classes: [{ time: "18:00", class: discipline?.nombre || '', coach: "Staff" }, null, null]
                    },
                    {
                        day: "VIERNES",
                        classes: [{ time: "18:00", class: discipline?.nombre || '', coach: "Staff" }, null, null]
                    }
                ]}
            />

            {/* Instructors Placeholder */}
            <section className="py-20 bg-brand-dark">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-brand-red font-heading font-bold tracking-widest text-lg mb-2">TEAM</h2>
                    <h3 className="text-4xl md:text-5xl font-heading font-bold text-white uppercase mb-8">NUESTROS INSTRUCTORES</h3>

                    <div className="max-w-2xl mx-auto bg-black rounded-xl p-12 border border-white/10">
                        <p className="text-xl text-gray-300 font-medium">
                            Próximamente verás aquí a los profesionales encargados de esta actividad
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
