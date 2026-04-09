import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, DollarSign, Calendar, Users, Dumbbell, Edit3, FileText } from 'lucide-react';
import { ClienteBackend, Disciplina, UnifiedPago } from '../types';

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

export type GastoPayload = {
    concepto: string;
    monto: number;
    fecha_gasto?: string;
};

interface RegistroPagoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveCuota: (data: CuotaPayload) => Promise<void>;
    onSaveGasto: (data: GastoPayload) => Promise<void>;
    clientes: ClienteBackend[];
    disciplinas: Disciplina[];
    initialData?: UnifiedPago | null;
}

export default function RegistroPagoModal({
    isOpen,
    onClose,
    onSaveCuota,
    onSaveGasto,
    clientes,
    disciplinas,
    initialData
}: RegistroPagoModalProps) {
    const [tipoPago, setTipoPago] = useState<'CUOTA' | 'ALQUILER' | 'ENTRADA' | 'GASTO'>('CUOTA');
    const [isLoading, setIsLoading] = useState(false);

    // Form fields Cuota
    const [cuotaClienteId, setCuotaClienteId] = useState('');
    const [cuotaDisciplinaId, setCuotaDisciplinaId] = useState('');
    const [cuotaMonto, setCuotaMonto] = useState('');

    // Combobox búsqueda de alumnos
    const [clienteSearch, setClienteSearch] = useState('');
    const [showClienteDropdown, setShowClienteDropdown] = useState(false);
    const comboRef = useRef<HTMLDivElement>(null);

    // Form fields Entrada
    const [entradaConcepto, setEntradaConcepto] = useState('');
    const [entradaMonto, setEntradaMonto] = useState('');
    const [entradaPeriodo, setEntradaPeriodo] = useState(new Date().toISOString().split('T')[0]);

    // Form fields Gasto
    const [gastoConcepto, setGastoConcepto] = useState('');
    const [gastoMonto, setGastoMonto] = useState('');
    const [gastoPeriodo, setGastoPeriodo] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(false);
            if (initialData) {
                setTipoPago(initialData.tipo);
                if (initialData.tipo === 'CUOTA') {
                    setCuotaClienteId(initialData.idCliente?.toString() || '');
                    const clienteFound = clientes.find(c => c.id_cliente === initialData.idCliente);
                    setClienteSearch(clienteFound ? `${clienteFound.nombre} ${clienteFound.apellido}` : '');

                    let matchingDiscipline = disciplinas.find(d => d.nombre_disciplina === initialData.disciplinaNombre);
                    if (!matchingDiscipline && initialData.idCliente) {
                        const cliente = clientes.find(c => c.id_cliente === initialData.idCliente);
                        if (cliente?.id_disciplina) {
                            matchingDiscipline = disciplinas.find(d => d.id_disciplina === cliente.id_disciplina);
                        }
                    }

                    setCuotaDisciplinaId(matchingDiscipline?.id_disciplina?.toString() || '');
                    setCuotaMonto(initialData.monto.toString());
                } else if (initialData.tipo === 'ALQUILER') {
                    setTipoPago('ENTRADA'); // Force old alquiler to display as Entrada
                    setEntradaConcepto(`Alquiler - ${initialData.disciplinaNombre || 'Generico'}`);
                    setEntradaMonto(initialData.monto.toString());
                    setEntradaPeriodo(new Date(initialData.fecha).toISOString().split('T')[0]);
                } else if (initialData.tipo === 'ENTRADA') {
                    setEntradaConcepto(initialData.concepto.replace('[ENTRADA] ', ''));
                    setEntradaMonto(initialData.monto.toString());
                    setEntradaPeriodo(new Date(initialData.fecha).toISOString().split('T')[0]);
                } else if (initialData.tipo === 'GASTO') {
                    setGastoConcepto(initialData.concepto);
                    setGastoMonto(initialData.monto.toString());
                    setGastoPeriodo(new Date(initialData.fecha).toISOString().split('T')[0]);
                }
            } else {
                setTipoPago('CUOTA');
                setCuotaClienteId('');
                setClienteSearch('');
                setCuotaDisciplinaId('');
                setCuotaMonto('');

                setEntradaConcepto('');
                setEntradaMonto('');
                setEntradaPeriodo(new Date().toISOString().split('T')[0]);

                setGastoConcepto('');
                setGastoMonto('');
                setGastoPeriodo(new Date().toISOString().split('T')[0]);
            }
        }
    }, [isOpen, initialData, clientes, disciplinas]);

    // Filtrar solo clientes activos
    const clientesActivos = clientes.filter(c => c.activo === true);

    // Clientes filtrados según lo que escribe el usuario en el combobox
    const filteredClientes = useMemo(() => {
        const q = clienteSearch.trim().toLowerCase();
        if (!q) return clientesActivos;
        return clientesActivos.filter(c => {
            const full = `${c.nombre} ${c.apellido}`.toLowerCase();
            return full.includes(q) || (c.dni?.toLowerCase().includes(q));
        });
    }, [clienteSearch, clientesActivos]);

    // Auto-completar disciplina si el cliente solo tiene una
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
    }, [cuotaDisciplinaId, disciplinas, tipoPago]);    const handleSubmit = async (e: React.FormEvent) => {
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
            } else if (tipoPago === 'ENTRADA') {
                if (!entradaConcepto.trim() || !entradaMonto || !entradaPeriodo) return;
                const d = new Date(entradaPeriodo);
                d.setHours(d.getHours() + 12); // avoid timezone issues shifting to previous day
                await onSaveGasto({
                    concepto: `[ENTRADA] ${entradaConcepto.trim()}`,
                    monto: parseFloat(entradaMonto),
                    fecha_gasto: d.toISOString()
                });
            } else if (tipoPago === 'GASTO') {
                if (!gastoConcepto.trim() || !gastoMonto || !gastoPeriodo) return;
                const d = new Date(gastoPeriodo);
                d.setHours(d.getHours() + 12);
                await onSaveGasto({
                    concepto: gastoConcepto.trim(),
                    monto: parseFloat(gastoMonto),
                    fecha_gasto: d.toISOString()
                });
            }
        } catch (error) {
            console.error("Error al guardar:", error);
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
                    {initialData ? <Edit3 className="w-6 h-6 text-brand-red" /> : <DollarSign className="w-6 h-6 text-brand-red" />}
                    {initialData ? 'Editar Movimiento' : 'Registrar Movimiento'}
                </h3>

                {/* Tabs / Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                    <button
                        type="button"
                        disabled={!!initialData}
                        onClick={() => setTipoPago('CUOTA')}
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${tipoPago === 'CUOTA' ? 'bg-white shadow-sm text-brand-red' : 'text-gray-500 hover:text-gray-700'
                            } ${!!initialData ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Cuota
                    </button>
                    <button
                        type="button"
                        disabled={!!initialData}
                        onClick={() => setTipoPago('ENTRADA')}
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${tipoPago === 'ENTRADA' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'
                            } ${!!initialData ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Entrada (Ingreso Varios)
                    </button>
                    <button
                        type="button"
                        disabled={!!initialData}
                        onClick={() => setTipoPago('GASTO')}
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${tipoPago === 'GASTO' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500 hover:text-gray-700'
                            } ${!!initialData ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Gasto
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
                                    <div className="relative" ref={comboRef}>
                                        <input
                                            type="text"
                                            value={clienteSearch}
                                            onChange={(e) => {
                                                setClienteSearch(e.target.value);
                                                setCuotaClienteId('');
                                                setShowClienteDropdown(true);
                                            }}
                                            onFocus={() => setShowClienteDropdown(true)}
                                            onBlur={() => setTimeout(() => setShowClienteDropdown(false), 150)}
                                            placeholder="Buscar por nombre, apellido o DNI..."
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                                            disabled={isLoading}
                                            autoComplete="off"
                                        />
                                        {showClienteDropdown && (
                                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-52 overflow-y-auto">
                                                {filteredClientes.length > 0 ? (
                                                    filteredClientes.map(c => (
                                                        <button
                                                            key={c.id_cliente}
                                                            type="button"
                                                            onMouseDown={() => {
                                                                setCuotaClienteId(c.id_cliente.toString());
                                                                setClienteSearch(`${c.nombre} ${c.apellido}`);
                                                                setShowClienteDropdown(false);
                                                            }}
                                                            className="w-full text-left px-4 py-2.5 text-gray-800 hover:bg-red-50 hover:text-brand-red transition-colors text-sm border-b border-gray-50 last:border-0"
                                                        >
                                                            <span className="font-semibold">{c.nombre} {c.apellido}</span>
                                                            {c.dni && <span className="text-gray-400 ml-2 text-xs">DNI: {c.dni}</span>}
                                                            {c.disciplinas?.nombre_disciplina && (
                                                                <span className="text-gray-400 ml-1 text-xs">· {c.disciplinas.nombre_disciplina}</span>
                                                            )}
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-sm text-gray-500">
                                                        No se encontraron alumnos activos.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {!cuotaClienteId && clienteSearch && (
                                        <p className="text-xs text-amber-600 mt-1">Seleccioná un alumno de la lista.</p>
                                    )}
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
                                </div>
                            </div>
                        </>
                    )}

                    {tipoPago === 'ENTRADA' && (
                        <>
                            {/* Formulario Entrada */}
                            <div className="space-y-4">
                                <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-800 mb-4">
                                    Registrá un ingreso extra o genérico (Ej: venta de remeras, donación, alquiler). 
                                    Esto sumará al balance general de la caja.
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-gray-400" />
                                        Concepto de la Entrada
                                    </label>
                                    <input
                                        type="text"
                                        value={entradaConcepto}
                                        onChange={(e) => setEntradaConcepto(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                                        placeholder="Ej: Alquiler de espacio, Venta de material..."
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        Fecha del Ingreso
                                    </label>
                                    <input
                                        type="date"
                                        value={entradaPeriodo}
                                        onChange={(e) => setEntradaPeriodo(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                        Monto Ingresado ($)
                                    </label>
                                    <input
                                        type="number"
                                        value={entradaMonto}
                                        onChange={(e) => setEntradaMonto(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {tipoPago === 'GASTO' && (
                        <>
                            {/* Formulario Gasto */}
                            <div className="space-y-4">
                                <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg text-sm text-orange-800 mb-4">
                                    Registrá un gasto o egreso del negocio. Este monto se restará del balance mensual.
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-gray-400" />
                                        Concepto del Gasto
                                    </label>
                                    <input
                                        type="text"
                                        value={gastoConcepto}
                                        onChange={(e) => setGastoConcepto(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                                        placeholder="Ej: Compra de guantes, Luz, Agua..."
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        Fecha del Gasto
                                    </label>
                                    <input
                                        type="date"
                                        value={gastoPeriodo}
                                        onChange={(e) => setGastoPeriodo(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                        Monto del Gasto ($)
                                    </label>
                                    <input
                                        type="number"
                                        value={gastoMonto}
                                        onChange={(e) => setGastoMonto(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        required
                                        disabled={isLoading}
                                    />
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
                            className={`flex-1 px-4 py-2 text-white font-bold rounded-lg transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2 ${
                                tipoPago === 'GASTO' 
                                    ? 'bg-orange-600 hover:bg-orange-700' 
                                    : tipoPago === 'ENTRADA' ? 'bg-green-600 hover:bg-green-700' : 'bg-brand-red hover:bg-red-700'
                            }`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Guardando...' : initialData ? 'Guardar Cambios' : tipoPago === 'GASTO' ? 'Registrar Gasto' : 'Registrar Ingreso'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
