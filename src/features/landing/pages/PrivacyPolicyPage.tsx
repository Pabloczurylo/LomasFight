import { Link } from "react-router-dom";
import { ChevronLeft, ShieldCheck, Eye, FileEdit, Trash2, Lock } from "lucide-react";

const SECTIONS = [
  {
    id: "responsable",
    label: "Responsable",
    title: "Quién responde por tus datos",
    content: (
      <p className="text-gray-400 leading-relaxed">
        <strong className="text-white">Lomas Fight Gym</strong> — Jorge Luis Borges 1200,
        Lomas de Tafí, Tucumán, Argentina. Contacto: <strong className="text-white">+54 9 381 366-5677</strong>.
        Presentate en el gimnasio en horario habitual para cualquier consulta sobre tus datos.
      </p>
    ),
  },
  {
    id: "datos",
    label: "Datos",
    title: "Qué guardamos y para qué",
    content: (
      <div className="space-y-0 divide-y divide-gray-800">
        {[
          { dato: "Nombre y apellido", uso: "Identificarte como alumno o personal", obligatorio: true },
          { dato: "DNI", uso: "Identificación única", obligatorio: false },
          { dato: "Fecha de nacimiento", uso: "Control de edad mínima por disciplina", obligatorio: false },
          { dato: "Grupo sanguíneo", uso: "Emergencias médicas — solo con tu consentimiento", obligatorio: false, alert: true },
          { dato: "Domicilio", uso: "Contacto de emergencia", obligatorio: false },
          { dato: "Email", uso: "Acceso al sistema de gestión (solo personal del club)", obligatorio: false },
          { dato: "Historial de pagos", uso: "Gestión de cuotas y membresías", obligatorio: true },
        ].map(({ dato, uso, obligatorio, alert }) => (
          <div key={dato} className="grid grid-cols-[1fr_2fr_auto] gap-4 py-3 text-sm items-center">
            <span className={alert ? "text-brand-red font-semibold" : "text-white"}>{dato}</span>
            <span className="text-gray-400">{uso}</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${obligatorio ? "bg-gray-800 text-gray-300" : "bg-transparent text-gray-600 border border-gray-800"}`}>
              {obligatorio ? "Requerido" : "Opcional"}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "acceso",
    label: "Acceso",
    title: "Quién puede ver tu información",
    content: (
      <p className="text-gray-400 leading-relaxed">
        Solo el personal administrativo y docente del club con usuario habilitado. El acceso
        requiere autenticación individual con sesión de duración limitada.{" "}
        <strong className="text-white">Nadie externo al club accede a tus datos.</strong>
      </p>
    ),
  },
  {
    id: "conservacion",
    label: "Retención",
    title: "Cuánto tiempo los conservamos",
    content: (
      <p className="text-gray-400 leading-relaxed">
        Mientras seas alumno activo o inactivo del club, y hasta{" "}
        <strong className="text-white">5 años después de la baja definitiva</strong> por
        obligaciones contables. Pasado ese plazo, los datos se eliminan o anonimizan.
      </p>
    ),
  },
  {
    id: "derechos",
    label: "Tus derechos",
    title: "Lo que podés hacer con tus datos",
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { Icon: Eye, title: "Acceso", desc: "Pedinos ver exactamente qué datos tuyos tenemos." },
          { Icon: FileEdit, title: "Rectificación", desc: "Corregimos cualquier dato incorrecto o desactualizado." },
          { Icon: Trash2, title: "Supresión", desc: "Podés pedir que eliminemos todos tus datos." },
          { Icon: Lock, title: "Confidencialidad", desc: "Tus datos nunca se comparten sin tu consentimiento." },
        ].map(({ Icon, title, desc }) => (
          <div key={title} className="flex gap-3 p-4 bg-gray-900 rounded-lg border border-gray-800">
            <div className="mt-0.5 shrink-0">
              <Icon size={16} className="text-brand-red" />
            </div>
            <div>
              <p className="text-white text-sm font-bold mb-0.5">{title}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "seguridad",
    label: "Seguridad",
    title: "Cómo protegemos tu información",
    content: (
      <p className="text-gray-400 leading-relaxed">
        Contraseñas encriptadas con bcrypt, sesiones con expiración automática,
        comunicaciones cifradas por HTTPS y acceso restringido por roles. No es perfecto,
        pero hacemos lo necesario para que tus datos no caigan en las manos equivocadas.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="relative bg-black border-b border-gray-900 overflow-hidden">
        {/* Diagonal accent */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-20 top-0 w-64 h-full bg-brand-red opacity-[0.06] transform skew-x-[-12deg]" />
        </div>

        <div className="container mx-auto px-4 max-w-4xl py-12 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-gray-600 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest mb-8"
          >
            <ChevronLeft size={14} />
            Volver al inicio
          </Link>

          <div className="flex items-start gap-4">
            <div className="mt-1 p-2 border border-brand-red/40 rounded">
              <ShieldCheck size={20} className="text-brand-red" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-red mb-2">
                Ley 25.326 — Argentina
              </p>
              <h1 className="text-4xl font-heading font-black uppercase tracking-tight leading-none">
                Política de<br />
                <span className="text-brand-red">Privacidad</span>
              </h1>
              <p className="text-gray-600 text-xs font-mono mt-3">
                Última actualización:{" "}
                {new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Intro strip */}
      <div className="border-b border-gray-900 bg-gray-950">
        <div className="container mx-auto px-4 max-w-4xl py-6">
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
            En Lomas Fight recopilamos datos personales para gestionar membresías y mantener
            el club funcionando. Esta página explica qué guardamos, por qué, y qué derechos
            tenés sobre esa información según la legislación argentina vigente.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <div className="space-y-0 divide-y divide-gray-900">
          {SECTIONS.map((section, i) => (
            <div key={section.id} className="py-10 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
              {/* Left: label */}
              <div className="flex md:flex-col gap-3 items-start">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gray-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-red">
                  {section.label}
                </span>
                <h2 className="hidden md:block text-sm font-bold text-white mt-2 leading-snug">
                  {section.title}
                </h2>
              </div>

              {/* Right: content */}
              <div>
                <h2 className="md:hidden text-base font-bold text-white mb-4">{section.title}</h2>
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* AAIP */}
        <div className="mt-10 pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-gray-600 max-w-sm leading-relaxed">
            Si considerás que tus derechos no fueron respetados, podés contactar a la{" "}
            <a
              href="https://www.argentina.gob.ar/aaip"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-red hover:underline"
            >
              Agencia de Acceso a la Información Pública (AAIP)
            </a>
            , el organismo de control en materia de datos personales en Argentina.
          </p>
          <Link
            to="/"
            className="shrink-0 inline-flex items-center gap-2 bg-brand-red text-white font-heading font-bold text-xs uppercase tracking-widest px-5 py-2.5 hover:bg-red-700 transition-colors"
          >
            <ChevronLeft size={14} />
            Volver
          </Link>
        </div>
      </div>
    </div>
  );
}
