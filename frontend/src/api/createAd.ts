import { gql } from "@apollo/client";

export const createAd = gql`
    mutation CreateAd($data: createAdInput!) {
        createAd(data: $data) {
            id
        }
    }
`;
