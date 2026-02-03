import { useParams } from "react-router-dom";

import { MembershipSection } from "../components/MembershipSection";
import { ScheduleSection } from "../components/ScheduleSection";
import { BenefitsSection } from "../components/BenefitsSection";

// Duplicated data for now - in a real app this should be in a shared data file
import { Activity, Shield, Target, Zap, Dumbbell, Heart, LucideIcon } from "lucide-react";

interface BenefitData {
    title: string;
    description: string;
    icon: LucideIcon;
}

const DISCIPLINES = [
    {
        title: "FUERZA Y ACONDICIONAMIENTO",
        slug: "fuerza-y-acondicionamiento",
        description: "Mejora tu resistencia cardiovascular y muscular con ejercicios funcionales de alta intensidad.",
        intensity: 85,
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "KICKBOXING",
        slug: "kickboxing",
        description: "Domina el arte del golpeo con patadas y puños. Técnica, velocidad y potencia en cada movimiento.",
        intensity: 100,
        image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "BOXEO",
        slug: "boxeo",
        description: "El arte de la defensa y el golpeo preciso. Aprende a moverte y a golpear con inteligencia.",
        intensity: 90,
        image: "https://images.unsplash.com/photo-1599557718041-36b856641cd0?q=80&w=1974&auto=format&fit=crop"
    }
];

const TRAINERS = [
    {
        name: "Carlos Monzón",
        role: "Head Coach",
        image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=1887&auto=format&fit=crop"
    },
    {
        name: "María Nieves",
        role: "Instructor",
        image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1887&auto=format&fit=crop"
    }
];

const BENEFITS_DATA: Record<string, BenefitData[]> = {
    "kickboxing": [
        {
            title: "Técnica Depurada",
            description: "Aprende la ejecución perfecta de cada golpe. Desarrolla precisión milimétrica y una base técnica sólida que te acompañará siempre.",
            icon: Target
        },
        {
            title: "Resistencia Explosiva",
            description: "Lleva tu cardio al siguiente nivel. Nuestros entrenamientos de alta intensidad mejoran tu capacidad aeróbica y anaeróbica simultáneamente.",
            icon: Zap
        },
        {
            title: "Defensa Personal",
            description: "Gana confianza y seguridad. Adquiere herramientas prácticas y efectivas para protegerte en cualquier situación mientras entrenas.",
            icon: Shield
        }
    ],
    "boxeo": [
        {
            title: "Inteligencia de Ring",
            description: "El boxeo es ajedrez físico. Aprende a leer a tu oponente, anticipar movimientos y crear estrategias ganadoras en tiempo real.",
            icon: Activity
        },
        {
            title: "Potencia Controlada",
            description: "Desarrolla una pegada formidable canalizando la fuerza de todo tu cuerpo, no solo de tus brazos. Potencia con propósito.",
            icon: Dumbbell
        },
        {
            title: "Disciplina Mental",
            description: "Forja un carácter inquebrantable. El boxeo te enseña a mantener la calma bajo presión y a persistir cuando el cansancio ataca.",
            icon: Heart
        }
    ],
    "fuerza-y-acondicionamiento": [
        {
            title: "Fuerza Funcional",
            description: "Construye un cuerpo capaz de todo. Entrenamientos diseñados para mejorar tu rendimiento en la vida diaria y en el deporte.",
            icon: Dumbbell
        },
        {
            title: "Prevención de Lesiones",
            description: "Un cuerpo fuerte es un cuerpo seguro. Fortalece articulaciones y músculos estabilizadores para mantenerte activo y saludable.",
            icon: Shield
        },
        {
            title: "Metabolismo Activo",
            description: "Convierte tu cuerpo en una máquina de quemar energía. Aumenta tu masa muscular y mantén tu metabolismo acelerado todo el día.",
            icon: Activity
        }
    ]
};

export default function DisciplineDetailPage() {
    const { slug } = useParams();

    // Simple matching logic - handling both URL friendly slugs and direct titles if needed
    // In a real scenario, we'd have consistent slugs in data
    const discipline = DISCIPLINES.find(d =>
        d.slug === slug || d.title.toLowerCase().replace(/ /g, '-') === slug
    );

    if (!discipline) {
        return <div className="min-h-screen flex items-center justify-center text-white bg-black">Disciplina no encontrada</div>;
    }

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full bg-black">
                <img
                    src={discipline.image}
                    alt={discipline.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full px-4 py-8 md:p-16 container mx-auto max-w-full">
                    <h1 className="text-2xl md:text-7xl font-heading font-bold text-white uppercase mb-4 hyphens-auto break-words text-balance">{discipline.title}</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mb-8">{discipline.description}</p>

                </div>
            </div>

            <BenefitsSection
                disciplineName={discipline.title}
                benefits={BENEFITS_DATA[discipline.slug || "kickboxing"] || BENEFITS_DATA["kickboxing"]}
                image={discipline.image}
            />

            <MembershipSection
                planTitle={`PLAN ${discipline.title}`}
                features={[
                    "3 Clases por semana",
                    "Equipo incluido",
                    "Acceso a vestuarios",
                    "Instructor certificado"
                ]}
            />

            <ScheduleSection
                id="horarios-disciplina"
                title="HORARIOS"
                subtitle={`CLASES DE ${discipline.title}`}
                scheduleData={[
                    {
                        day: "LUNES",
                        classes: [{ time: "18:00", class: discipline.title, coach: "Staff" }, null, null]
                    },
                    {
                        day: "MIÉRCOLES",
                        classes: [{ time: "18:00", class: discipline.title, coach: "Staff" }, null, null]
                    },
                    {
                        day: "VIERNES",
                        classes: [{ time: "18:00", class: discipline.title, coach: "Staff" }, null, null]
                    },
                    { day: "MARTES", classes: [null, null, null] },
                    { day: "JUEVES", classes: [null, null, null] },
                    { day: "SÁBADO", classes: [null, null, null] },
                ].filter(d => ["LUNES", "MIÉRCOLES", "VIERNES"].includes(d.day))}
            />

            {/* Trainers Section */}
            <section className="py-20 bg-brand-dark">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-brand-red font-heading font-bold tracking-widest text-lg mb-2">TEAM</h2>
                        <h3 className="text-4xl md:text-5xl font-heading font-bold text-white uppercase">NUESTROS ENTRENADORES</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {TRAINERS.map((trainer, idx) => (
                            <div key={idx} className="group relative overflow-hidden rounded-xl h-[400px] shadow-lg">
                                <img
                                    src={trainer.image}
                                    alt={trainer.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                <div className="absolute bottom-0 left-0 w-full p-6">
                                    <h4 className="text-2xl font-heading font-bold text-white uppercase">{trainer.name}</h4>
                                    <p className="text-brand-red font-medium">{trainer.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
