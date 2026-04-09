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
    domicilio: string | null;
    id_disciplina: number;
    id_profesor_que_cargo: number | null;
    fecha_ultimo_pago: string | null;
    fecha_vencimiento: string | null;
    activo: boolean | null;
    inactivo: boolean | null;
    disciplinas?: {
        nombre_disciplina: string;
    };
    pagos?: any[];
}

export interface Disciplina {
    id_disciplina: number;
    nombre_disciplina: string;
    descripcion: string;
    img_banner: string;
    img_preview: string;
    cuota: number;
    numero_celular?: string | null;
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
    id_profesor: number | null;
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
    tipo: 'CUOTA' | 'ALQUILER' | 'GASTO' | 'ENTRADA';
    fecha: string;
    concepto: string; // Nombre del alumno o "Alquiler - Nombre Disciplina" o concepto del gasto
    monto: number;
    estado: 'Pagado' | 'Pendiente' | 'Vencido';
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

export interface GastoBackend {
    id_gasto: number;
    concepto: string;
    monto: number;
    fecha_gasto: string;
    activo: boolean;
}
