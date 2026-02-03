import { Activity, Shield, Target, Zap, Dumbbell, Heart, LucideIcon } from "lucide-react";

interface Benefit {
    title: string;
    description: string;
    icon: LucideIcon;
}

interface BenefitsSectionProps {
    disciplineName: string;
    benefits: Benefit[];
    image: string;
}

export function BenefitsSection({ disciplineName, benefits, image }: BenefitsSectionProps) {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    {/* Left Column - Content */}
                    <div className="w-full lg:w-1/2">
                        <div className="mb-12">
                            <h2 className="text-brand-red font-heading font-bold tracking-widest text-lg mb-2">BENEFICIOS</h2>
                            <h3 className="text-4xl md:text-5xl font-heading font-bold text-brand-black uppercase leading-tight">
                                POR QUÉ ELEGIR <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-brand-dark">
                                    {disciplineName}
                                </span>
                            </h3>
                        </div>

                        <div className="space-y-8">
                            {benefits.map((benefit, idx) => (
                                <div key={idx} className="flex gap-6 group">
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-brand-red transition-colors duration-300">
                                            <benefit.icon className="w-8 h-8 text-brand-red group-hover:text-white transition-colors duration-300" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-heading font-bold text-brand-black mb-2 uppercase">{benefit.title}</h4>
                                        <p className="text-gray-500 leading-relaxed">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Image & Badge */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[600px] w-full transform md:rotate-3 transition-transform duration-500 hover:rotate-0">
                            <img
                                src={image}
                                alt={`Beneficios de ${disciplineName}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                            {/* Badge Overlay */}
                            <div className="absolute bottom-8 right-8 bg-brand-red p-6 rounded-xl shadow-lg border-2 border-white/20 backdrop-blur-sm max-w-[200px] text-center transform hover:scale-105 transition-transform duration-300">
                                <span className="block text-4xl font-heading font-bold text-white mb-1">100%</span>
                                <span className="block text-sm font-heading font-bold text-white tracking-widest uppercase">COMPROMISO</span>
                            </div>
                        </div>

                        {/* Decorative background element */}
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gray-100 rounded-full -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
