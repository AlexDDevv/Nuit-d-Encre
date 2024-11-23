import { gql } from "@apollo/client";

export const createCategory = gql`
    mutation Mutation($data: createCategoryInput!) {
        createCategory(data: $data) {
            id
            name
        }
    }
`;
