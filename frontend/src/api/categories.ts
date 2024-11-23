import { gql } from "@apollo/client";

export const queryCategories = gql`
    query Categories {
        categories {
            id
            name
        }
    }
`;
