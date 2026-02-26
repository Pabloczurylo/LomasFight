import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Users, Dumbbell } from 'lucide-react';
import { ClienteBackend, Disciplina } from '../types';

export type CuotaPayload = {
    id_cliente: number;
    id_disciplina: number;
    monto: number;
};

export type AlquilerPayload = {
    id_disciplina: number;
    monto_cuota: number;
    periodo_pagado: string; // ISO String for Date
};

interface RegistroPagoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveCuota: (data: CuotaPayload) => Promise<void>;
    onSaveAlquiler: (data: AlquilerPayload) => Promise<void>;
    clientes: ClienteBackend[]; // Usamos el tipo backend real
    disciplinas: Disciplina[];
}

export default function RegistroPagoModal({
    isOpen,
    onClose,
    onSaveCuota,
    onSaveAlquiler,
    clientes,
    disciplinas
}: RegistroPagoModalProps) {
    const [tipoPago, setTipoPago] = useState<'CUOTA' | 'ALQUILER'>('CUOTA');
    const [isLoading, setIsLoading] = useState(false);

    // Form fields Cuota
    const [cuotaClienteId, setCuotaClienteId] = useState('');
    const [cuotaDisciplinaId, setCuotaDisciplinaId] = useState('');
    const [cuotaMonto, setCuotaMonto] = useState('');

    // Form fields Alquiler
    const [alquilerDisciplinaId, setAlquilerDisciplinaId] = useState('');
    const [alquilerMonto, setAlquilerMonto] = useState('');
    const [alquilerPeriodo, setAlquilerPeriodo] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (isOpen) {
            setTipoPago('CUOTA');
            setCuotaClienteId('');
            setCuotaDisciplinaId('');
            setCuotaMonto('');

            setAlquilerDisciplinaId('');
            setAlquilerMonto('');
            setAlquilerPeriodo(new Date().toISOString().split('T')[0]);
            setIsLoading(false);
        }
    }, [isOpen]);

    // Filtrar solo clientes activos
    const clientesActivos = clientes.filter(c => c.activo === true);

    // Auto-completar disciplina si el cliente solo tiene una (o pre-seleccionada en backend)
    useEffect(() => {
        if (tipoPago === 'CUOTA' && cuotaClienteId) {
            const cliente = clientesActivos.find(c => c.id_cliente.toString() === cuotaClienteId);
            if (cliente && cliente.id_disciplina) {
                setCuotaDisciplinaId(cliente.id_disciplina.toString());
            }
        }
    }, [cuotaClienteId, clientesActivos, tipoPago]);

    // Auto-completar monto sugerido en base a la disciplina
    useEffect(() => {
        if (tipoPago === 'CUOTA' && cuotaDisciplinaId) {
            const d = disciplinas.find(x => x.id_disciplina.toString() === cuotaDisciplinaId);
            if (d && d.cuota) {
                setCuotaMonto(d.cuota.toString());
            }
        }
    }, [cuotaDisciplinaId, disciplinas, tipoPago]);

    useEffect(() => {
        if (tipoPago === 'ALQUILER' && alquilerDisciplinaId) {
            const d = disciplinas.find(x => x.id_disciplina.toString() === alquilerDisciplinaId);
            if (d && d.cuota) {
                setAlquilerMonto(d.cuota.toString());
            }
        }
    }, [alquilerDisciplinaId, disciplinas, tipoPago]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (tipoPago === 'CUOTA') {
                if (!cuotaClienteId || !cuotaDisciplinaId || !cuotaMonto) return;
                await onSaveCuota({
                    id_cliente: parseInt(cuotaClienteId),
                    id_disciplina: parseInt(cuotaDisciplinaId),
                    monto: parseFloat(cuotaMonto)
                });
            } else {
                if (!alquilerDisciplinaId || !alquilerMonto || !alquilerPeriodo) return;
                // Nos aseguramos de enviar un ISO string real basado en la fecha seleccionada
                const dateObj = new Date(alquilerPeriodo);
                // Ajustar zona horaria si fuera necesario o mandar directo a ISO y que backend parse

                await onSaveAlquiler({
                    id_disciplina: parseInt(alquilerDisciplinaId),
                    monto_cuota: parseFloat(alquilerMonto),
                    periodo_pagado: dateObj.toISOString()
                });
            }
        } catch (error) {
            console.error("Error al guardar el pago:", error);
            // Mostrar error (idealmente con toast)
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 animate-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-heading font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-brand-red" />
                    Registrar Nuevo Ingreso
                </h3>

                {/* Tabs / Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                    <button
                        type="button"
                        onClick={() => setTipoPago('CUOTA')}
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${tipoPago === 'CUOTA' ? 'bg-white shadow-sm text-brand-red' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Cobro de Cuota
                    </button>
                    <button
                        type="button"
                        onClick={() => setTipoPago('ALQUILER')}
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${tipoPago === 'ALQUILER' ? 'bg-white shadow-sm text-brand-red' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Pago de Alquiler
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {tipoPago === 'CUOTA' && (
                        <>
                            {/* Formulario Cuotas */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        Alumno (Activo)
                                    </label>
                                    <select
                                        value={cuotaClienteId}
                                        onChange={(e) => setCuotaClienteId(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red bg-white transition-all"
                                        required
                                        disabled={isLoading}
                                    >
                                        <option value="">Seleccionar alumno activo...</option>
                                        {clientesActivos.map((a) => (
                                            <option key={a.id_cliente} value={a.id_cliente}>
                                                {a.nombre} {a.apellido} {a.dni ? `(${a.dni})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                        <Dumbbell className="w-4 h-4 text-gray-400" />
                                        Disciplina
                                    </label>
                                    <select
                                        value={cuotaDisciplinaId}
                                        onChange={(e) => setCuotaDisciplinaId(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red bg-white transition-all"
                                        required
                                        disabled={isLoading}
                                    >
                                        <option value="">Seleccionar disciplina...</option>
                                        {disciplinas.map((d) => (
                                            <option key={d.id_disciplina} value={d.id_disciplina}>
                                                {d.nombre_disciplina}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                        Monto a Cobrar ($)
                                    </label>
                                    <input
                                        type="number"
                                        value={cuotaMonto}
                                        onChange={(e) => setCuotaMonto(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        required
                                        disabled={isLoading}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Este valor se enviará como "monto".
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {tipoPago === 'ALQUILER' && (
                        <>
                            {/* Formulario Alquiler */}
                            <div className="space-y-4">
                                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 mb-4">
                                    Este ingreso se registrará a nombre de la disciplina/profesor seleccionado, sin requerir un alumno.
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                        <Dumbbell className="w-4 h-4 text-gray-400" />
                                        Disciplina / Profesor
                                    </label>
                                    <select
                                        value={alquilerDisciplinaId}
                                        onChange={(e) => setAlquilerDisciplinaId(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red bg-white transition-all"
                                        required
                                        disabled={isLoading}
                                    >
                                        <option value="">Seleccionar disciplina...</option>
                                        {disciplinas.map((d) => (
                                            <option key={d.id_disciplina} value={d.id_disciplina}>
                                                {d.nombre_disciplina}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        Período Pagado (Fecha)
                                    </label>
                                    <input
                                        type="date"
                                        value={alquilerPeriodo}
                                        onChange={(e) => setAlquilerPeriodo(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                        Monto Alquiler ($)
                                    </label>
                                    <input
                                        type="number"
                                        value={alquilerMonto}
                                        onChange={(e) => setAlquilerMonto(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        required
                                        disabled={isLoading}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Este valor se enviará como "monto_cuota".
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex gap-3 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md disabled:bg-red-400 flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Registrando...' : 'Registrar Ingreso'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
