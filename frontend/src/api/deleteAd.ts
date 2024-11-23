import { gql } from "@apollo/client";

export const deleteAd = gql`
    mutation deleteAd($id: ID!) {
        deleteAd(id: $id) {
            id
        }
    }
`;
