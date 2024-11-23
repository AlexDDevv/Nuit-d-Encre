import { gql } from "@apollo/client";

export const updateAd = gql`
    mutation updateAd($data: updtateAdInput!, $id: ID!) {
        updateAd(data: $data, id: $id) {
            id
        }
    }
`;
