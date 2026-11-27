import { useEffect } from "react";

export const SITE_URL = "https://lomasfight.com";

/** "Jiu-Jitsu Brasileño" -> "jiu-jitsu-brasileno" */
export function slugify(texto: string): string {
    return texto
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "") // saca acentos
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/**
 * URL pública de una disciplina: "/disciplina/2-jiu-jitsu".
 * El número es lo que identifica la disciplina; el nombre es para Google y para quien lee el link,
 * así que si se renombra la disciplina los links viejos siguen funcionando.
 */
export function rutaDisciplina(id: number, nombre: string): string {
    const slug = slugify(nombre);
    return slug ? `/disciplina/${id}-${slug}` : `/disciplina/${id}`;
}

/** Saca el ID numérico del parámetro de la URL ("2-jiu-jitsu" -> 2). null si no empieza con número. */
export function idDesdeParam(param: string | undefined): number | null {
    const m = /^(\d+)(?:-|$)/.exec(param ?? "");
    return m ? Number(m[1]) : null;
}

function setMeta(selector: string, attr: "content" | "href", valor: string) {
    const el = document.head.querySelector(selector);
    if (el) el.setAttribute(attr, valor);
}

interface PageMeta {
    title: string;
    description: string;
    /** Ruta de la página, ej. "/disciplina/2-jiu-jitsu" */
    path: string;
}

/**
 * Título, descripción, canonical y Open Graph por página.
 * El HTML inicial (index.html) trae los de la home; acá se actualizan al navegar
 * y Google usa los valores ya renderizados.
 */
export function usePageMeta(meta: PageMeta | null) {
    const title = meta?.title;
    const description = meta?.description;
    const path = meta?.path;
    useEffect(() => {
        if (!title || !description || path === undefined) return;
        const url = `${SITE_URL}${path}`;
        document.title = title;
        setMeta('meta[name="description"]', "content", description);
        setMeta('link[rel="canonical"]', "href", url);
        setMeta('meta[property="og:title"]', "content", title);
        setMeta('meta[property="og:description"]', "content", description);
        setMeta('meta[property="og:url"]', "content", url);
        setMeta('meta[name="twitter:title"]', "content", title);
        setMeta('meta[name="twitter:description"]', "content", description);
    }, [title, description, path]);
}

/** Valores de la home (los mismos que index.html), para volver a ellos al regresar a "/" */
export const META_HOME: PageMeta = {
    title: "Lomas Fight | Kickboxing, Jiu-Jitsu y MMA en Tucumán — Lomas de Tafí y Tafí Viejo",
    description:
        "Lomas Fight: centro de artes marciales en Lomas de Tafí y Tafí Viejo, Tucumán. Clases de Kickboxing, Jiu-Jitsu y MMA para todos los niveles. ¡Inscribite hoy!",
    path: "/",
};
