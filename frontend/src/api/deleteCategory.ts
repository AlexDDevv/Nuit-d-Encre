import { gql } from "@apollo/client";

export const deleteCategory = gql`
    mutation deleteCategory($id: ID!) {
        deleteCategory(id: $id) {
            id
        }
    }
`;
