import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function buildBookAriaLabel(
	title: string,
	author: { firstname: string, lastname: string },
	category = "Livre"
) {
	const authorName = `${author.firstname || ''} ${author.lastname || ''}`.trim();
	return `Voir le livre ${title} par ${authorName} - ${category}`;
}

export function buildAuthorAriaLabel(
	firstname: string,
	lastname: string
) {
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
		.replace(/-+/g, "-");
}
