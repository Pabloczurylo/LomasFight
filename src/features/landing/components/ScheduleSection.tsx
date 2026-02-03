interface ScheduleItem {
    time: string;
    class: string;
    coach?: string;
}

interface ScheduleDay {
    day: string; // LUNES, MARTES, etc.
    classes: (ScheduleItem | null)[]; // null for empty slot
}

interface ScheduleSectionProps {
    id?: string;
    title?: string;
    subtitle?: string;
    scheduleData?: ScheduleDay[];
}

const GENERAL_SCHEDULE: ScheduleDay[] = [
    {
        day: "LUNES",
        classes: [
            { time: "10:00 AM", class: "KICKBOXING", coach: "Carlos Monzón" },
            { time: "6:00 PM", class: "MUAY THAI", coach: "Mario Díaz" },
            { time: "8:00 PM", class: "BOXEO", coach: "María Nieves" }
        ]
    },
    {
        day: "MARTES",
        classes: [
            { time: "9:00 AM", class: "FUNCIONAL", coach: "Ana Vega" },
            { time: "7:00 PM", class: "KICKBOXING", coach: "Carlos Monzón" },
            { time: "8:30 PM", class: "MMA", coach: "Jorge Masvidal" }
        ]
    },
    {
        day: "MIÉRCOLES",
        classes: [
            { time: "10:00 AM", class: "KICKBOXING", coach: "Carlos Monzón" },
            { time: "6:00 PM", class: "MUAY THAI", coach: "Mario Díaz" },
            { time: "8:00 PM", class: "BOXEO", coach: "María Nieves" }
        ]
    },
    {
        day: "JUEVES",
        classes: [
            { time: "9:00 AM", class: "FUNCIONAL", coach: "Ana Vega" },
            { time: "7:00 PM", class: "KICKBOXING", coach: "Carlos Monzón" },
            { time: "8:30 PM", class: "MMA", coach: "Jorge Masvidal" }
        ]
    },
    {
        day: "VIERNES",
        classes: [
            { time: "10:00 AM", class: "KICKBOXING", coach: "Carlos Monzón" },
            { time: "6:00 PM", class: "SPARRING", coach: "Team Lomas" },
            { time: "8:00 PM", class: "BOXEO", coach: "María Nieves" }
        ]
    },
    {
        day: "SÁBADO",
        classes: [
            { time: "10:00 AM", class: "OPEN MAT", coach: "Rotativo" },
            { time: "11:00 AM", class: "MASTERCLASS", coach: "Invitado" },
            null
        ]
    }
];

export function ScheduleSection({
    id,
    title = "DISPONIBILIDAD",
    subtitle = "HORARIOS DE CLASES",
    scheduleData = GENERAL_SCHEDULE
}: ScheduleSectionProps) {
    return (
        <section id={id} className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-brand-red font-heading font-bold tracking-widest text-lg mb-2">{title}</h2>
                    <h3 className="text-3xl md:text-5xl font-heading font-bold text-brand-black uppercase">{subtitle}</h3>
                </div>

                <div className="max-w-6xl mx-auto overflow-x-auto">
                    <div className="min-w-[800px] overflow-hidden rounded-lg shadow-lg border border-gray-100">
                        {/* Header Row */}
                        <div className="grid grid-cols-6 bg-black text-white py-4 font-heading font-bold text-sm md:text-base uppercase tracking-wider text-center">
                            {scheduleData.map((day, idx) => (
                                <div key={idx}>{day.day}</div>
                            ))}
                        </div>

                        {/* Schedule Body - Assuming max 3 slots per day for visual consistency in this design, 
                            or we map rows strictly. For a robust schedule, a true table or grid by time slots is better,
                            but keeping within the visual style of the original component which was a simple grid. 
                            Let's align by rows (morning, afternoon, evening) or just list them. 
                            The original code had row-based layout. Let's try to map max rows.
                        */}
                        <div className="bg-white divide-x divide-gray-100 grid grid-cols-6">
                            {scheduleData.map((day, colIdx) => (
                                <div key={colIdx} className="divide-y divide-gray-100">
                                    {[0, 1, 2].map((rowIdx) => {
                                        const item = day.classes[rowIdx];
                                        return (
                                            <div key={rowIdx} className="p-4 h-32 flex flex-col justify-center items-center text-center hover:bg-gray-50 transition-colors">
                                                {item ? (
                                                    <>
                                                        <span className="text-brand-red font-heading font-bold text-xl">{item.time}</span>
                                                        <span className="text-xs text-black font-bold uppercase mt-1">{item.class}</span>
                                                        {item.coach && <span className="text-xs text-gray-500 mt-1">Coach: {item.coach}</span>}
                                                    </>
                                                ) : (
                                                    <span className="text-gray-300 font-heading font-bold text-xl">--</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

