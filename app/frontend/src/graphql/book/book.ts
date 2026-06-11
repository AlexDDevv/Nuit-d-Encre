import { gql } from "@apollo/client";

export const GET_BOOKS = gql`
    query Books($filters: BooksQueryInput) {
        books(filters: $filters) {
            allBooks {
                id
                title
                isImported
                coverUrl
                publishedYear
                format
                category {
                    id
                    name
                }
                averageRating
                reviewCount
                isInLibrary
                author {
                    id
                    firstname
                    lastname
                }
            }
            totalCount
            totalCountAll
            page
            limit
        }
    }
`;

export const GET_BOOK = gql`
    query Book($bookId: ID!) {
        book(id: $bookId) {
            id
            title
            summary
            author {
                id
                firstname
                lastname
                books {
                    id
                    title
                    isImported
                }
            }
            category {
                id
                name
            }
            isbn10
            isbn13
            coverUrl
            isImported
            pageCount
            publishedYear
            language
            publisher
            format
            user {
                id
            }
            averageRating
            recommendationCount
            reviewCount
        }
    }
`;

export const CREATE_BOOK = gql`
    mutation CreateBook($data: CreateBookInput!) {
        createBook(data: $data) {
            id
            title
        }
    }
`;

export const UPDATE_BOOK = gql`
    mutation UpdateBook($data: UpdateBookInput!) {
        updateBook(data: $data) {
            id
            title
        }
    }
`;

export const DELETE_BOOK = gql`
    mutation DeleteBook($bookId: ID!) {
        deleteBook(id: $bookId) {
            id
        }
    }
`;
