import { useEffect, useState } from "react";
import hero1 from "../../../assets/hero/hero-1.webp";
import hero2 from "../../../assets/hero/hero-2.webp";
import hero3 from "../../../assets/hero/hero-3.webp";
import hero4 from "../../../assets/hero/hero-4.webp";
import hero5 from "../../../assets/hero/hero-5.webp";

// Fotos grupales del gimnasio. `posicion` = qué parte de la foto se prioriza al recortar
// (la gente está en la mitad inferior, por eso el foco va algo por debajo del centro).
const FOTOS = [
    { src: hero1, posicion: "50% 65%" },
    { src: hero2, posicion: "50% 55%" },
    { src: hero3, posicion: "50% 65%" },
    { src: hero4, posicion: "50% 62%" },
    { src: hero5, posicion: "50% 66%" },
];

const INTERVALO_MS = 6000;

/**
 * Fondo del hero: las fotos pasan solas con un fundido y un zoom lento.
 * Es puramente decorativo: no tiene controles, no recibe clics y los lectores de pantalla lo ignoran.
 */
export function HeroBackgroundCarousel() {
    const [actual, setActual] = useState(0);
    // Solo se cargan la foto visible y la siguiente, para no bajar las 5 al entrar
    const [cargadas, setCargadas] = useState<Set<number>>(() => new Set([0, 1]));
    // Se activa apenas después de montar, para que la primera foto también entre con fundido y zoom.
    // (setTimeout y no requestAnimationFrame: rAF se pausa si la pestaña está en segundo plano
    // y la foto quedaría invisible)
    const [arrancado, setArrancado] = useState(false);
    useEffect(() => {
        const t = window.setTimeout(() => setArrancado(true), 50);
        return () => window.clearTimeout(t);
    }, []);

    useEffect(() => {
        const id = window.setInterval(() => {
            setActual(prev => {
                const siguiente = (prev + 1) % FOTOS.length;
                setCargadas(c => (c.has((siguiente + 1) % FOTOS.length) ? c : new Set(c).add((siguiente + 1) % FOTOS.length)));
                return siguiente;
            });
        }, INTERVALO_MS);
        return () => window.clearInterval(id);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
            {FOTOS.map((foto, i) =>
                cargadas.has(i) ? (
                    <img
                        key={foto.src}
                        src={foto.src}
                        alt=""
                        draggable={false}
                        decoding="async"
                        fetchPriority={i === 0 ? "high" : "low"}
                        style={{
                            objectPosition: foto.posicion,
                            // Fundido de 1,5 s y zoom lento que dura más que lo que la foto está visible
                            // (Tailwind 4: scale-110 usa la propiedad CSS `scale`, no `transform`)
                            transition: "opacity 1.5s ease-out, scale 8s ease-out",
                        }}
                        className={`absolute inset-0 w-full h-full object-cover
                            ${arrancado && i === actual ? "opacity-60 motion-safe:scale-110" : "opacity-0 scale-100"}`}
                    />
                ) : null
            )}
        </div>
    );
}
