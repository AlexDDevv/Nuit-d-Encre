import { gql } from "@apollo/client";

export const GET_BOOK_RECOMMENDATION = gql`
    query BookRecommendation($bookId: ID!) {
        bookRecommendation(bookId: $bookId) {
            id
            user {
                id
                userName
            }
        }
    }
`;

export const TOGGLE_BOOK_RECOMMENDATION = gql`
    mutation ToggleBookRecommendation($data: CreateBookRecommendationInput!) {
        toggleBookRecommendation(data: $data) {
            recommendation {
                id
                user {
                    id
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
        }
    }
`;
