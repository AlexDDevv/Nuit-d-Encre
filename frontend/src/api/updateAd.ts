import { gql } from "@apollo/client";

export const updateAd = gql`
    mutation updateAd($data: updateAdInput!, $id: ID!) {
        updateAd(data: $data, id: $id) {
            id
        }
    }
`;
