import { useState, useEffect } from "react";
import { Clock, MapPin, Users, CheckCircle, Save, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { api } from "../../../services/api";

// Interface for Class
interface Clase {
    id_clase: number;
    nombre_clase: string;
    horario_inicio: string;
    horario_fin: string;
    dia_semana: string;
    instructor_nombre: string;
    cupo_maximo: number;
    alumnos_inscriptos?: Alumno[];
}

// Interface for Student in the class
interface Alumno {
    id_usuario: number;
    nombre_usuario: string;
    presente?: boolean; // Local state for attendance
}

export default function AsistenciaPage() {
    const [clases, setClases] = useState<Clase[]>([]);
    const [selectedClase, setSelectedClase] = useState<Clase | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(false);

    useEffect(() => {
        fetchClases();
    }, []);

    const fetchClases = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('usuario') || '{}');
            const profesorId = user.id_usuario;

            // Get current day name in Spanish (e.g., "Lunes", "Martes")
            const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
            const today = days[new Date().getDay()];

            // Attempt to fetch classes from API
            let myClasses: Clase[] = [];

            try {
                const response = await api.get('/clases');
                const allClasses = response.data;

                myClasses = allClasses.filter((c: any) =>
                    (c.instructor_nombre === user.nombre_usuario || c.id_profesor === profesorId) &&
                    c.dia_semana.toLowerCase() === today.toLowerCase()
                );
            } catch (err) {
                console.warn("API fetch failed", err);
            }

            if (myClasses.length === 0) {
                // Fallback mock class shell so we can test student fetching logic on it
                const mockClass: Clase = {
                    id_clase: 999,
                    nombre_clase: "Kickboxing", // Matching discipline name
                    horario_inicio: "18:00",
                    horario_fin: "19:30",
                    dia_semana: today,
                    instructor_nombre: user.nombre_usuario || "Profesor",
                    cupo_maximo: 20
                };
                myClasses = [mockClass];
            }

            setClases(myClasses);
        } catch (error) {
            console.error("Error generally fetching classes:", error);
            setClases([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClassClick = async (clase: Clase) => {
        // Set selected class immediately to show the view with loading state
        const classWithNoStudents = { ...clase, alumnos_inscriptos: [] };
        setSelectedClase(classWithNoStudents);
        setLoadingStudents(true);

        try {
            // Fetch all students (clientes)
            const response = await api.get('/clientes');
            const allStudents = response.data;

            // Filter by discipline matching class name
            const disciplineName = clase.nombre_clase;

            const filteredStudents = allStudents
                .filter((s: any) => s.disciplinas?.nombre_disciplina === disciplineName)
                .map((s: any) => ({
                    id_usuario: s.id_cliente, // Mapping id_cliente to id_usuario
                    nombre_usuario: `${s.nombre} ${s.apellido}`,
                    presente: false
                }));

            setSelectedClase({
                ...clase,
                alumnos_inscriptos: filteredStudents
            });

        } catch (error) {
            console.error("Error fetching students for class:", error);
            // Even if error, update state to stop loading
            setSelectedClase({
                ...clase,
                alumnos_inscriptos: []
            });
        } finally {
            setLoadingStudents(false);
        }
    };

    const toggleAttendance = (alumnoId: number) => {
        if (!selectedClase || !selectedClase.alumnos_inscriptos) return;

        const updatedStudents = selectedClase.alumnos_inscriptos.map(al => {
            if (al.id_usuario === alumnoId) {
                return { ...al, presente: !al.presente };
            }
            return al;
        });

        setSelectedClase({ ...selectedClase, alumnos_inscriptos: updatedStudents });
    };

    const handleFinalizarClase = async () => {
        if (!selectedClase) return;

        // As requested: simple alert and clear selection
        window.alert('Asistencia guardada con éxito');

        // Clear selection (reset all present flags to false)
        const updatedStudents = selectedClase.alumnos_inscriptos?.map(al => ({
            ...al,
            presente: false
        }));

        setSelectedClase({
            ...selectedClase,
            alumnos_inscriptos: updatedStudents
        });
    };

    if (loading) return <div className="p-8 text-center">Cargando clases...</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] p-4 md:p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-heading font-black uppercase tracking-wide text-gray-900">
                    {selectedClase ? 'Tomar Asistencia' : 'Mis Clases de Hoy'}
                </h1>
                <p className="text-gray-500 text-sm mt-0.5 font-medium">
                    {selectedClase ? `Clase: ${selectedClase.nombre_clase}` : new Date().toLocaleDateString()}
                </p>
            </div>

            {/* Content */}
            {selectedClase ? (
                // Attendance View
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedClase(null)}>
                                ← Volver
                            </Button>
                            <span className="font-bold text-gray-700">{selectedClase.horario_inicio} - {selectedClase.horario_fin}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                            Total: {selectedClase.alumnos_inscriptos?.length || 0}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {loadingStudents ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <Loader2 className="w-8 h-8 animate-spin mb-2 text-brand-red" />
                                <p>Cargando alumnos reales...</p>
                            </div>
                        ) : selectedClase.alumnos_inscriptos && selectedClase.alumnos_inscriptos.length > 0 ? (
                            selectedClase.alumnos_inscriptos.map((alumno) => (
                                <div
                                    key={alumno.id_usuario}
                                    onClick={() => toggleAttendance(alumno.id_usuario)}
                                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${alumno.presente
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-white border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Large Checkbox/Toggle */}
                                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${alumno.presente ? 'bg-green-500 border-green-500' : 'border-gray-300 bg-white'
                                            }`}>
                                            {alumno.presente && <CheckCircle size={16} className="text-white" />}
                                        </div>

                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${alumno.presente ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {alumno.nombre_usuario.charAt(0)}
                                        </div>
                                        <span className={`font-medium text-lg ${alumno.presente ? 'text-green-900' : 'text-gray-700'}`}>
                                            {alumno.nombre_usuario}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-400">
                                <p>No hay alumnos inscritos en esta disciplina.</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <Button
                            className="w-full bg-brand-red hover:bg-red-700 text-white"
                            size="lg"
                            onClick={handleFinalizarClase}
                            disabled={loadingStudents || !selectedClase.alumnos_inscriptos || selectedClase.alumnos_inscriptos.length === 0}
                        >
                            <Save size={18} className="mr-2" />
                            Finalizar Clase
                        </Button>
                    </div>
                </div>
            ) : (
                // Class List View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clases.map((clase) => (
                        <div
                            key={clase.id_clase}
                            onClick={() => handleClassClick(clase)}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-brand-red/30 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-red-50 text-brand-red rounded-lg group-hover:bg-brand-red group-hover:text-white transition-colors">
                                    <Clock size={24} />
                                </div>
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-bold uppercase">
                                    {clase.dia_semana}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{clase.nombre_clase}</h3>
                            <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                                <MapPin size={14} /> Sala Principal
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-1 text-sm font-medium text-gray-600">
                                    <Clock size={14} />
                                    {clase.horario_inicio} - {clase.horario_fin}
                                </div>
                                <div className="flex items-center gap-1 text-sm font-medium text-gray-600">
                                    <Users size={14} />
                                    <span>{clase.alumnos_inscriptos ? clase.alumnos_inscriptos.length : 0}/{clase.cupo_maximo}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
