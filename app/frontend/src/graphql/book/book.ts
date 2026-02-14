import { gql } from "@apollo/client";

export const GET_BOOKS = gql`
    query Books($filters: BooksQueryInput) {
        books(filters: $filters) {
            allBooks {
                id
                title
                summary
                author {
                    id
                    firstname
                    lastname
                    birthDate
                    biography
                    nationality
                    wikipediaUrl
                    officialWebsite
                }
                category {
                    id
                    name
                }
                isbn10
                isbn13
                pageCount
                publishedYear
                language
                publisher
                format
                user {
                    id
                    email
                    userName
                }
                createdAt
                updatedAt
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
                birthDate
                biography
                nationality
                wikipediaUrl
                officialWebsite
                books {
                    id
                    title
                    summary
                    publishedYear
                    category {
                        id
                        name
                    }
                    format
                    pageCount
                }
            }
            category {
                id
                name
            }
            isbn10
            isbn13
            pageCount
            publishedYear
            language
            publisher
            format
            user {
                id
                email
                userName
            }
            createdAt
            updatedAt
        }
    }
`;

export const CREATE_BOOK = gql`
    mutation CreateBook($data: CreateBookInput!) {
        createBook(data: $data) {
            id
            title
            summary
            author {
                firstname
                lastname
            }
            category {
                id
                name
            }
            isbn10
            isbn13
            pageCount
            publishedYear
            language
            publisher
            format
            user {
                id
                email
                userName
            }
        }
    }
`;

export const UPDATE_BOOK = gql`
    mutation UpdateBook($data: UpdateBookInput!) {
        updateBook(data: $data) {
            id
            title
            summary
            author {
                firstname
                lastname
            }
            category {
                id
                name
            }
            isbn10
            isbn13
            pageCount
            publishedYear
            language
            publisher
            format
            user {
                id
                email
                userName
            }
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
