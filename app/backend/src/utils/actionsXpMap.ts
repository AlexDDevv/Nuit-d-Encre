import { UserActionType } from "../types/types";

export const ActionXPMap: Record<UserActionType, number> = {
    [UserActionType.BOOK_ADDED]: 50,
    [UserActionType.AUTHOR_ADDED]: 30,
    [UserActionType.BOOK_ADDED_TO_LIBRARY]: 30,
    [UserActionType.BOOK_FINISHED]: 70,
    [UserActionType.BOOK_RECOMMENDED]: 50,
    [UserActionType.REVIEW_CREATED]: 100,
    [UserActionType.DETAILED_REVIEW_BONUS]: 50,
    [UserActionType.REVIEW_VOTED_HELPFUL]: 20,
};