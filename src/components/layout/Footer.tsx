import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-black text-gray-400 py-12 border-t border-gray-900">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-6 w-6 bg-brand-red rounded transform skew-x-[-10deg]" />
                            <span className="text-xl font-heading font-bold text-white uppercase tracking-wider">
                                LOMAS <span className="text-brand-red">FIGHT</span>
                            </span>
                        </div>
                        <p className="text-sm max-w-xs">
                            El centro defensivo para los deportes de contacto. Entrena con campeones, conviértete en campeón.
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-heading font-bold uppercase tracking-wide mb-4">CONTÁCTANOS</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-brand-red shrink-0" />
                                <span>Calle Lomas 123, Ciudad, CP 1000</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-brand-red shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-brand-red shrink-0" />
                                <span>contacto@lomasfight.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social / Map Placeholder */}
                    <div>
                        <h4 className="text-white font-heading font-bold uppercase tracking-wide mb-4">SÍGUENOS</h4>
                        <div className="flex gap-4 mb-6">
                            <a href="#" className="hover:text-brand-red transition-colors"><Instagram /></a>
                            <a href="#" className="hover:text-brand-red transition-colors"><Facebook /></a>
                        </div>
                        {/* Map Placeholder */}
                        <div className="w-full h-32 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-800">
                            <span className="text-xs uppercase tracking-widest">Ver en Google Maps</span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-900 pt-8 text-center text-xs">
                    <p>© {new Date().getFullYear()} Lomas Fight Gym. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
