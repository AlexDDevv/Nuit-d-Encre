import { gql } from "@apollo/client";

export const queryUsers = gql`
    query Users {
        users {
            email
            id
            role
        }
    }
`;
