import { gql } from "@apollo/client";

export const GET_BOOK_REVIEW = gql`
    query BookReview($id: ID!) {
        bookReview(id: $id) {
            id
            rating
            reviewText
            createdAt
            updatedAt
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
            helpfulCount
            notHelpfulCount
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
                updatedAt
                user {
                    id
                    userName
                    email
                }
                helpfulCount
                notHelpfulCount
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
            createdAt
            updatedAt
            user {
                id
                userName
                email
            }
            book {
                id
                title
            }
        }
    }
`;

export const CREATE_BOOK_REVIEW = gql`
    mutation CreateBookReview($data: CreateBookReviewInput!) {
        createBookReview(data: $data) {
            id
            rating
            reviewText
            createdAt
            updatedAt
            user {
                id
                userName
                email
            }
            book {
                id
                title
            }
            helpfulCount
            notHelpfulCount
        }
    }
`;

export const UPDATE_BOOK_REVIEW = gql`
    mutation UpdateBookReview($data: UpdateBookReviewInput!) {
        updateBookReview(data: $data) {
            id
            rating
            reviewText
            createdAt
            updatedAt
            user {
                id
                userName
                email
            }
            book {
                id
                title
            }
            helpfulCount
            notHelpfulCount
        }
    }
`;

export const DELETE_BOOK_REVIEW = gql`
    mutation DeleteBookReview($id: ID!) {
        deleteBookReview(id: $id) {
            id
            book {
                id
                title
            }
        }
    }
`;
