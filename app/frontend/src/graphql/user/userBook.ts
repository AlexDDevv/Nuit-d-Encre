import { gql } from "@apollo/client";

export const GET_USER_BOOKS = gql`
    query UserBooks($filters: UserBooksQueryInput) {
        userBooks(filters: $filters) {
            userBooks {
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
                }
                status
                rating
                recommended
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
            }
            status
            rating
            recommended
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
            rating
            recommended
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
            rating
            recommended
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
