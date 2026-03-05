export function AboutUs() {
    return (
        <section id="sobre-nosotros" className="py-20 bg-black text-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Content */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <h2 className="text-brand-red font-heading font-bold tracking-widest text-lg mb-2 uppercase">
                            SOBRE NOSOTROS
                        </h2>
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white uppercase mb-6 leading-tight">
                            FORJANDO CAMPEONES DESDE 2015
                        </h3>

                        <div className="w-20 h-1 bg-brand-red mb-8"></div>

                        <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                            Lomas Fight Club nació con una misión clara: brindar un espacio donde la disciplina,
                            el respeto y la superación personal sean los pilares fundamentales del entrenamiento.
                        </p>

                        <p className="text-gray-400 mb-8 leading-relaxed">
                            No somos solo un gimnasio, somos una comunidad. Nuestros instructores
                            altamente capacitados te guiarán paso a paso, ya sea que busques competir
                            a nivel profesional, aprender a defenderte o simplemente alcanzar
                            tu mejor forma física en un ambiente motivador.
                        </p>

                        <div className="grid grid-cols-2 gap-6 mt-4">
                            <div className="border-l-2 border-brand-red pl-4">
                                <h4 className="text-3xl font-heading font-bold text-white mb-1">+500</h4>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Alumnos Activos</p>
                            </div>
                            <div className="border-l-2 border-brand-red pl-4">
                                <h4 className="text-3xl font-heading font-bold text-white mb-1">+50</h4>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Títulos Ganados</p>
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl z-10 aspect-[4/3] group">
                            <div className="absolute inset-0 bg-brand-red/20 group-hover:bg-transparent transition-colors duration-500 z-10 mix-blend-multiply" />
                            <img
                                src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=1200"
                                alt="Entrenamiento en Lomas Fight Club"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>

                        {/* Decorative borders for the image */}
                        <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-brand-red rounded-2xl z-0" />
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-zinc-900 rounded-lg -z-10" />
                    </div>

                </div>
            </div>
        </section>
    );
}
