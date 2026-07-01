import { gql } from "@apollo/client";

export const GET_BOOK_REVIEW = gql`
    query BookReview($id: ID!) {
        bookReview(id: $id) {
            id
            rating
            reviewText
            user {
                id
                userName
            }
        }
    }
`;

export const GET_BOOK_REVIEWS = gql`
    query BookReviews(
        $bookId: ID!
        $page: Int
        $limit: Int
        $sortBy: BookReviewSortBy
    ) {
        bookReviews(
            bookId: $bookId
            page: $page
            limit: $limit
            sortBy: $sortBy
        ) {
            reviews {
                id
                rating
                reviewText
                createdAt
                user {
                    id
                    userName
                }
                helpfulCount
                notHelpfulCount
                commentCount
                comments {
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
            totalCount
            page
            limit
        }
    }
`;

export const GET_MY_BOOK_REVIEW = gql`
    query MyBookReview($bookId: ID!) {
        myBookReview(bookId: $bookId) {
            id
            rating
            reviewText
        }
    }
`;

export const CREATE_BOOK_REVIEW = gql`
    mutation CreateBookReview($data: CreateBookReviewInput!) {
        createBookReview(data: $data) {
            id
            rating
            reviewText
        }
    }
`;

export const UPDATE_BOOK_REVIEW = gql`
    mutation UpdateBookReview($data: UpdateBookReviewInput!) {
        updateBookReview(data: $data) {
            id
            rating
            reviewText
        }
    }
`;

export const DELETE_BOOK_REVIEW = gql`
    mutation DeleteBookReview($id: ID!) {
        deleteBookReview(id: $id) {
            id
        }
    }
`;
