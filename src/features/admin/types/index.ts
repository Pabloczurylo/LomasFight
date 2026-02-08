export interface Alumno {
    id: string;
    nombre: string;
    apellido: string;
    disciplina: 'Kickboxing' | 'Boxeo' | 'Fuerza';
    estadoPago: 'al día' | 'pendiente' | 'vencido';
    fechaRegistro: string; // ISO format YYYY-MM-DD
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
