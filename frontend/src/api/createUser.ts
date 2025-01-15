import { gql } from "@apollo/client";

export const createUser = gql`
    mutation CreateUser($data: createUserInput!) {
        createUser(data: $data) {
            id
        }
    }
`;
