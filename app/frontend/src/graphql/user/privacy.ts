import { gql } from "@apollo/client";

export const EXPORT_MY_DATA = gql`
    query ExportMyData {
        exportMyData
    }
`;

export const DELETE_MY_ACCOUNT = gql`
    mutation DeleteMyAccount($password: String) {
        deleteMyAccount(password: $password)
    }
`;
