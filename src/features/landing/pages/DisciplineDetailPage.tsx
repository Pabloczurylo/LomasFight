import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { MembershipSection } from "../components/MembershipSection";
import { ScheduleSection } from "../components/ScheduleSection";
import { BenefitsSection, type Benefit } from "../components/BenefitsSection";
import { api } from "../../../services/api";
import { idDesdeParam, rutaDisciplina, usePageMeta } from "../../../lib/seo";
import { Button } from "../../../components/ui/Button";

interface DisciplineData {
    id_disciplina: number;
    nombre_disciplina: string;
    descripcion: string;
    cuota: number;
    img_banner: string;
    img_preview: string;
    numero_celular: string | null;
    beneficios?: { titulo: string; descripcion: string }[] | null;
}

interface ProfesorBackend {
    id_profesor: number;
    nombre: string;
    apellido: string;
    id_disciplina: number;
    activo: boolean;
    descripcion: string | null;
    imagen: string | null;
    disciplinas: {
        id_disciplina: number;
        nombre_disciplina: string;
    };
}

// Se muestran cuando la disciplina no tiene beneficios propios cargados desde el admin
const GENERIC_BENEFITS: Benefit[] = [
    {
        title: "Enfoque Técnico",
        description: "Aprendé la ejecución correcta de cada movimiento con una base sólida que te acompañará siempre."
    },
    {
        title: "Acondicionamiento Integral",
        description: "Mejorá tu capacidad física, resistencia y energía a través de entrenamientos diseñados para tu progreso."
    },
    {
        title: "Bienestar y Confianza",
        description: "Ganá seguridad en un ambiente motivador, ideal para liberar tensiones y alcanzar tu mejor versión."
    }
];

function beneficiosDe(discipline: DisciplineData | null): Benefit[] {
    const propios = (discipline?.beneficios ?? [])
        .filter(b => b?.titulo?.trim())
        .map(b => ({ title: b.titulo, description: b.descripcion || '' }));
    return propios.length ? propios : GENERIC_BENEFITS;
}

export default function DisciplineDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [discipline, setDiscipline] = useState<DisciplineData | null>(null);
    const [profesores, setProfesores] = useState<ProfesorBackend[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchDisciplineAndTeachers = async () => {
            try {
                setLoading(true);
                setError(false);
                // URL nueva "/disciplina/2-jiu-jitsu" -> se busca por ID (2).
                // Links viejos por nombre ("/disciplina/kickboxing") siguen andando: el backend busca por nombre.
                const numero = idDesdeParam(id);
                const responseDiscipline = await api.get(`/diciplinas/${numero ?? id}`);
                setDiscipline(responseDiscipline.data);

                // Si la URL no es la canónica (link viejo o nombre cambiado), reemplazarla sin recargar
                const canonica = rutaDisciplina(responseDiscipline.data.id_disciplina, responseDiscipline.data.nombre_disciplina);
                if (window.location.pathname !== canonica) {
                    navigate(canonica, { replace: true });
                }

                // Fetch and filter Teachers
                const responseTeachers = await api.get<ProfesorBackend[]>('/profesores');
                const activos = responseTeachers.data.filter(
                    p => p.activo && p.id_disciplina === responseDiscipline.data.id_disciplina
                );
                setProfesores(activos);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDisciplineAndTeachers();
        }
    }, [id]);

    // Título y descripción propios de cada disciplina (para Google y al compartir el link)
    const nombre = discipline?.nombre_disciplina?.trim();
    usePageMeta(discipline && nombre ? {
        title: `${nombre} en Tucumán | Lomas Fight`,
        description: (discipline.descripcion?.trim()
            ? `${nombre} en Lomas Fight: ${discipline.descripcion.trim()}`
            : `Clases de ${nombre} en Lomas Fight, Lomas de Tafí y Tafí Viejo, Tucumán. Horarios, profesores y cuota.`
        ).slice(0, 160),
        path: rutaDisciplina(discipline.id_disciplina, nombre),
    } : null);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white bg-black">
                <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mb-4"></div>
                Cargando disciplina...
            </div>
        );
    }

    if (error || !discipline) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white bg-black">
                <p className="text-xl mb-6">Disciplina no encontrada</p>
                <Button variant="outline" onClick={() => navigate('/#disciplinas')} className="gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Volver
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white">
            {/* Top Back Button */}
            <div className="absolute top-24 left-4 md:left-8 z-50">
                <Button
                    variant="outline"
                    className="bg-black/50 hover:bg-black/80 text-white border-white/20 backdrop-blur-sm gap-2"
                    onClick={() => navigate('/#disciplinas')}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </Button>
            </div>

            {/* Hero Section */}
            <div className="relative h-[60vh] w-full bg-black">
                <img
                    src={discipline?.img_banner || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop"}
                    alt={discipline?.nombre_disciplina}
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full px-4 py-8 md:p-16 container mx-auto max-w-full">
                    <h1 className="text-2xl md:text-7xl font-heading font-bold text-white uppercase mb-4 hyphens-auto break-words text-balance">
                        {discipline?.nombre_disciplina || 'Cargando...'}
                    </h1>
                </div>
            </div>

            {/* Dynamic Description Just Above Methodology */}
            <section className="py-12 bg-white text-center px-4 max-w-4xl mx-auto">
                <h2 className="text-3xl font-heading font-bold text-brand-dark mb-4 uppercase">¿DE QUÉ SE TRATA?</h2>
                <p className="text-lg text-gray-600">
                    {discipline?.descripcion || "Sumate a nuestras clases y superá tus límites día a día."}
                </p>
            </section>

            {/* Beneficios: los cargados en el admin o, si no hay, los genéricos */}
            <BenefitsSection
                disciplineName={discipline?.nombre_disciplina || 'Disciplina'}
                benefits={beneficiosDe(discipline)}
                image={discipline?.img_preview || discipline?.img_banner || ''}
            />

            {/* Membresía (Prices) */}
            <MembershipSection
                planTitle={`PLAN ${(discipline?.nombre_disciplina || 'CARGANDO...').toUpperCase()}`}
                price={discipline?.cuota?.toString() || ''}
                whatsappLink={discipline?.numero_celular
                    ? `https://wa.me/${discipline.numero_celular.replace(/\D/g, '')}`
                    : undefined
                }
            />

            {/* Discipline Schedule */}
            <ScheduleSection
                id="horarios-disciplina"
                title="HORARIOS"
                subtitle={`CLASES DE ${(discipline?.nombre_disciplina || 'CARGANDO...').toUpperCase()}`}
                disciplineId={discipline?.id_disciplina}
            />

            {/* Instructors Section */}
            <section className="py-20 bg-brand-dark overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-brand-red font-heading font-bold tracking-widest text-lg mb-2">TEAM</h2>
                    <h3 className="text-4xl md:text-5xl font-heading font-bold text-white uppercase mb-16">NUESTROS INSTRUCTORES</h3>

                    {profesores.length > 0 ? (
                        <div className="w-full flex justify-center gap-8 flex-wrap">
                            {profesores.map((profesor) => (
                                <div key={profesor.id_profesor} className="bg-[#111115] border border-white/5 rounded-2xl p-10 max-w-md w-full shadow-2xl flex flex-col items-center relative overflow-hidden group">
                                    {/* Top subtle glow */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-red/10 blur-3xl rounded-full" />

                                    {/* Profile Image */}
                                    <div className="relative mb-8 mt-2">
                                        <div className="w-48 h-48 rounded-full p-1 bg-gradient-to-b from-brand-red via-brand-red/50 to-transparent">
                                            <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900">
                                                <img
                                                    src={profesor.imagen || "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=400"}
                                                    alt={`${profesor.nombre} ${profesor.apellido}`}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <h3 className="text-2xl font-black text-white uppercase tracking-wide mb-2 text-center break-words max-w-full">
                                        {profesor.nombre} {profesor.apellido}
                                    </h3>
                                    <p className="text-brand-red font-bold text-xs tracking-[0.1em] uppercase mb-4 text-center">
                                        {profesor.disciplinas?.nombre_disciplina?.trim() || 'ARTES MARCIALES'}
                                    </p>

                                    <div className="w-10 h-[2px] bg-brand-red/70 mb-6 relative">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[6px] bg-brand-red/20 blur-[2px]" />
                                    </div>

                                    <div className="w-full h-[90px] mb-10 px-2 overflow-hidden">
                                        <p className="text-gray-400 text-sm text-center leading-relaxed break-words line-clamp-4 m-0">
                                            {profesor.descripcion || "Especialista en entrenamiento de alto rendimiento. Nuestro compromiso es forjar atletas con excelente técnica y acondicionamiento físico inquebrantable."}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-[#3f3f46] uppercase text-[10px] font-bold tracking-[0.2em] relative z-10">
                                        LOMAS FIGHT CLUB
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                            <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto bg-black rounded-xl p-12 border border-white/10">
                            <p className="text-xl text-gray-300 font-medium">
                                Próximamente verás aquí a los profesionales encargados de esta actividad
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
