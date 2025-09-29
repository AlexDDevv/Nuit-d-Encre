import { UserActionType } from "../types/types";

export const ActionXPMap: Record<UserActionType, number> = {
    [UserActionType.BOOK_ADDED]: 50,
    [UserActionType.AUTHOR_ADDED]: 30,
    [UserActionType.BOOK_ADDED_TO_LIBRARY]: 30,
    [UserActionType.BOOK_FINISHED]: 70,
};