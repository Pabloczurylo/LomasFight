import { useEffect, useState, useCallback } from "react";
import { DisciplineCard } from "./DisciplineCard";
import { api } from "../../../services/api";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Discipline {
    id_disciplina: number;
    nombre_disciplina: string;
    descripcion: string;
    img_banner: string;
    img_preview: string;
}

export function DisciplinesSection() {
    const [disciplines, setDisciplines] = useState<Discipline[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) { // lg breakpoint
                setItemsPerPage(1);
            } else {
                setItemsPerPage(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const next = useCallback(() => {
        setCurrentIndex(prev => {
            const nextIndex = prev + itemsPerPage;
            return nextIndex < disciplines.length ? nextIndex : prev;
        });
    }, [itemsPerPage, disciplines.length]);

    const prev = useCallback(() => {
        setCurrentIndex(prev => {
            const nextIndex = prev - itemsPerPage;
            return nextIndex >= 0 ? nextIndex : 0;
        });
    }, [itemsPerPage]);

    useEffect(() => {
        if (currentIndex >= disciplines.length && disciplines.length > 0) {
            setCurrentIndex(0);
        }
    }, [itemsPerPage, disciplines.length, currentIndex]);

    const visibleDisciplines = disciplines.slice(currentIndex, currentIndex + itemsPerPage);

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

                <div className="relative w-full flex items-center justify-center">
                    {/* Prev Button */}
                    {disciplines.length > itemsPerPage && (
                        <button
                            onClick={prev}
                            disabled={currentIndex === 0}
                            className="absolute left-0 sm:left-4 md:left-8 z-20 p-2 sm:p-3 rounded-full bg-brand-red/10 text-brand-red border border-brand-red/20 hover:bg-brand-red/20 hover:bg-brand-red/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                        </button>
                    )}

                    <div className="w-full flex justify-center gap-6 lg:gap-8 flex-col lg:flex-row px-12 sm:px-16 md:px-24 items-center">
                        {disciplines.length > 0 ? (
                            visibleDisciplines.map((discipline) => (
                                <div key={discipline.id_disciplina} className="w-full sm:max-w-[380px]">
                                    <DisciplineCard
                                        title={discipline.nombre_disciplina}
                                        description={discipline.descripcion || "Entrena con los mejores profesionales en Lomas Fight."}
                                        image={discipline.img_preview || discipline.img_banner || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"}
                                        slug={discipline.nombre_disciplina.toLowerCase()}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="w-full text-center text-gray-400 py-12">
                                <p>No hay disciplinas disponibles en este momento.</p>
                            </div>
                        )}
                    </div>

                    {/* Next Button */}
                    {disciplines.length > itemsPerPage && (
                        <button
                            onClick={next}
                            disabled={currentIndex + itemsPerPage >= disciplines.length}
                            className="absolute right-0 sm:right-4 md:right-8 z-20 p-2 sm:p-3 rounded-full bg-brand-red/10 text-brand-red border border-brand-red/20 hover:bg-brand-red/20 hover:bg-brand-red/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
