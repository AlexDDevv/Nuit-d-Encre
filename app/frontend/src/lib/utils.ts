import { Author, Book, RequiredAuthorFields } from "@/types/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { KeyboardEvent } from "react";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Gestionnaire `onKeyDown` qui déclenche `action` sur Entrée/Espace.
 * Rend activables au clavier les éléments `role="link"` / `role="button"`.
 *
 * @param action - Fonction à exécuter à l'activation.
 * @param stopPropagation - Stoppe la propagation (ex. lien imbriqué dans une carte).
 */
export function activateOnKey(action: () => void, stopPropagation = false) {
    return (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (stopPropagation) e.stopPropagation();
            action();
        }
    };
}

export function buildBookAriaLabel(
    title: string,
    author: { firstname: string; lastname: string },
    category = "Livre",
) {
    const authorName =
        `${author.firstname || ""} ${author.lastname || ""}`.trim();
    return `Voir le livre ${title} par ${authorName} - ${category}`;
}

export function buildAuthorAriaLabel(firstname: string, lastname: string) {
    const authorName = `${firstname} ${lastname}`.trim();
    return `Voir la fiche de l'auteur ${authorName}`;
}

export function slugify(text: string): string {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export const hasIncompleteBookInfo = (book: Book): boolean => {
    if (!book.isImported) return false;

    return (
        book.summary === "Importé depuis une source externe." ||
        book.pageCount === 0 ||
        book.category.name === "Autre" ||
        !book.coverUrl
    );
};

export const hasIncompleteInfo = (author: Author): boolean => {
    const requiredFields: RequiredAuthorFields[] = [
        "birthDate",
        "nationality",
        "wikipediaUrl",
        "biography",
    ];

    return requiredFields.some(
        (field) => !author[field] || author[field] === "",
    );
};

export const getRatingClasses = (rating: number): string => {
    if (rating >= 4) return "border-l-primary hover:border-primary";
    if (rating === 3)
        return "border-l-accent-foreground hover:border-accent-foreground";
    return "border-l-destructive hover:border-destructive";
};
