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
 * Devuelve YYYY-MM-DD si el string es una fecha (YYYY-MM-DD o ISO con hora), o '' si es texto libre.
 * Usa la parte de fecha tal cual (sin pasar por Date) para evitar corrimientos por zona horaria.
 */
export function toDateInputValue(fechaStr: string | null | undefined): string {
    if (!fechaStr) return '';
    const m = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(fechaStr);
    return m ? `${m[1]}-${m[2]}-${m[3]}` : '';
}

/**
 * Formatea una fecha YYYY-MM-DD o ISO a DD/MM/AAAA.
 * Si es texto libre (ej: "ayer"), lo devuelve tal cual.
 */
export function formatFechaLocal(fechaStr: string | null | undefined): string {
    if (!fechaStr) return '-';
    const iso = toDateInputValue(fechaStr);
    if (!iso) return fechaStr;
    const [year, month, day] = iso.split('-');
    return `${day}/${month}/${year}`;
}

/**
 * Calcula el tiempo transcurrido desde una fecha de inicio hasta hoy (ej: "5 meses", "1 año, 2 meses", "3 semanas").
 * Si es texto libre (ej: "ayer"), lo devuelve tal cual sin fallar.
 */
export function calcularTiempoEntrenamiento(fechaStr: string | null | undefined): string {
    if (!fechaStr) return '-';

    const iso = toDateInputValue(fechaStr);
    if (!iso) return fechaStr;
    const [y, mo, da] = iso.split('-').map(n => parseInt(n, 10));
    const d = new Date(y, mo - 1, da);

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


/**
 * Resumen para mostrar en UI: `label` es el tiempo transcurrido (o el texto libre)
 * y `desde` la fecha DD/MM/AAAA si el valor es una fecha real.
 */
export function describirTiempoEntrenamiento(valor: string | null | undefined): { label: string; desde?: string } {
    const label = calcularTiempoEntrenamiento(valor);
    return toDateInputValue(valor) ? { label, desde: formatFechaLocal(valor) } : { label };
}

/** Fecha de hoy (o de `d`) como YYYY-MM-DD en hora LOCAL. Usar para valores por defecto de <input type="date">. */
export function hoyLocalISO(d: Date = new Date()): string {
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
}

/** YYYY-MM-DD local de un timestamp ISO guardado (ej. fecha_pago). '' si es inválido. */
export function isoALocalInput(iso: string | null | undefined): string {
    if (!iso) return '';
    const d = new Date(iso);
    return isNaN(d.getTime()) ? '' : hoyLocalISO(d);
}

/**
 * Convierte el valor de un <input type="date"> (YYYY-MM-DD) a un ISO al mediodía local,
 * para que al guardarlo no se corra al día anterior/siguiente por la zona horaria.
 */
export function inputFechaAISO(yyyyMmDd: string): string {
    const [y, m, d] = yyyyMmDd.split('-').map(Number);
    return new Date(y, m - 1, d, 12, 0, 0, 0).toISOString();
}

/**
 * true si la cuota está vigente: el vencimiento (columna DATE) es hoy o posterior.
 * Compara solo la fecha (YYYY-MM-DD) para que todas las pantallas cuenten igual
 * y un alumno que vence hoy figure al día durante todo el día.
 */
export function cuotaVigente(fechaVencimiento: string | null | undefined): boolean {
    const venc = toDateInputValue(fechaVencimiento);
    return !!venc && venc >= hoyLocalISO();
}

/** true si la fecha ISO cae en el mes (0-11) y año indicados, en hora local. */
export function esMismoMes(iso: string | null | undefined, mes: number, anio: number): boolean {
    if (!iso) return false;
    const d = new Date(iso);
    return d.getMonth() === mes && d.getFullYear() === anio;
}
