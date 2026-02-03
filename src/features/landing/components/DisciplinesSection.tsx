import { DisciplineCard } from "./DisciplineCard";

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

export function DisciplinesSection() {
    return (
        <section id="disciplinas" className="py-20 bg-brand-dark">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-brand-red font-heading font-bold tracking-widest text-lg mb-2">CLASES</h2>
                    <h3 className="text-3xl md:text-5xl font-heading font-bold text-white uppercase">DISCIPLINAS</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {DISCIPLINES.map((discipline) => (
                        <DisciplineCard
                            key={discipline.title}
                            {...discipline}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
