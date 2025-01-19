import { gql } from "@apollo/client";

export const queryTag = gql`
    query Tag($tagId: ID!) {
        tag(id: $tagId) {
            name
            id
            createdAt
            createdBy {
                id
                email
            }
        }
    }
`;
