import { gql } from "@apollo/client";

export const GET_AUTHORS = gql`
    query Authors($filters: AllAuthorsQueryInput) {
        authors(filters: $filters) {
            allAuthors {
                id
                firstname
                lastname
                birthDate
                nationality
                wikipediaUrl
                officialWebsite
                books {
                    id
                    title
                    summary
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

export const GET_AUTHOR = gql`
    query Author($authorId: ID!) {
        author(id: $authorId) {
            id
            firstname
            lastname
            birthDate
            nationality
            wikipediaUrl
            officialWebsite
            books {
                id
                title
                summary
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

export const GET_MY_AUTHORS = gql`
    query MyAuthors($filters: MyAuthorsQueryInput) {
        myAuthors(filters: $filters) {
            authors {
                id
                firstname
                lastname
                birthDate
                nationality
                wikipediaUrl
                officialWebsite
                books {
                    id
                    title
                    summary
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

export const CREATE_AUTHOR = gql`
    mutation CreateAuthor($data: CreateAuthorInput!) {
        createAuthor(data: $data) {
            id
            firstname
            lastname
            birthDate
            nationality
            wikipediaUrl
            officialWebsite
            user {
                id
                email
                userName
            }
        }
    }
`;

export const UPDATE_AUTHOR = gql`
    mutation UpdateAuthor($data: UpdateAuthorInput!) {
        updateAuthor(data: $data) {
            id
            firstname
            lastname
            birthDate
            nationality
            wikipediaUrl
            officialWebsite
            user {
                id
                email
                userName
            }
        }
    }
`;

export const DELETE_AUTHOR = gql`
    mutation DeleteAuthor($authorId: ID!) {
        deleteAuthor(id: $authorId) {
            id
        }
    }
`;
