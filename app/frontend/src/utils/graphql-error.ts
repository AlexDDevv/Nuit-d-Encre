import { ApolloError } from "@apollo/client";

export type ErrorContext =
    | "createBook"
    | "updateBook"
    | "deleteBook"
    | "createAuthor"
    | "updateAuthor"
    | "createReview"
    | "updateReview"
    | "deleteReview"
    | "voteOnReview"
    | "toggleRecommendation"
    | "createUserBook"
    | "updateUserBook"
    | "deleteUserBook";

interface ErrorRule {
    matches: string;
    title: string;
    description: string;
}

interface ErrorResult {
    title: string;
    description: string;
}

const ERROR_MAP: Record<ErrorContext, { rules: ErrorRule[]; fallback: ErrorResult }> = {
    createBook: {
        rules: [
            { matches: "Category not found", title: "Catégorie introuvable", description: "La catégorie sélectionnée n'existe pas." },
            { matches: "Access denied", title: "Connexion requise", description: "Vous devez être connecté pour ajouter un livre." },
        ],
        fallback: { title: "Échec de la création", description: "Impossible d'enregistrer le livre. Veuillez réessayer." },
    },
    updateBook: {
        rules: [
            { matches: "Book not found", title: "Livre introuvable", description: "Ce livre n'existe pas ou a été supprimé." },
            { matches: "Not authorized to delete this book", title: "Action non autorisée", description: "Vous ne pouvez pas modifier ce livre." },
            { matches: "Access denied", title: "Connexion requise", description: "Vous devez être connecté pour modifier un livre." },
            { matches: "Category not found", title: "Catégorie introuvable", description: "La catégorie sélectionnée n'existe pas." },
        ],
        fallback: { title: "Échec de la modification", description: "Impossible de modifier le livre. Veuillez réessayer." },
    },
    deleteBook: {
        rules: [
            { matches: "Book not found", title: "Livre introuvable", description: "Ce livre n'existe pas ou a déjà été supprimé." },
            { matches: "Not authorized to delete this book", title: "Action non autorisée", description: "Vous n'avez pas les droits pour supprimer ce livre." },
            { matches: "Access denied", title: "Connexion requise", description: "Vous devez être connecté pour supprimer un livre." },
        ],
        fallback: { title: "Échec de la suppression", description: "Impossible de supprimer le livre. Veuillez réessayer." },
    },
    createAuthor: {
        rules: [
            { matches: "Access denied", title: "Connexion requise", description: "Vous devez être connecté pour ajouter un auteur." },
        ],
        fallback: { title: "Échec de la création", description: "Impossible d'enregistrer l'auteur. Veuillez réessayer." },
    },
    updateAuthor: {
        rules: [
            { matches: "Author not found", title: "Auteur introuvable", description: "Cet auteur n'existe pas ou a été supprimé." },
            // Note: le backend utilise "delete" même pour l'opération de modification
            { matches: "Not authorized to delete this author", title: "Action non autorisée", description: "Vous ne pouvez pas modifier cet auteur." },
            { matches: "Access denied", title: "Connexion requise", description: "Vous devez être connecté pour modifier un auteur." },
        ],
        fallback: { title: "Échec de la modification", description: "Impossible de modifier l'auteur. Veuillez réessayer." },
    },
    createReview: {
        rules: [
            { matches: "already reviewed this book", title: "Critique déjà publiée", description: "Vous avez déjà écrit une critique pour ce livre. Modifiez-la plutôt." },
            { matches: "Access denied", title: "Connexion requise", description: "Vous devez être connecté pour publier une critique." },
        ],
        fallback: { title: "Échec de la publication", description: "Impossible de publier la critique. Veuillez réessayer." },
    },
    updateReview: {
        rules: [
            { matches: "Review not found", title: "Critique introuvable", description: "Cette critique n'existe pas ou a été supprimée." },
            { matches: "Not authorized to update this review", title: "Action non autorisée", description: "Vous ne pouvez pas modifier cette critique." },
            { matches: "Access denied", title: "Connexion requise", description: "Vous devez être connecté pour modifier une critique." },
        ],
        fallback: { title: "Échec de la modification", description: "Impossible de modifier la critique. Veuillez réessayer." },
    },
    deleteReview: {
        rules: [
            { matches: "Review not found", title: "Critique introuvable", description: "Cette critique n'existe pas ou a déjà été supprimée." },
            { matches: "Not authorized to delete this review", title: "Action non autorisée", description: "Vous ne pouvez pas supprimer cette critique." },
            { matches: "Access denied", title: "Connexion requise", description: "Vous devez être connecté pour supprimer une critique." },
        ],
        fallback: { title: "Échec de la suppression", description: "Impossible de supprimer la critique. Veuillez réessayer." },
    },
    voteOnReview: {
        rules: [
            { matches: "You cannot vote on your own review", title: "Vote non autorisé", description: "Vous ne pouvez pas voter pour votre propre critique." },
            { matches: "Access denied", title: "Connexion requise", description: "Vous devez être connecté pour voter." },
        ],
        fallback: { title: "Échec du vote", description: "Impossible d'enregistrer votre vote. Veuillez réessayer." },
    },
    toggleRecommendation: {
        rules: [
            { matches: "Book not found", title: "Livre introuvable", description: "Ce livre n'existe pas ou a été supprimé." },
            { matches: "Access denied", title: "Connexion requise", description: "Vous devez être connecté pour recommander un livre." },
        ],
        fallback: { title: "Échec de la recommandation", description: "Impossible d'enregistrer votre recommandation. Veuillez réessayer." },
    },
    createUserBook: {
        rules: [
            { matches: "already", title: "Livre déjà ajouté", description: "Ce livre est déjà dans votre bibliothèque." },
            { matches: "Access denied", title: "Connexion requise", description: "Vous devez être connecté pour ajouter un livre à votre bibliothèque." },
        ],
        fallback: { title: "Échec de l'ajout", description: "Impossible d'ajouter ce livre à votre bibliothèque. Veuillez réessayer." },
    },
    updateUserBook: {
        rules: [
            { matches: "Access denied", title: "Action non autorisée", description: "Vous ne pouvez pas modifier cette entrée." },
        ],
        fallback: { title: "Échec de la mise à jour", description: "Impossible de mettre à jour le statut. Veuillez réessayer." },
    },
    deleteUserBook: {
        rules: [
            { matches: "Access denied", title: "Action non autorisée", description: "Vous n'avez pas les droits pour supprimer ce livre." },
        ],
        fallback: { title: "Échec de la suppression", description: "Impossible de supprimer ce livre de votre bibliothèque. Veuillez réessayer." },
    },
};

export function parseGraphQLError(error: unknown, context: ErrorContext): ErrorResult {
    const { rules, fallback } = ERROR_MAP[context];

    if (!(error instanceof ApolloError)) {
        return {
            title: "Erreur de connexion",
            description: "Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.",
        };
    }

    for (const graphQLError of error.graphQLErrors) {
        for (const rule of rules) {
            if (graphQLError.message.includes(rule.matches)) {
                return { title: rule.title, description: rule.description };
            }
        }
    }

    return fallback;
}
