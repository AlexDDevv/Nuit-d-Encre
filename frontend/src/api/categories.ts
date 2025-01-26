import { gql } from "@apollo/client";

export const queryCategories = gql`
    query Categories {
        categories {
            id
            name
            ads {
                id
                title
                picture
                title
                price
                description
                category {
                    id
                    name
                }
                createdBy {
                    id
                    email
                }
                location
                tags {
                    id
                    name
                }
            }
        }
    }
`;
