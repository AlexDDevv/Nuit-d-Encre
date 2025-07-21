import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
    query Categories {
        categories {
            id
            name
        }
    }
`;

export const GET_CATEGORY = gql`
    query Category($categoryId: ID!) {
        category(id: $categoryId) {
            id
            name
        }
    }
`;

export const CREATE_CATEGORY = gql`
    mutation CreateCategory($data: CreateCategoryInput!) {
        createCategory(data: $data) {
            id
            name
        }
    }
`;

export const UPDATE_CATEGORY = gql`
    mutation UpdateSurvey($data: UpdateCategoryInput!) {
        updateCategory(data: $data) {
            name
        }
    }
`;

export const DELETE_CATEGORY = gql`
    mutation DeleteCategory($categoryId: ID!) {
        deleteCategory(id: $categoryId) {
            id
        }
    }
`;
