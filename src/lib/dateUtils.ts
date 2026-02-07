export const DAYS_OF_WEEK = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export function getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export function formatDate(date: Date): string {
    return `${date.getDate()} de ${MONTHS[date.getMonth()]}, ${date.getFullYear()}`;
}

export function formatDay(date: Date): string {
    return daysShort[date.getDay()]; // LUN, MAR, etc.
}

export const daysShort = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

// Helper to generate time slots from 08:00 to 23:00
export function generateTimeSlots(startHour: number, endHour: number): string[] {
    const slots = [];
    for (let i = startHour; i <= endHour; i++) {
        slots.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return slots;
}
