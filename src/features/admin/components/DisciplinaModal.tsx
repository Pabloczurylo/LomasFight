import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Beneficio, Disciplina, MAX_BENEFICIOS } from '../types';

interface DisciplinaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (disciplina: Disciplina) => void;
    initialData?: Disciplina | null;
}

const inputClass = "w-full px-4 py-2 border border-gray-200 rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

export default function DisciplinaModal({ isOpen, onClose, onSave, initialData }: DisciplinaModalProps) {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imgBanner, setImgBanner] = useState('');
    const [imgPreview, setImgPreview] = useState('');
    const [cuota, setCuota] = useState<string>('0');
    const [telefono, setTelefono] = useState('');
    const [beneficios, setBeneficios] = useState<Beneficio[]>([]);

    useEffect(() => {
        if (initialData) {
            setNombre(initialData.nombre_disciplina);
            setDescripcion(initialData.descripcion || '');
            setImgBanner(initialData.img_banner || '');
            setImgPreview(initialData.img_preview || '');
            setCuota(initialData.cuota?.toString() || '0');
            setTelefono(initialData.numero_celular || '');
            setBeneficios(Array.isArray(initialData.beneficios) ? initialData.beneficios : []);
        } else {
            setNombre('');
            setDescripcion('');
            setImgBanner('');
            setImgPreview('');
            setCuota('0');
            setTelefono('');
            setBeneficios([]);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const actualizarBeneficio = (idx: number, campo: keyof Beneficio, valor: string) =>
        setBeneficios(prev => prev.map((b, i) => (i === idx ? { ...b, [campo]: valor } : b)));
    const agregarBeneficio = () =>
        setBeneficios(prev => (prev.length < MAX_BENEFICIOS ? [...prev, { titulo: '', descripcion: '' }] : prev));
    const quitarBeneficio = (idx: number) =>
        setBeneficios(prev => prev.filter((_, i) => i !== idx));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id_disciplina: initialData?.id_disciplina || 0,
            nombre_disciplina: nombre.trim(),
            descripcion,
            img_banner: imgBanner,
            img_preview: imgPreview,
            cuota: parseFloat(cuota) || 0,
            numero_celular: telefono || null,
            // Solo los que tienen título; vacío = se usan los genéricos en la página pública
            beneficios: beneficios
                .map(b => ({ titulo: b.titulo.trim(), descripcion: b.descripcion.trim() }))
                .filter(b => b.titulo),
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

                    {/* Beneficios ("Por qué elegir ...") */}
                    <div>
                        <label className={labelClass}>
                            Beneficios <span className="font-normal text-gray-400">(sección "Por qué elegir {nombre.trim() || '...'}")</span>
                        </label>
                        <p className="text-xs text-gray-400 mb-2">
                            Si no cargás ninguno, se muestran los beneficios genéricos. Máximo {MAX_BENEFICIOS}.
                        </p>
                        <div className="space-y-3">
                            {beneficios.map((b, idx) => (
                                <div key={idx} className="relative rounded-lg border border-gray-200 p-3 pr-10 space-y-2 bg-gray-50/50">
                                    <input type="text" value={b.titulo} maxLength={80}
                                        onChange={e => actualizarBeneficio(idx, 'titulo', e.target.value)}
                                        className={inputClass} placeholder="Título (ej: Defensa personal)" />
                                    <textarea value={b.descripcion} maxLength={300}
                                        onChange={e => actualizarBeneficio(idx, 'descripcion', e.target.value)}
                                        className={`${inputClass} resize-none h-16`}
                                        placeholder="Descripción breve del beneficio..." />
                                    <button type="button" onClick={() => quitarBeneficio(idx)}
                                        aria-label={`Quitar beneficio ${idx + 1}`}
                                        className="absolute top-3 right-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {beneficios.length < MAX_BENEFICIOS && (
                            <button type="button" onClick={agregarBeneficio}
                                className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-brand-red hover:text-red-700 transition-colors">
                                <Plus className="w-4 h-4" /> Agregar beneficio
                            </button>
                        )}
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
