import { gql } from "@apollo/client";

export const signOut = gql`
    mutation SignOut {
        signOut
    }
`;
