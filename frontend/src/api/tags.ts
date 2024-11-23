import { gql } from "@apollo/client";

export const queryTags = gql`
    query Tags {
        tags {
            id
            name
        }
    }
`;
