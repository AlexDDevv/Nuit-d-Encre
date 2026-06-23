import { gql } from "@apollo/client";

/** Compteurs globaux de la barre d'analytics. */
export const ADMIN_STATS = gql`
    query AdminStats {
        adminStats {
            users
            books
            authors
            reviews
            categories
        }
    }
`;

/** Activité récente du dashboard (inscriptions, livres, critiques, journal XP). */
export const ADMIN_RECENT_ACTIVITY = gql`
    query AdminRecentActivity {
        adminRecentActivity {
            recentUsers {
                id
                userName
                email
                avatar
                role
                createdAt
            }
            recentBooks {
                id
                title
                createdAt
                author {
                    id
                    firstname
                    lastname
                }
                category {
                    id
                    name
                }
            }
            recentReviews {
                id
                rating
                reviewText
                createdAt
                user {
                    id
                    userName
                    avatar
                }
                book {
                    id
                    title
                }
            }
            recentActions {
                id
                type
                xp
                metadata
                targetId
                createdAt
                userId
                userName
            }
        }
    }
`;

/** Tous les utilisateurs (onglet Utilisateurs). */
export const ADMIN_USERS = gql`
    query AdminUsers {
        getUsers {
            id
            userName
            email
            role
            level
            xp
            avatar
            createdAt
        }
    }
`;

/** Tous les livres (onglet Livres) - pagination/recherche côté client. */
export const ADMIN_BOOKS = gql`
    query AdminBooks {
        books(filters: { limit: 1000 }) {
            allBooks {
                id
                title
                isbn13
                format
                createdAt
                author {
                    id
                    firstname
                    lastname
                }
                category {
                    id
                    name
                }
                user {
                    id
                    userName
                }
            }
            totalCountAll
        }
    }
`;

/** Tous les auteurs (onglet Auteurs). */
export const ADMIN_AUTHORS = gql`
    query AdminAuthors {
        authors(filters: { limit: 1000 }) {
            allAuthors {
                id
                firstname
                lastname
                nationality
                createdAt
                books {
                    id
                }
                user {
                    id
                    userName
                }
            }
            totalCountAll
        }
    }
`;

/** Toutes les catégories avec compteur de livres et auteur (onglet Catégories). */
export const ADMIN_CATEGORIES = gql`
    query AdminCategories {
        categories {
            id
            name
            createdAt
            createdBy {
                id
                userName
            }
            books {
                id
            }
        }
    }
`;

/** Toutes les critiques (onglet Critiques). */
export const ADMIN_REVIEWS = gql`
    query AdminReviews {
        adminReviews {
            id
            rating
            reviewText
            createdAt
            user {
                id
                userName
                avatar
            }
            book {
                id
                title
                author {
                    id
                    firstname
                    lastname
                }
            }
        }
    }
`;

/** Suppression d'un compte utilisateur. */
export const DELETE_USER = gql`
    mutation DeleteUser($id: ID!) {
        deleteUser(id: $id)
    }
`;

/** Création d'une catégorie (onglet Catégories). */
export const ADMIN_CREATE_CATEGORY = gql`
    mutation AdminCreateCategory($data: CreateCategoryInput!) {
        createCategory(data: $data) {
            id
            name
        }
    }
`;

/** Renommage d'une catégorie. L'id et les données sont des arguments distincts. */
export const ADMIN_UPDATE_CATEGORY = gql`
    mutation AdminUpdateCategory($id: ID!, $data: UpdateCategoryInput!) {
        updateCategory(id: $id, data: $data) {
            id
            name
        }
    }
`;

/** Suppression d'une catégorie. */
export const ADMIN_DELETE_CATEGORY = gql`
    mutation AdminDeleteCategory($id: ID!) {
        deleteCategory(id: $id) {
            id
        }
    }
`;
