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

/**
 * Formatea una fecha YYYY-MM-DD o ISO a DD/MM/AAAA.
 * Si es texto libre (ej: "ayer"), lo devuelve tal cual.
 */
export function formatFechaLocal(fechaStr: string | null | undefined): string {
    if (!fechaStr) return '-';
    if (fechaStr.includes('T')) {
        const d = new Date(fechaStr);
        return isNaN(d.getTime()) ? fechaStr : d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    const parts = fechaStr.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
        const [year, month, day] = parts;
        return `${day.substring(0, 2)}/${month}/${year}`;
    }
    return fechaStr;
}

/**
 * Calcula el tiempo transcurrido desde una fecha de inicio hasta hoy (ej: "5 meses", "1 año, 2 meses", "3 semanas").
 * Si es texto libre (ej: "ayer"), lo devuelve tal cual sin fallar.
 */
export function calcularTiempoEntrenamiento(fechaStr: string | null | undefined): string {
    if (!fechaStr) return '-';

    let d: Date;
    if (fechaStr.includes('T')) {
        d = new Date(fechaStr);
    } else {
        const parts = fechaStr.split('-');
        if (parts.length === 3 && parts[0].length === 4) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2].substring(0, 2), 10);
            d = new Date(year, month, day);
        } else {
            return fechaStr;
        }
    }

    if (isNaN(d.getTime())) return fechaStr;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);

    if (d.getTime() > hoy.getTime()) {
        return 'Fecha futura';
    }

    let years = hoy.getFullYear() - d.getFullYear();
    let months = hoy.getMonth() - d.getMonth();
    let days = hoy.getDate() - d.getDate();

    if (days < 0) {
        months -= 1;
        const prevMonth = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
        days += prevMonth.getDate();
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    const totalDays = Math.floor((hoy.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

    if (years === 0 && months === 0) {
        if (totalDays === 0) return 'Hoy';
        if (totalDays === 1) return '1 día';
        if (totalDays < 7) return `${totalDays} días`;
        const weeks = Math.floor(totalDays / 7);
        return weeks === 1 ? '1 sem.' : `${weeks} sem.`;
    }

    const partsStr: string[] = [];
    if (years > 0) {
        partsStr.push(`${years} ${years === 1 ? 'año' : 'años'}`);
    }
    if (months > 0) {
        partsStr.push(`${months} ${months === 1 ? 'mes' : 'meses'}`);
    }

    return partsStr.join(', ');
}

