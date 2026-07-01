import { Book } from "./book";
import { User } from "./user";

export interface BookReview {
    id: string;
    rating: number;
    reviewText?: string;
    createdAt: string;
    updatedAt: string;
    user: User;
    book: Book;
    helpfulCount?: number;
    notHelpfulCount?: number;
    comments?: BookReviewComment[];
    commentCount?: number;
}

export interface BookReviewsResult {
    reviews: BookReview[];
    totalCount: number;
    page: number;
    limit: number;
}

export type CreateBookReviewInput = {
    bookId: string;
    rating: number;
    reviewText?: string;
};

export type UpdateBookReviewInput = {
    id: string;
    rating?: number;
    reviewText?: string;
};

export enum BookReviewSortBy {
    RECENT = "RECENT",
    OLDEST = "OLDEST",
    RATING_HIGH = "RATING_HIGH",
    RATING_LOW = "RATING_LOW",
    HELPFUL = "HELPFUL",
}

export const SORT_OPTIONS: { value: BookReviewSortBy; label: string }[] = [
    { value: BookReviewSortBy.HELPFUL, label: "Plus utiles" },
    { value: BookReviewSortBy.RECENT, label: "Plus récentes" },
    { value: BookReviewSortBy.OLDEST, label: "Plus anciennes" },
    { value: BookReviewSortBy.RATING_HIGH, label: "Note élevée" },
    { value: BookReviewSortBy.RATING_LOW, label: "Note basse" },
];

export interface BookReviewVote {
    id: string;
    isHelpful: boolean;
    createdAt: string;
    user: User;
    review: BookReview;
}

enum BookReviewVoteAction {
    CREATED = "created",
    UPDATED = "updated",
    REMOVED = "removed",
}

export interface BookReviewVoteResult {
    vote: BookReviewVote | null;
    action: BookReviewVoteAction;
}

export type CreateBookReviewVoteInput = {
    reviewId: string;
    isHelpful: boolean;
};

export type SelectReviewSortProps = {
    value: BookReviewSortBy;
    onChange: (sortBy: BookReviewSortBy) => void;
    disabled?: boolean;
};

export interface BookReviewComment {
    id: string;
    content: string;
    createdAt: string;
    user: User;
}

export type CreateBookReviewCommentInput = {
    reviewId: string;
    content: string;
};
