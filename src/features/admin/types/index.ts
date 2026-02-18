export interface Alumno {
    id: string;
    nombre: string;
    apellido: string;
    disciplina: string;
    estadoPago: 'al día' | 'pendiente' | 'vencido';
    fechaRegistro: string; // ISO format YYYY-MM-DD
}

export interface ClienteBackend {
    id_cliente: number;
    nombre: string;
    apellido: string;
    dni: string | null;
    fecha_nacimiento: string | null;
    grupo_sanguineo: string | null;
    id_disciplina: number;
    id_profesor_que_cargo: number | null;
    fecha_ultimo_pago: string | null;
    activo: boolean | null;
    disciplinas?: {
        nombre_disciplina: string;
    };
    pagos?: any[];
}

export interface Disciplina {
    id_disciplina: number; // Backend uses snake_case and number
    nombre_disciplina: string;
    descripcion: string; // Corrected to match Supabase
    img_banner: string; // Corrected to match Supabase
    img_preview?: string; // Optional or mapped
    cuota: number; // Added as per latest backend requirements
}

// Frontend adapter type if we want to keep UI clean, but better to match backend for now
export interface DisciplinaUI {
    id: string;
    nombre: string;
    descripcion: string;
    imagen: string;
}

export interface Usuario {
    id_usuario: number;
    nombre_usuario: string;
    mail_usuario: string;
    rol: string; // 'admin' or 'profesor'
    activo: boolean;
}

export interface Profesor {
    id: string;
    nombre: string;
    especialidad: string;
    imagen: string;
}

export interface Pago {
    id: string;
    alumnoId: string;
    alumnoNombre: string;
    disciplinaId: string;
    disciplinaNombre: string;
    monto: number;
    mes: string;
    anio: number;
    fechaPago: string; // ISO YYYY-MM-DD
    metodoPago: 'Efectivo' | 'Transferencia' | 'Tarjeta';
    estado: 'Pagado' | 'Pendiente' | 'Vencido';
}
