import { gql } from "@apollo/client";

export const createTag = gql`
    mutation Mutation($data: createTagInput!) {
        createTag(data: $data) {
            id
            name
        }
    }
`;
