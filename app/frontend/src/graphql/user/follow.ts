import { gql } from "@apollo/client";

export const FOLLOW_USER = gql`
    mutation FollowUser($userId: ID!) {
        followUser(userId: $userId)
    }
`;

export const UNFOLLOW_USER = gql`
    mutation UnfollowUser($userId: ID!) {
        unfollowUser(userId: $userId)
    }
`;

export const GET_FOLLOWERS = gql`
    query Followers($userId: ID!) {
        followers(userId: $userId) {
            id
            userName
            avatar
            level
        }
    }
`;

export const GET_FOLLOWING = gql`
    query Following($userId: ID!) {
        following(userId: $userId) {
            id
            userName
            avatar
            level
        }
    }
`;
