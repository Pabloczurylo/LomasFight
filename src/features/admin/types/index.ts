export interface Alumno {
    id: string;
    nombre: string;
    apellido: string;
    disciplina: 'Kickboxing' | 'Boxeo' | 'Fuerza';
    estadoPago: 'al día' | 'pendiente' | 'vencido';
    fechaRegistro: string; // ISO format YYYY-MM-DD
}
