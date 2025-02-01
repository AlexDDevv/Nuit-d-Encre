import { gql } from "@apollo/client";

export const queryUser = gql`
    query User($userId: ID!) {
        user(id: $userId) {
            email
            id
            role
        }
    }
`;
