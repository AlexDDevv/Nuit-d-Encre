import { gql } from "@apollo/client";

export const REGISTER = gql`
    mutation Register($data: CreateUserInput!) {
        register(data: $data) {
            id
            email
        }
    }
`;

export const LOGIN = gql`
    mutation Login($data: LogUserInput!) {
        login(data: $data) {
            message
            cookieSet
        }
    }
`;

export const WHOAMI = gql`
    query Whoami {
        whoami {
            id
            email
            userName
            role
            level
            xp
            avatar
            banner
            bio
            createdAt
            title {
                id
                label
                minLevel
                iconKey
                ornamentKey
            }
        }
    }
`;

export const LOGOUT = gql`
    mutation Mutation {
        logout
    }
`;
