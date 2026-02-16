import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, CheckCircle, Save } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { api } from "../../../services/api";
import { toast } from "react-hot-toast";

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
    const [saving, setSaving] = useState(false);

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

            // In a real scenario, we would filter by API parameters
            // const response = await api.get(`/clases?profesor_id=${profesorId}&dia=${today}`);

            // For now, fetching all and filtering client-side or using mock if API not ready
            // Assuming API returns all classes for now as per previous patterns
            const response = await api.get('/clases');

            const allClasses = response.data;

            // Filter by professor and day (if backend doesn't do it)
            // Note: Adjust logic based on actual API response structure
            const myClasses = allClasses.filter((c: any) =>
                // Flexible check for instructor name or ID if available in response
                (c.instructor_nombre === user.nombre_usuario || c.id_profesor === profesorId) &&
                c.dia_semana.toLowerCase() === today.toLowerCase()
            );

            // Mocking students for the demo if API doesn't return them nested
            const classesWithStudents = myClasses.map((c: any) => ({
                ...c,
                alumnos_inscriptos: c.alumnos_inscriptos || [
                    { id_usuario: 101, nombre_usuario: "Juan Pérez", present: false },
                    { id_usuario: 102, nombre_usuario: "Maria Garcia", present: false },
                    { id_usuario: 103, nombre_usuario: "Carlos Lopez", present: false },
                ]
            }));

            setClases(classesWithStudents);
        } catch (error) {
            console.error("Error fetching classes:", error);
            // Fallback for demo if API fails
            setClases([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClassClick = (clase: Clase) => {
        setSelectedClase(clase);
    };

    const toggleAttendance = (alumnoId: number) => {
        if (!selectedClase || !selectedClase.alumnos_inscriptos) return;

        const updatedStudents = selectedClase.alumnos_inscriptos.map(upload => {
            if (upload.id_usuario === alumnoId) {
                return { ...upload, presente: !upload.presente };
            }
            return upload;
        });

        setSelectedClase({ ...selectedClase, alumnos_inscriptos: updatedStudents });
    };

    const handleSaveAsistencia = async () => {
        if (!selectedClase) return;
        setSaving(true);

        try {
            const presentes = selectedClase.alumnos_inscriptos
                ?.filter(a => a.presente)
                .map(a => a.id_usuario) || [];

            await api.post('/asistencia', {
                id_clase: selectedClase.id_clase,
                alumnos_presentes: presentes,
                fecha: new Date().toISOString().split('T')[0]
            });

            toast.success("Asistencia guardada correctamente");
            setSelectedClase(null); // Go back to list
        } catch (error) {
            console.error("Error saving attendance:", error);
            toast.error("Error al guardar asistencia");
        } finally {
            setSaving(false);
        }
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
                            Total: {selectedClase.alumnos_inscriptos?.length}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {selectedClase.alumnos_inscriptos?.map((alumno) => (
                            <div
                                key={alumno.id_usuario}
                                onClick={() => toggleAttendance(alumno.id_usuario)}
                                className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${alumno.presente
                                        ? 'bg-red-50 border-brand-red/30'
                                        : 'bg-white border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${alumno.presente ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        {alumno.nombre_usuario.charAt(0)}
                                    </div>
                                    <span className={`font-medium ${alumno.presente ? 'text-brand-red' : 'text-gray-700'}`}>
                                        {alumno.nombre_usuario}
                                    </span>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${alumno.presente ? 'border-brand-red bg-brand-red text-white' : 'border-gray-300'
                                    }`}>
                                    {alumno.presente && <CheckCircle size={14} />}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <Button
                            className="w-full bg-brand-red hover:bg-red-700 text-white"
                            size="lg"
                            onClick={handleSaveAsistencia}
                            disabled={saving}
                        >
                            <Save size={18} className="mr-2" />
                            {saving ? 'Guardando...' : 'Confirmar Asistencia'}
                        </Button>
                    </div>
                </div>
            ) : (
                // Class List View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clases.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No tienes clases asignadas para hoy.</p>
                        </div>
                    ) : (
                        clases.map((clase) => (
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
                                        <span>24/{clase.cupo_maximo}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
