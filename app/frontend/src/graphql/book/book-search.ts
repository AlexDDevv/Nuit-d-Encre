import { gql } from "@apollo/client";

export const SEARCH_BOOKS = gql`
    query SearchBooks($query: String!) {
        searchBooks(query: $query) {
            id
            title
            author
            isbn13
            year
            publisher
            language
            coverUrl
            isInDatabase
            source
        }
    }
`;

export const PREVIEW_BOOK = gql`
    query PreviewBook($isbn13: String!) {
        previewBook(isbn13: $isbn13) {
            id
            title
            author
            isbn13
            year
            publisher
            language
            coverUrl
            isInDatabase
            source
        }
    }
`;

export const IMPORT_BOOK = gql`
    mutation ImportBook($isbn13: String!) {
        importBook(isbn13: $isbn13) {
            id
            title
        }
    }
`;
