import { gql } from "@apollo/client";

export const GET_USER_BOOKS = gql`
    query UserBooks($filters: UserBooksQueryInput) {
        userBooks(filters: $filters) {
            userBooks {
                id
                isFavorite
                favoriteRank
                book {
                    id
                    title
                    coverUrl
                    author {
                        id
                        firstname
                        lastname
                    }
                    category {
                        id
                        name
                    }
                    pageCount
                    publishedYear
                    publisher
                    averageRating
                    recommendationCount
                    reviewCount
                }
                status
            }
            totalCount
            page
            limit
        }
    }
`;

export const GET_USER_BOOK = gql`
    query UserBook($userBookId: ID!) {
        userBook(id: $userBookId) {
            id
            book {
                id
                title
                author {
                    id
                    firstname
                    lastname
                }
                category {
                    id
                    name
                }
                pageCount
                publishedYear
                publisher
                averageRating
                recommendationCount
                reviewCount
            }
            status
        }
    }
`;

export const CREATE_USER_BOOK = gql`
    mutation CreateUserBook($data: CreateUserBookInput!) {
        createUserBook(data: $data) {
            id
            book {
                id
                title
            }
            status
        }
    }
`;

export const UPDATE_USER_BOOK = gql`
    mutation UpdateUserBook($data: UpdateUserBookInput!) {
        updateUserBook(data: $data) {
            id
            book {
                id
                title
            }
            status
        }
    }
`;

export const DELETE_USER_BOOK = gql`
    mutation DeleteUserBook($userBookId: ID!) {
        deleteUserBook(id: $userBookId) {
            id
        }
    }
`;
