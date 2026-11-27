import logoClaro from "../../assets/logos/lomas-fight-light.webp";
import logoOscuro from "../../assets/logos/lomas-fight-dark.webp";
import { cn } from "../../lib/utils";

interface LogoProps {
    /** "light" = letras blancas, para fondos oscuros. "dark" = letras negras, para fondos claros. */
    variant?: "light" | "dark";
    /** Controla el tamaño con la altura (ej. "h-10"); el ancho se ajusta solo. */
    className?: string;
}

export function Logo({ variant = "light", className }: LogoProps) {
    return (
        <img
            src={variant === "light" ? logoClaro : logoOscuro}
            alt="Lomas Fight - Centro de Artes Marciales"
            className={cn("h-10 w-auto select-none", className)}
            draggable={false}
        />
    );
}
