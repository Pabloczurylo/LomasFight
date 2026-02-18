import { useEffect, useState } from "react";
import { DisciplineCard } from "./DisciplineCard";
import { api } from "../../../services/api";

interface Discipline {
    id_disciplina: number;
    nombre_disciplina: string;
    descripcion: string; // Corrected to match Supabase
    img_banner: string; // Corrected to match Supabase
}

export function DisciplinesSection() {
    const [disciplines, setDisciplines] = useState<Discipline[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDisciplines = async () => {
            try {
                // Using the corrected endpoint from Sprint 9.1
                const response = await api.get('/diciplinas');
                setDisciplines(response.data);
            } catch (error) {
                console.error("Error fetching disciplines for landing:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDisciplines();
    }, []);

    if (loading) return null; // Or a skeleton/spinner, but null avoids layout shift flashing for now

    return (
        <section id="disciplinas" className="py-20 bg-brand-dark">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-brand-red font-heading font-bold tracking-widest text-lg mb-2">CLASES</h2>
                    <h3 className="text-3xl md:text-5xl font-heading font-bold text-white uppercase">DISCIPLINAS</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {disciplines.length > 0 ? (
                        disciplines.map((discipline) => (
                            <DisciplineCard
                                key={discipline.id_disciplina}
                                title={discipline.nombre_disciplina}
                                description={discipline.descripcion || "Entrena con los mejores profesionales en Lomas Fight."}
                                image={discipline.img_banner || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"}
                                slug={discipline.nombre_disciplina.toLowerCase().replace(/ /g, '-')}
                            />
                        ))
                    ) : (
                        <div className="col-span-3 text-center text-gray-400 py-12">
                            <p>No hay disciplinas disponibles en este momento.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
