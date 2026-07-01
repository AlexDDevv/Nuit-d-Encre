import { gql } from "@apollo/client";

export const CREATE_BOOK_REVIEW_COMMENT = gql`
    mutation CreateBookReviewComment($data: CreateBookReviewCommentInput!) {
        createBookReviewComment(data: $data) {
            id
            content
            createdAt
            user {
                id
                userName
                avatar
            }
        }
    }
`;

export const DELETE_BOOK_REVIEW_COMMENT = gql`
    mutation DeleteBookReviewComment($id: ID!) {
        deleteBookReviewComment(id: $id)
    }
`;
