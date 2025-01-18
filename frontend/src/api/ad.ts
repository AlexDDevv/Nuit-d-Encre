import { gql } from "@apollo/client";

export const queryAd = gql`
    query Ad($adId: ID!) {
        ad(id: $adId) {
            id
            title
            price
            picture
            owner
            location
            description
            createdBy
            createdAt
            category {
                id
                name
            }
            tags {
                id
                name
            }
        }
    }
`;
