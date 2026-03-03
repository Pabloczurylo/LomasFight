export interface Alumno {
    id: string;
    nombre: string;
    apellido: string;
    disciplina: string;
    estadoPago: 'al día' | 'próximo a vencer' | 'pendiente' | 'inactivo';
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

export interface PagoBackend {
    id_pago: number;
    id_cliente: number;
    id_disciplina: number;
    monto: number;
    fecha_pago: string;
    clientes?: { nombre: string; apellido: string };
    disciplinas?: { nombre_disciplina: string };
}

export interface PagoDisciplinaBackend {
    id_pago_disciplina: number;
    id_disciplina: number;
    monto_cuota: number;
    periodo_pagado: string;
    fecha_pago: string;
    disciplinas?: { nombre_disciplina: string };
}

export interface UnifiedPago {
    id: string; // normalizado a string para id de react
    tipo: 'CUOTA' | 'ALQUILER';
    fecha: string;
    concepto: string; // Nombre del alumno o "Alquiler - Nombre Disciplina"
    monto: number;
    estado: 'Pagado' | 'Pendiente' | 'Vencido'; // El endpoint suele asumir todo lo que retorna está pagado, pero en el futuro podría cambiar. Pongo Pagado por defecto.
    // Propiedades originales para debug/internos
    originalId?: number;
    disciplinaNombre?: string;
    idCliente?: number;
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

export interface Teacher {
    id: number;
    nombre: string;
    apellido: string;
    id_disciplina?: number;
    disciplinas: string[];
    presentacion: string;
    imagen?: string;
    estado: 'Activo' | 'Inactivo';
}
