import { Link } from "react-router-dom";

interface DisciplineCardProps {
  title: string;
  /** Ruta de la disciplina, ej. "/disciplina/2-jiu-jitsu" */
  href?: string;
  description: string;
  image: string;
}

// Mismo aspecto que <Button variant="outline" size="sm">, pero como <span>:
// un <button> dentro de un <a> no es HTML válido.
const verDetallesClass =
  "inline-flex items-center justify-center w-full h-8 px-3 text-sm rounded-md font-heading font-bold uppercase tracking-wide border border-brand-red text-brand-red bg-transparent group-hover:bg-brand-red/10 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300";

export function DisciplineCard({ title, href, image }: DisciplineCardProps) {
  const contenido = (
    <>
      {/* Background Image */}
      <img
        src={image}
        alt={`Clases de ${title} en Lomas Fight`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end h-full">
        <div className="translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
          <h3 className="text-3xl font-heading font-bold text-white uppercase mb-4">{title}</h3>

          <div className="space-y-4">
            <span className={verDetallesClass}>VER DETALLES</span>
          </div>
        </div>
      </div>
    </>
  );

  const cardClass =
    "group relative block overflow-hidden rounded-xl h-[400px] w-full shadow-lg transition-transform duration-300 hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red";

  // Link real (<a href>) para que Google pueda seguirlo y descubrir la página de la disciplina
  return href ? (
    <Link to={href} onClick={() => window.scrollTo(0, 0)} className={cardClass} aria-label={`Ver detalles de ${title}`}>
      {contenido}
    </Link>
  ) : (
    <div className={cardClass}>{contenido}</div>
  );
}
