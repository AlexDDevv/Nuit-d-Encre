import { registerEnumType } from "type-graphql";

export enum BookReviewSortBy {
    RECENT = "RECENT",
    OLDEST = "OLDEST",
    RATING_HIGH = "RATING_HIGH",
    RATING_LOW = "RATING_LOW",
    HELPFUL = "HELPFUL",
}

registerEnumType(BookReviewSortBy, {
    name: "BookReviewSortBy",
    description: "Sort options for book reviews",
});
