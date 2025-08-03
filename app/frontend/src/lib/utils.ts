import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function buildAriaLabel(
	title: string,
	author: { firstname: string, lastname: string },
	category = "Livre"
) {
	const authorName = `${author.firstname || ''} ${author.lastname || ''}`.trim();
	return `Voir le livre ${title} par ${authorName} - ${category}`;
}