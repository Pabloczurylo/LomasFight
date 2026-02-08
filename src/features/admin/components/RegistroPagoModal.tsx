import React, { useState, useEffect } from 'react';
import { X, DollarSign } from 'lucide-react';
import { Pago, Alumno, Disciplina } from '../types';

interface RegistroPagoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (pago: Omit<Pago, 'id'>) => void;
    alumnos: Alumno[];
    disciplinas: Disciplina[];
}

const MESES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const METODOS_PAGO = ['Efectivo', 'Transferencia', 'Tarjeta'] as const;

export default function RegistroPagoModal({ isOpen, onClose, onSave, alumnos, disciplinas }: RegistroPagoModalProps) {
    const [alumnoId, setAlumnoId] = useState('');
    const [disciplinaId, setDisciplinaId] = useState('');
    const [monto, setMonto] = useState('');
    const [mes, setMes] = useState(MESES[new Date().getMonth()]);
    const [anio, setAnio] = useState(new Date().getFullYear());
    const [fechaPago, setFechaPago] = useState(new Date().toISOString().split('T')[0]);
    const [metodoPago, setMetodoPago] = useState<Pago['metodoPago']>('Efectivo');

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setAlumnoId('');
            setDisciplinaId('');
            setMonto('');
            setMes(MESES[new Date().getMonth()]);
            setAnio(new Date().getFullYear());
            setFechaPago(new Date().toISOString().split('T')[0]);
            setMetodoPago('Efectivo');
        }
    }, [isOpen]);

    // Auto-select discipline if student has one assigned matching available disciplines
    useEffect(() => {
        if (alumnoId) {
            const alumno = alumnos.find(a => a.id === alumnoId);
            if (alumno) {
                // Try to find a discipline matching the student's assigned discipline name
                const matchingDisciplina = disciplinas.find(d => d.nombre === alumno.disciplina);
                if (matchingDisciplina) {
                    setDisciplinaId(matchingDisciplina.id);
                } else {
                    setDisciplinaId('');
                }
            }
        }
    }, [alumnoId, alumnos, disciplinas]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const alumno = alumnos.find(a => a.id === alumnoId);
        const disciplina = disciplinas.find(d => d.id === disciplinaId);

        if (!alumno || !disciplina) return;

        onSave({
            alumnoId,
            alumnoNombre: `${alumno.nombre} ${alumno.apellido}`,
            disciplinaId,
            disciplinaNombre: disciplina.nombre,
            monto: Number(monto),
            mes,
            anio: Number(anio),
            fechaPago,
            metodoPago,
            estado: 'Pagado' // Direct registration assumes payment is made
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 animate-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-heading font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-brand-red" />
                    Registrar Nuevo Pago
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Alumno Selector */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Alumno
                        </label>
                        <select
                            value={alumnoId}
                            onChange={(e) => setAlumnoId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red bg-white transition-all"
                            required
                        >
                            <option value="">Seleccionar alumno...</option>
                            {alumnos.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.nombre} {a.apellido}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Disciplina Selector */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Disciplina
                        </label>
                        <select
                            value={disciplinaId}
                            onChange={(e) => setDisciplinaId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red bg-white transition-all"
                            required
                        >
                            <option value="">Seleccionar disciplina...</option>
                            {disciplinas.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Monto */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Monto
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500">$</span>
                                </div>
                                <input
                                    type="number"
                                    value={monto}
                                    onChange={(e) => setMonto(e.target.value)}
                                    className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>

                        {/* Fecha Pago */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Fecha de Pago
                            </label>
                            <input
                                type="date"
                                value={fechaPago}
                                onChange={(e) => setFechaPago(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Mes */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Mes Correspondiente
                            </label>
                            <select
                                value={mes}
                                onChange={(e) => setMes(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red bg-white transition-all"
                                required
                            >
                                {MESES.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>

                        {/* Año */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Año
                            </label>
                            <input
                                type="number"
                                value={anio}
                                onChange={(e) => setAnio(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                                min="2020"
                                max="2030"
                                required
                            />
                        </div>
                    </div>

                    {/* Método de Pago */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Método de Pago
                        </label>
                        <div className="flex gap-2">
                            {METODOS_PAGO.map((metodo) => (
                                <button
                                    key={metodo}
                                    type="button"
                                    onClick={() => setMetodoPago(metodo)}
                                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${metodoPago === metodo
                                        ? 'bg-brand-red text-white border-brand-red shadow-sm'
                                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {metodo}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md"
                        >
                            Registrar Pago
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
