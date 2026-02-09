import { gql } from "@apollo/client";

export const GET_USER_BOOKS = gql`
    query UserBooks($filters: UserBooksQueryInput) {
        userBooks(filters: $filters) {
            userBooks {
                id
                user {
                    id
                    email
                    userName
                }
                book {
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
                }
                status
                rating
                review
                recommended
                startedAt
                finishedAt
                isPublic
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

export const GET_USER_BOOK = gql`
    query UserBook($userBookId: ID!) {
        userBook(id: $userBookId) {
            id
            user {
                id
                email
                userName
            }
            book {
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
            }
            status
            rating
            review
            recommended
            startedAt
            finishedAt
            isPublic
            createdAt
            updatedAt
        }
    }
`;

export const CREATE_USER_BOOK = gql`
    mutation CreateUserBook($data: CreateUserBookInput!) {
        createUserBook(data: $data) {
            id
            user {
                id
                email
                userName
            }
            book {
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
            }
            status
            rating
            review
            recommended
            startedAt
            finishedAt
            isPublic
            createdAt
            updatedAt
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
