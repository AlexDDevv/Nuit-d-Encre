import { gql } from "@apollo/client";

const FEED_FIELDS = `
    id
    type
    metadata
    targetId
    createdAt
    actor {
        id
        userName
        avatar
        level
    }
`;

export const GET_ACTIVITY_FEED = gql`
    query ActivityFeed($limit: Int, $offset: Int) {
        activityFeed(limit: $limit, offset: $offset) {
            ${FEED_FIELDS}
        }
    }
`;

export const GET_GLOBAL_ACTIVITY_FEED = gql`
    query GlobalActivityFeed($limit: Int) {
        globalActivityFeed(limit: $limit) {
            ${FEED_FIELDS}
        }
    }
`;
