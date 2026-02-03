import { Button } from "../../../components/ui/Button";
import { Check } from "lucide-react";

interface MembershipSectionProps {
    planTitle?: string;
    price?: string;
    features?: string[];
}

export function MembershipSection({
    planTitle = "PLAN KICK BOXING",
    price = "4500",
    features = [
        "3 Clases por semana",
        "Equipo incluido (bolsas y pads)",
        "Acceso a vestuarios",
        "Instructor certificado"
    ]
}: MembershipSectionProps) {
    return (
        <section className="py-20 bg-gray-50 flex items-center justify-center">
            <div className="container mx-auto px-4 max-w-4xl text-center">
                <h2 className="text-brand-red font-heading font-bold tracking-widest text-lg mb-2">MEMBRESÍAS</h2>
                <h3 className="text-2xl md:text-5xl font-heading font-bold text-brand-black uppercase mb-12">VALORES DE CUOTA</h3>

                <div className="mx-auto max-w-md bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-transparent hover:border-brand-red/50 transition-colors duration-300">
                    <div className="p-8 text-center bg-gradient-to-br from-brand-dark to-black">
                        <h4 className="text-brand-red font-heading font-bold text-xl uppercase tracking-widest mb-4">{planTitle}</h4>
                        <div className="flex justify-center items-baseline mb-6">
                            <span className="text-xl text-gray-400 mr-2">$</span>
                            <span className="text-5xl md:text-6xl font-heading font-bold text-white">{price}</span>
                            <span className="text-gray-400 ml-2">/ mes</span>
                        </div>

                        <ul className="space-y-4 mb-8 text-left max-w-xs mx-auto">
                            {features.map((item, i) => (
                                <li key={i} className="flex items-center text-gray-300">
                                    <Check className="w-5 h-5 text-brand-red mr-3 flex-shrink-0" />
                                    <span className="font-body text-sm font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <Button variant="whatsapp" className="w-full h-12 text-lg">
                            INSCRIBIRSE POR WHATSAPP
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
