import { gql } from "@apollo/client";

export const createCategory = gql`
    mutation Mutation($data: updateCategoryInput!) {
        createCategory(data: $data) {
            id
            name
        }
    }
`;
