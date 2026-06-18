import { Field, ObjectType } from "type-graphql";
import { User } from "../../entities/user/user";
import { Book } from "../../entities/book/book";
import { BookReview } from "../../entities/book/bookReview";
import { AdminActivityItem } from "./admin-activity-item";

/**
 * AdminRecentActivity
 * @description
 * Agrégat alimentant le dashboard admin : derniers inscrits, derniers livres,
 * dernières critiques et journal des dernières actions XP.
 */
@ObjectType()
export class AdminRecentActivity {
    @Field(() => [User])
    recentUsers!: User[];

    @Field(() => [Book])
    recentBooks!: Book[];

    @Field(() => [BookReview])
    recentReviews!: BookReview[];

    @Field(() => [AdminActivityItem])
    recentActions!: AdminActivityItem[];
}
