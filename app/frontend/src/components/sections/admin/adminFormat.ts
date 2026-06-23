/**
 * Utilitaires de formatage propres au panel admin : dates absolues à la
 * française, dates relatives pour le journal XP et libellé d'une action.
 */

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
});

/** Date absolue, ex. « 3 juin 2025 ». */
export function formatDate(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "-";
    return dateFmt.format(date);
}

/** Date relative compacte, ex. « il y a 3 h », « hier », « à l'instant ». */
export function formatRelative(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "-";

    const diffMs = Date.now() - date.getTime();
    const min = Math.round(diffMs / 60000);
    if (min < 1) return "à l'instant";
    if (min < 60) return `il y a ${min} min`;

    const hours = Math.round(min / 60);
    if (hours < 24) return `il y a ${hours} h`;

    const days = Math.round(hours / 24);
    if (days === 1) return "hier";
    if (days < 7) return `il y a ${days} j`;

    return formatDate(iso);
}

/** Extrait un libellé lisible depuis le `metadata` JSON d'une action XP. */
export function actionLabel(metadata: string | null): string {
    if (!metadata) return "";
    try {
        const data = JSON.parse(metadata);
        if (typeof data === "string") return data;
        if (data.title) return data.title;
        if (data.bookTitle) return data.bookTitle;
        if (data.name) return data.name;
        if (data.firstname || data.lastname)
            return `${data.firstname ?? ""} ${data.lastname ?? ""}`.trim();
        return "";
    } catch {
        return metadata;
    }
}
