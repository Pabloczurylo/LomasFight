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
    pagos?: any[]; // We can define PagoBackend if needed, but for now any[] or specific if used
}

export interface Disciplina {
    id: string;
    nombre: string;
    descripcion: string;
    imagen: string;
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
