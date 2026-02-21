import { gql } from "@apollo/client";

export const GET_BOOK_RECOMMENDATION = gql`
    query BookRecommendation($bookId: ID!) {
        bookRecommendation(bookId: $bookId) {
            id
            createdAt
            user {
                id
                userName
                email
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

export const TOGGLE_BOOK_RECOMMENDATION = gql`
    mutation ToggleBookRecommendation($data: CreateBookRecommendationInput!) {
        toggleBookRecommendation(data: $data) {
            recommendation {
                id
                createdAt
                user {
                    id
                    userName
                    email
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
            action
        }
    }
`;

export const DELETE_BOOK_RECOMMENDATION = gql`
    mutation DeleteBookRecommendation($bookId: ID!) {
        deleteBookRecommendation(bookId: $bookId) {
            id
            book {
                id
                title
            }
        }
    }
`;
