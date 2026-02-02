import { Button } from "../../../components/ui/Button";

export function HeroSection() {
    return (
        <section className="relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-black">
            {/* Background Image Placeholder with Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                <img
                    src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop"
                    alt="Lomas Fight Gym"
                    className="w-full h-full object-cover opacity-60"
                />
            </div>

            <div className="relative z-20 container mx-auto px-4 text-center flex flex-col items-center">
                <h2 className="text-brand-red font-heading font-bold tracking-widest text-xl md:text-2xl mb-2 animate-fade-in-up">
                    BIENVENIDOS A LOMAS FIGHT
                </h2>

                <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-bold text-white uppercase leading-[0.9] mb-6">
                    FORJADO EN <br />
                    <span className="text-brand-red">COMBATE</span>
                </h1>

                <p className="max-w-xl text-gray-300 text-lg md:text-xl mb-8 font-body font-light">
                    Desata tu potencial con Kickboxing, Muay Thai y Boxeo. Únete a una comunidad basada en la disciplina, fuerza y respeto.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Button variant="whatsapp" size="lg" className="w-full sm:w-auto">
                        ¡INSCRÍBETE AHORA!
                    </Button>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        VER HORARIOS
                    </Button>
                </div>
            </div>
        </section>
    );
}
