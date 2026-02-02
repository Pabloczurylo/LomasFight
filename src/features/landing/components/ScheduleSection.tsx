export function ScheduleSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-brand-red font-heading font-bold tracking-widest text-lg mb-2">DISPONIBILIDAD</h2>
                    <h3 className="text-4xl md:text-5xl font-heading font-bold text-brand-black uppercase">HORARIOS DE KICKBOXING</h3>
                </div>

                <div className="max-w-4xl mx-auto overflow-hidden rounded-lg shadow-lg">
                    <div className="grid grid-cols-3 bg-black text-white py-4 font-heading font-bold text-lg uppercase tracking-wider text-center">
                        <div>LUNES</div>
                        <div>MIÉRCOLES</div>
                        <div>VIERNES</div>
                    </div>

                    <div className="bg-white divide-y divide-gray-100 border-x border-b border-gray-100">
                        {/* Row 1 */}
                        <div className="grid grid-cols-3 py-8 text-center hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col">
                                <span className="text-brand-red font-heading font-bold text-2xl">5:00 PM</span>
                                <span className="text-xs text-gray-400 font-bold uppercase mt-1">KICKBOXING</span>
                                <span className="text-xs text-gray-400 mt-1">Coach: Kate Johnson</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-brand-red font-heading font-bold text-2xl">5:00 PM</span>
                                <span className="text-xs text-gray-400 font-bold uppercase mt-1">KICKBOXING</span>
                                <span className="text-xs text-gray-400 mt-1">Coach: Kate Johnson</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-brand-red font-heading font-bold text-2xl">5:00 PM</span>
                                <span className="text-xs text-gray-400 font-bold uppercase mt-1">SPARRING</span>
                                <span className="text-xs text-gray-400 mt-1">Coach: Kate Johnson</span>
                            </div>
                        </div>

                        {/* Row 2 - Example */}
                        <div className="grid grid-cols-3 py-8 text-center hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col">
                                <span className="text-brand-red font-heading font-bold text-2xl">7:00 PM</span>
                                <span className="text-xs text-gray-400 font-bold uppercase mt-1">MUAY THAI</span>
                                <span className="text-xs text-gray-400 mt-1">Coach: Marco Diaz</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-brand-gray font-heading font-bold text-2xl">--</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-brand-red font-heading font-bold text-2xl">7:00 PM</span>
                                <span className="text-xs text-gray-400 font-bold uppercase mt-1">MUAY THAI</span>
                                <span className="text-xs text-gray-400 mt-1">Coach: Marco Diaz</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

