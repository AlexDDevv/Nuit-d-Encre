import { gql } from "@apollo/client";

export const updateCategory = gql`
    mutation updateCategory($data: updateCategoryInput!, $id: ID!) {
        updateCategory(data: $data, id: $id) {
            id
        }
    }
`;
