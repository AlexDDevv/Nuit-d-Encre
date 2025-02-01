import { gql } from "@apollo/client";

export const queryCategory = gql`
    query category($categoryId: ID!) {
        category(id: $categoryId) {
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
