import React, { useState, useEffect } from 'react';
import { X, Calendar, CheckCircle } from 'lucide-react';

interface FechaPagoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (fechaPago: string) => void;
    alumnoNombre: string;
    disciplinaNombre: string;
    isLoading?: boolean;
}

export default function FechaPagoModal({
    isOpen,
    onClose,
    onConfirm,
    alumnoNombre,
    disciplinaNombre,
    isLoading = false,
}: FechaPagoModalProps) {
    const [fechaPago, setFechaPago] = useState(new Date().toISOString().split('T')[0]);

    // Reset fecha al abrir el modal
    useEffect(() => {
        if (isOpen) {
            setFechaPago(new Date().toISOString().split('T')[0]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Calcular fecha de vencimiento preview (fecha + 31 días)
    const fechaVencimientoPreview = (() => {
        if (!fechaPago) return '';
        const [year, month, day] = fechaPago.split('-').map(Number);
        const d = new Date(year, month - 1, day);
        d.setDate(d.getDate() + 31);
        return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    })();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fechaPago) return;
        onConfirm(fechaPago);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-green-50/50">
                    <h3 className="text-lg font-heading font-bold text-gray-900 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Registrar Pago
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={isLoading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Info del alumno */}
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700">Alumno</label>
                            <div className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 font-semibold">
                                {alumnoNombre}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700">Disciplina</label>
                            <div className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 font-semibold">
                                {disciplinaNombre}
                            </div>
                        </div>
                    </div>

                    {/* Fecha de pago */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            Fecha del Pago
                        </label>
                        <input
                            type="date"
                            value={fechaPago}
                            onChange={(e) => setFechaPago(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Preview de vencimiento */}
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <span className="font-semibold">Vencimiento:</span> La cuota vencerá el{' '}
                            <span className="font-bold">{fechaVencimientoPreview}</span>{' '}
                            (31 días desde la fecha de pago).
                        </p>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Guardando...' : 'Confirmar Pago'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
