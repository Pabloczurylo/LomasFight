import React from 'react';
import { cn } from '../../lib/utils';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    type: 'danger' | 'success';
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, type }: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 text-center animate-in fade-in zoom-in duration-200">
                <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">
                    {title}
                </h3>
                <p className="text-gray-900 mb-6 font-medium">
                    {message}
                </p>

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className={cn(
                            "flex-1 px-4 py-2 text-white font-bold rounded-lg transition-colors shadow-md",
                            type === 'danger'
                                ? "bg-brand-red hover:bg-red-700"
                                : "bg-black hover:bg-brand-red"
                        )}
                    >
                        {type === 'danger' ? 'Eliminar' : 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
