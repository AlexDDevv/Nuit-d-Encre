import type { ErrorContent } from "@/types/types";

/**
 * Catalogue éditorial des erreurs gérées, indexé par code HTTP.
 * Chaque entrée associe un motif littéraire de la bibliothèque nocturne.
 */
const ERROR_CONTENT: Record<string, ErrorContent> = {
    "400": {
        code: "400",
        label: "Requête incorrecte",
        motif: "bookmark",
        ref: "Un marque-page s'est égaré",
        message: "La requête envoyée au serveur n'est pas valide.",
        aria: "Erreur 400 : requête incorrecte.",
    },
    "401": {
        code: "401",
        label: "Non autorisé",
        motif: "lockedTome",
        ref: "Ce grimoire reste sous clé",
        message: "Vous devez être connecté pour accéder à cette ressource.",
        hint: "Présentez-vous au comptoir pour ouvrir le fermoir.",
        aria: "Erreur 401 : non autorisé, connexion requise.",
    },
    "403": {
        code: "403",
        label: "Accès refusé",
        motif: "brokenSeal",
        ref: "Le sceau de cire est rompu",
        message:
            "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
        aria: "Erreur 403 : accès refusé.",
    },
    "404": {
        code: "404",
        label: "Page non trouvée",
        motif: "emptyShelf",
        ref: "Le grand registre · rayon introuvable",
        message: "La page que vous cherchez n'existe pas.",
        aria: "Erreur 404 : page non trouvée.",
    },
    "500": {
        code: "500",
        label: "Erreur serveur",
        motif: "candle",
        ref: "La chandelle de l'atelier s'est éteinte",
        message:
            "Une erreur est survenue sur nos serveurs. Nos équipes ont été notifiées.",
        aria: "Erreur 500 : erreur serveur.",
    },
    default: {
        code: "",
        label: "Erreur inattendue",
        motif: "inkwell",
        ref: "Une tache d'encre sur la page",
        message:
            "Une erreur inattendue s'est produite. Veuillez réessayer plus tard.",
        aria: "Erreur inattendue.",
    },
};

/** Résout le contenu éditorial d'un code HTTP, avec repli sur le cas générique. */
export function getErrorContent(status?: number): ErrorContent {
    return ERROR_CONTENT[String(status)] ?? ERROR_CONTENT.default;
}
