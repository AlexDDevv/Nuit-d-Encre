import { gql } from "@apollo/client";

export const updateTag = gql`
    mutation updateTag($data: updateTagInput!, $id: ID!) {
        updateTag(data: $data, id: $id) {
            id
        }
    }
`;
