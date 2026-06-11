import { gql } from "@apollo/client";

export const GET_AUTHORS = gql`
    query Authors($filters: AuthorsQueryInput) {
        authors(filters: $filters) {
            allAuthors {
                id
                firstname
                lastname
                isIncomplete
                nationality
                bookCount
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
            biography
            nationality
            wikipediaUrl
            officialWebsite
            books {
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
            }
            user {
                id
            }
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
            biography
            nationality
            wikipediaUrl
            officialWebsite
            user {
                id
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
            biography
            nationality
            wikipediaUrl
            officialWebsite
            user {
                id
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
