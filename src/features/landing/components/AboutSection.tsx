import { Button } from "../../../components/ui/Button";

export function AboutSection() {
    return (
        <section id="nosotros" className="py-20 bg-zinc-900 text-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="w-full md:w-1/2">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl skew-y-1">
                            <img
                                src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop"
                                alt="Lomas Fight Gym Interior"
                                className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
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
