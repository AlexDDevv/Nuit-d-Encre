import { gql } from "@apollo/client";

export const deleteTag = gql`
    mutation deleteTag($id: ID!) {
        deleteTag(id: $id) {
            id
        }
    }
`;
