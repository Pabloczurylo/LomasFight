import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Disciplina } from '../types';

const getSafeUrl = (url?: string) => {
    if (!url) return '';
    if (!/^https?:\/\//i.test(url) && !url.startsWith('/')) {
        return `http://${url}`;
    }
    return url;
};

interface DisciplinaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (disciplina: Disciplina) => void;
    initialData?: Disciplina | null;
}

const inputClass = "w-full px-4 py-2 border border-gray-200 rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

export default function DisciplinaModal({ isOpen, onClose, onSave, initialData }: DisciplinaModalProps) {
    const [nombre, setNombre]           = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imgBanner, setImgBanner]     = useState('');
    const [imgPreview, setImgPreview]   = useState('');
    const [cuota, setCuota]             = useState<string>('0');
    const [telefono, setTelefono]       = useState('');

    useEffect(() => {
        if (initialData) {
            setNombre(initialData.nombre_disciplina);
            setDescripcion(initialData.descripcion || '');
            setImgBanner(initialData.img_banner || '');
            setImgPreview(initialData.img_preview || '');
            setCuota(initialData.cuota?.toString() || '0');
            setTelefono(initialData.numero_celular || '');
        } else {
            setNombre('');
            setDescripcion('');
            setImgBanner('');
            setImgPreview('');
            setCuota('0');
            setTelefono('');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id_disciplina: initialData?.id_disciplina || 0,
            nombre_disciplina: nombre,
            descripcion,
            img_banner: imgBanner,
            img_preview: imgPreview,
            cuota: parseFloat(cuota) || 0,
            numero_celular: telefono || null,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-heading font-bold text-gray-900 mb-6">
                    {initialData ? 'Editar Disciplina' : 'Nueva Disciplina'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nombre */}
                    <div>
                        <label className={labelClass}>Nombre</label>
                        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
                            className={inputClass} placeholder="Ej: Kickboxing" required />
                    </div>

                    {/* Cuota */}
                    <div>
                        <label className={labelClass}>Cuota Mensual ($)</label>
                        <input type="number" value={cuota} onChange={e => setCuota(e.target.value)}
                            className={inputClass} placeholder="0" min="0" step="0.01" required />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className={labelClass}>Descripción</label>
                        <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)}
                            className={`${inputClass} resize-none h-24`}
                            placeholder="Breve descripción de la disciplina..." required />
                    </div>

                    {/* Número WhatsApp */}
                    <div>
                        <label className={labelClass}>Número WhatsApp (con código de país)</label>
                        <input type="text" value={telefono} onChange={e => setTelefono(e.target.value)}
                            className={inputClass} placeholder="Ej: 5491123456789" />
                        <p className="text-xs text-gray-400 mt-1">Incluir código de país sin + (ej: Argentina → 549...)</p>
                    </div>

                    {/* IMG Banner (hero) */}
                    <div>
                        <label className={labelClass}>URL Imagen Banner <span className="font-normal text-gray-400">(fondo/hero)</span></label>
                        <input type="url" value={imgBanner} onChange={e => setImgBanner(e.target.value)}
                            className={`${inputClass} mb-2`} placeholder="https://..." />
                        {imgBanner && (
                            <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 group">
                                <img src={imgBanner} alt="Banner preview" className="w-full h-full object-cover"
                                    onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x200?text=Error'; }} />
                                <button type="button" onClick={() => setImgBanner('')}
                                    className="absolute top-2 right-2 p-1 bg-white rounded-full text-red-500 shadow opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* IMG Preview (card) */}
                    <div>
                        <label className={labelClass}>URL Imagen Preview <span className="font-normal text-gray-400">(tarjeta y beneficios)</span></label>
                        <input type="url" value={imgPreview} onChange={e => setImgPreview(e.target.value)}
                            className={`${inputClass} mb-2`} placeholder="https://..." />
                        {imgPreview && (
                            <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 group">
                                <img src={imgPreview} alt="Preview" className="w-full h-full object-cover"
                                    onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x200?text=Error'; }} />
                                <button type="button" onClick={() => setImgPreview('')}
                                    className="absolute top-2 right-2 p-1 bg-white rounded-full text-red-500 shadow opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit"
                            className="flex-1 px-4 py-2 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md">
                            {initialData ? 'Guardar Cambios' : 'Crear Disciplina'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
