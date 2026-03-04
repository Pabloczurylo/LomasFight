import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Disciplina {
    id_disciplina: number;
    nombre_disciplina: string;
}

interface ProfesorBackend {
    id_profesor: number;
    nombre: string;
    apellido: string;
    id_disciplina: number;
    activo: boolean;
    descripcion: string | null;
    imagen: string | null;
    disciplinas: Disciplina;
}

export function AboutSection() {
    const [profesores, setProfesores] = useState<ProfesorBackend[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);

    // Update items per page based on screen width
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) { // lg breakpoint in Tailwind is 1024px
                setItemsPerPage(1);
            } else {
                setItemsPerPage(3);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const next = useCallback(() => {
        setCurrentIndex(prev => {
            const nextIndex = prev + itemsPerPage;
            return nextIndex < profesores.length ? nextIndex : prev;
        });
    }, [itemsPerPage, profesores.length]);

    const prev = useCallback(() => {
        setCurrentIndex(prev => {
            const nextIndex = prev - itemsPerPage;
            return nextIndex >= 0 ? nextIndex : 0;
        });
    }, [itemsPerPage]);

    // Ensure currentIndex is valid when itemsPerPage or profesores.length changes
    useEffect(() => {
        // Reset to first slide if current index is suddenly out of bounds
        if (currentIndex >= profesores.length && profesores.length > 0) {
            setCurrentIndex(0);
        }
    }, [itemsPerPage, profesores.length, currentIndex]);


    const visibleProfesores = profesores.slice(currentIndex, currentIndex + itemsPerPage);

    useEffect(() => {
        const fetchProfesores = async () => {
            try {
                const response = await api.get<ProfesorBackend[]>('/profesores');
                // Filtrar solo los activos
                const activos = response.data.filter(p => p.activo);
                setProfesores(activos);
            } catch (error) {
                console.error("Error al cargar profesores:", error);
            }
        };

        fetchProfesores();
    }, []);

    return (
        <section id="nosotros" className="py-20 bg-zinc-900 text-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col gap-16">
                    <div className="w-full max-w-3xl mx-auto text-center">
                        <h2 className="text-brand-red font-heading font-bold tracking-widest text-lg mb-2 uppercase">NOSOTROS</h2>
                        <h3 className="text-4xl md:text-6xl font-heading font-bold text-white uppercase mb-8 leading-tight">
                            CONOCE A NUESTRO EQUIPO
                        </h3>

                    </div>

                    <div className="relative w-full flex items-center justify-center">
                        {/* Prev Button */}
                        {profesores.length > itemsPerPage && (
                            <button
                                onClick={prev}
                                disabled={currentIndex === 0}
                                className="absolute left-0 sm:left-4 md:left-8 z-20 p-2 sm:p-3 rounded-full bg-brand-red/10 text-brand-red border border-brand-red/20 hover:bg-brand-red/20 hover:bg-brand-red/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                            </button>
                        )}

                        <div className="w-full flex justify-center gap-6 lg:gap-8 flex-col lg:flex-row px-12 sm:px-16 md:px-24 items-center lg:items-stretch">
                            {visibleProfesores.map((profesor) => (
                                <div key={profesor.id_profesor} className="bg-[#111115] border border-white/5 rounded-2xl p-8 lg:p-10 w-full max-w-sm lg:max-w-none lg:flex-1 shadow-2xl flex flex-col items-center relative overflow-hidden group">
                                    {/* Top subtle glow */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-red/10 blur-3xl rounded-full" />

                                    {/* Profile Image */}
                                    <div className="relative mb-8 mt-2">
                                        <div className="w-48 h-48 rounded-full p-1 bg-gradient-to-b from-brand-red via-brand-red/50 to-transparent">
                                            <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900">
                                                <img
                                                    src={profesor.imagen || "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=400"}
                                                    alt={`${profesor.nombre} ${profesor.apellido}`}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <h3 className="text-2xl font-black text-white uppercase tracking-wide mb-2 text-center break-words max-w-full">
                                        {profesor.nombre} {profesor.apellido}
                                    </h3>
                                    <p className="text-brand-red font-bold text-xs tracking-[0.1em] uppercase mb-4 text-center">
                                        INSTRUCTOR DE {profesor.disciplinas?.nombre_disciplina || 'ARTES MARCIALES'}
                                    </p>

                                    <div className="w-10 h-[2px] bg-brand-red/70 mb-6 relative">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[6px] bg-brand-red/20 blur-[2px]" />
                                    </div>

                                    <div className="w-full h-[90px] mb-10 px-2 overflow-hidden">
                                        <p className="text-gray-400 text-sm text-center leading-relaxed break-words line-clamp-4 m-0">
                                            {profesor.descripcion || "Especialista en entrenamiento de alto rendimiento. Nuestro compromiso es forjar atletas con excelente técnica y acondicionamiento físico inquebrantable."}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                                        {profesor.disciplinas ? (
                                            <span className="px-3 py-1.5 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-[11px] font-bold tracking-wider uppercase">
                                                {profesor.disciplinas.nombre_disciplina}
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1.5 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-[11px] font-bold tracking-wider uppercase">
                                                ENTRENAMIENTO
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1.5 text-[#3f3f46] uppercase text-[10px] font-bold tracking-[0.2em] relative z-10">
                                        LOMAS FIGHT CLUB
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                            <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Next Button */}
                        {profesores.length > itemsPerPage && (
                            <button
                                onClick={next}
                                disabled={currentIndex + itemsPerPage >= profesores.length}
                                className="absolute right-0 sm:right-4 md:right-8 z-20 p-2 sm:p-3 rounded-full bg-brand-red/10 text-brand-red border border-brand-red/20 hover:bg-brand-red/20 hover:bg-brand-red/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
