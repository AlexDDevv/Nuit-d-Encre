import { gql } from "@apollo/client";

export const whoami = gql`
    query Whoami {
        whoami {
            email
            id
            role
        }
    }
`;
