import { Button } from "../../../components/ui/Button";

export function AboutSection() {
    return (
        <section id="nosotros" className="py-20 bg-zinc-900 text-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="w-full md:w-1/2 flex justify-center">
                        <div className="bg-[#111115] border border-white/5 rounded-2xl p-10 max-w-md w-full shadow-2xl flex flex-col items-center relative overflow-hidden group">
                            {/* Top subtle glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-red/10 blur-3xl rounded-full" />

                            {/* Profile Image */}
                            <div className="relative mb-8 mt-2">
                                <div className="w-48 h-48 rounded-full p-1 bg-gradient-to-b from-brand-red via-brand-red/50 to-transparent">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900">
                                        <img
                                            src="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=400"
                                            alt="Victor Lomas"
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
                            <h3 className="text-2xl font-black text-white uppercase tracking-wide mb-2 text-center">
                                VICTOR 'THE TITAN' LOMAS
                            </h3>
                            <p className="text-brand-red font-bold text-xs tracking-[0.1em] uppercase mb-4">
                                HEAD STRIKING COACH
                            </p>

                            <div className="w-10 h-[2px] bg-brand-red/70 mb-6 relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[6px] bg-brand-red/20 blur-[2px]" />
                            </div>

                            <p className="text-gray-400 text-sm text-center leading-relaxed mb-10 px-2">
                                Specializing in high-performance Boxing and Muay Thai. Over 15 years of professional ring
                                experience, dedicated to crafting elite technical strikers through disciplined physical
                                conditioning.
                            </p>

                            <div className="flex flex-wrap justify-center gap-2 mb-10">
                                {['KICKBOXING', 'BOXING', 'MUAY THAI'].map(tag => (
                                    <span key={tag} className="px-3 py-1.5 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-[11px] font-bold tracking-wider">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-1.5 text-[#3f3f46] uppercase text-[10px] font-bold tracking-[0.2em] relative z-10">
                                LOMAS FIGHT CLUB
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2">
                        <h2 className="text-brand-red font-heading font-bold tracking-widest text-lg mb-2">NOSOTROS</h2>
                        <h3 className="text-4xl md:text-5xl font-heading font-bold text-white uppercase mb-6 leading-tight">
                            SOMOS MÁS QUE <br /> UN SIMPLE GIMNASIO
                        </h3>

                        <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                            En Lomas Fight, nos enorgullece ser un verdadero santuario para los entusiastas de las artes marciales.
                            Creemos en el poder transformador de la disciplina y el esfuerzo constante.
                        </p>

                        <p className="text-gray-400 mb-8 leading-relaxed">
                            Nuestro enfoque combina técnicas tradicionales con métodos de entrenamiento moderno, creando un ambiente
                            donde principiantes y competidores de élite pueden superar sus límites juntos. Aquí no solo entrenas tu cuerpo,
                            sino que fortaleces tu mente y espíritu.
                        </p>

                        <div className="flex gap-4">
                            <Button variant="primary" size="lg">
                                CONOCE EL EQUIPO
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
