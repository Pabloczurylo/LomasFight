import { useState, useEffect } from 'react';
import { api } from '../../../services/api';

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
    disciplinas: Disciplina;
}

export function AboutSection() {
    const [profesores, setProfesores] = useState<ProfesorBackend[]>([]);

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
                    <div className="w-full max-w-3xl">
                        <h2 className="text-brand-red font-heading font-bold tracking-widest text-lg mb-2 uppercase">NOSOTROS</h2>
                        <h3 className="text-4xl md:text-6xl font-heading font-bold text-white uppercase mb-8 leading-tight">
                            SOMOS MÁS QUE UN SIMPLE GIMNASIO
                        </h3>

                        <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-2xl">
                            En Lomas Fight, nos enorgullece ser un verdadero santuario para los entusiastas de las
                            artes marciales. Creemos en el poder transformador de la disciplina y el esfuerzo
                            constante.
                        </p>
                    </div>

                    <div className="w-full flex justify-center md:justify-start gap-8 flex-wrap">
                        {profesores.map((profesor) => (
                            <div key={profesor.id_profesor} className="bg-[#111115] border border-white/5 rounded-2xl p-10 max-w-md w-full shadow-2xl flex flex-col items-center relative overflow-hidden group">
                                {/* Top subtle glow */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-red/10 blur-3xl rounded-full" />

                                {/* Profile Image */}
                                <div className="relative mb-8 mt-2">
                                    <div className="w-48 h-48 rounded-full p-1 bg-gradient-to-b from-brand-red via-brand-red/50 to-transparent">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900">
                                            {/* Foto hardcodeada como se solicitó "Ignora el campo de la foto de perfil por el momento" */}
                                            <img
                                                src="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=400"
                                                alt={`${profesor.nombre} ${profesor.apellido}`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    </div>
                                    {/* Verified Badge */}
                                    <div className="absolute bottom-1 right-3 w-9 h-9 bg-[#111115] rounded-full flex items-center justify-center shadow-lg">
                                        <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                                                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                            </svg>
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

                                <p className="text-gray-400 text-sm text-center leading-relaxed mb-10 px-2 line-clamp-4">
                                    Especialista en entrenamiento de alto rendimiento. Nuestro compromiso es forjar
                                    atletas con excelente técnica y acondicionamiento físico inquebrantable a través
                                    de la disciplina de {profesor.disciplinas?.nombre_disciplina || "las artes marciales"}.
                                </p>

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
                </div>
            </div>
        </section>
    );
}
