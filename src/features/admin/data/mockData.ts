import { Alumno, Disciplina, Pago, Profesor } from '../types';

export const MOCK_ALUMNOS: Alumno[] = [
    {
        id: '1',
        nombre: 'Juan',
        apellido: 'Pérez',
        disciplina: 'Kickboxing',
        estadoPago: 'al día',
        fechaRegistro: '2023-01-15',
    },
    {
        id: '2',
        nombre: 'María',
        apellido: 'Gómez',
        disciplina: 'Boxeo',
        estadoPago: 'pendiente',
        fechaRegistro: '2023-02-20',
    },
    {
        id: '3',
        nombre: 'Carlos',
        apellido: 'López',
        disciplina: 'Fuerza',
        estadoPago: 'vencido',
        fechaRegistro: '2023-03-10',
    },
    {
        id: '4',
        nombre: 'Ana',
        apellido: 'Martínez',
        disciplina: 'Kickboxing',
        estadoPago: 'al día',
        fechaRegistro: '2023-04-05',
    },
    {
        id: '5',
        nombre: 'Pedro',
        apellido: 'Sánchez',
        disciplina: 'Boxeo',
        estadoPago: 'al día',
        fechaRegistro: '2023-05-12',
    },
    {
        id: '6',
        nombre: 'Laura',
        apellido: 'Rodríguez',
        disciplina: 'Fuerza',
        estadoPago: 'vencido',
        fechaRegistro: '2023-06-25',
    },
    {
        id: '7',
        nombre: 'Sofía',
        apellido: 'Fernández',
        disciplina: 'Kickboxing',
        estadoPago: 'pendiente',
        fechaRegistro: '2023-07-30',
    },
];

export const MOCK_PAGOS: Pago[] = [
    {
        id: '1',
        alumnoId: '1',
        alumnoNombre: 'Juan Pérez',
        disciplinaId: '1',
        disciplinaNombre: 'Kickboxing',
        monto: 15000,
        mes: 'Febrero',
        anio: 2024,
        fechaPago: '2024-02-05',
        metodoPago: 'Efectivo',
        estado: 'Pagado'
    },
    {
        id: '2',
        alumnoId: '2',
        alumnoNombre: 'María Gómez',
        disciplinaId: '2',
        disciplinaNombre: 'Boxeo',
        monto: 12000,
        mes: 'Febrero',
        anio: 2024,
        fechaPago: '2024-02-06',
        metodoPago: 'Transferencia',
        estado: 'Pagado'
    },
    {
        id: '3',
        alumnoId: '3',
        alumnoNombre: 'Carlos López',
        disciplinaId: '3',
        disciplinaNombre: 'Fuerza',
        monto: 10000,
        mes: 'Enero',
        anio: 2024,
        fechaPago: '2024-01-10',
        metodoPago: 'Efectivo',
        estado: 'Vencido'
    }
];

export const MOCK_DISCIPLINAS: Disciplina[] = [
    {
        id: '1',
        nombre: 'Kickboxing',
        descripcion: 'Entrenamiento de alta intensidad que combina técnicas de boxeo con patadas de artes marciales.',
        imagen: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: '2',
        nombre: 'Boxeo',
        descripcion: 'Deporte de combate en el que dos personas luchan utilizando únicamente sus puños con guantes.',
        imagen: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: '3',
        nombre: 'Muay Thai',
        descripcion: 'Arte marcial tailandés conocido como "el arte de las ocho extremidades".',
        imagen: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=600'
    }
];

export const MOCK_PROFESORES: Profesor[] = [
    {
        id: '1',
        nombre: 'Martín Silva',
        especialidad: 'Kickboxing',
        imagen: 'https://i.pravatar.cc/150?u=martin'
    },
    {
        id: '2',
        nombre: 'Laura González',
        especialidad: 'Boxeo',
        imagen: 'https://i.pravatar.cc/150?u=laura'
    },
    {
        id: '3',
        nombre: 'Carlos Ruiz',
        especialidad: 'Muay Thai',
        imagen: 'https://i.pravatar.cc/150?u=carlos'
    }
];

export const MOCK_SCHEDULE = [
    {
        id: 1,
        day: "LUNES",
        time: "18:00 - 19:30",
        discipline: "KICKBOXING",
        variant: "kickboxing",
        instructor: "Prof. Sanchez"
    },
    {
        id: 2,
        day: "LUNES",
        time: "20:00 - 21:00",
        discipline: "BOXEO",
        variant: "boxeo",
    },
    {
        id: 3,
        day: "MARTES",
        time: "09:00 - 10:30",
        discipline: "MUAY THAI",
        variant: "muaythai",
    },
    {
        id: 4,
        day: "MIÉRCOLES",
        time: "19:00 - 20:30",
        discipline: "KICKBOXING",
        variant: "kickboxing",
    },
    {
        id: 5,
        day: "JUEVES",
        time: "17:00 - 18:30",
        discipline: "BOXEO",
        variant: "boxeo",
    },
    {
        id: 6,
        day: "JUEVES",
        time: "09:00 - 10:30",
        discipline: "MUAY THAI",
        variant: "muaythai",
    },
    {
        id: 7,
        day: "SÁBADO",
        time: "09:00 - 11:30",
        discipline: "SEMINARIO MUAY THAI",
        variant: "muaythai",
    },
    {
        id: 8,
        day: "VIERNES",
        time: "18:00 - 19:30",
        discipline: "KICKBOXING",
        variant: "kickboxing"
    },
    {
        id: 9,
        day: "VIERNES",
        time: "20:00 - 21:00",
        discipline: "BOXEO",
        variant: "boxeo"
    }
] as const;
