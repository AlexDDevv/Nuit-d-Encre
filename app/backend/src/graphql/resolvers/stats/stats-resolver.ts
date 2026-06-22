/**
 * @packageDocumentation
 * @category Resolvers
 * @description
 * Public platform statistics, exposed without authentication for the Contact
 * page. Returns aggregate counters only (no personal data).
 */

import { Query, Resolver } from "type-graphql";
import { User } from "../../../database/entities/user/user";
import { Book } from "../../../database/entities/book/book";
import { BookReview } from "../../../database/entities/book/bookReview";
import { SiteStats } from "../../../database/filteredResults/stats/site-stats";

@Resolver()
export class StatsResolver {
    /**
     * Public global counters: registered users, referenced books and written
     * reviews.
     */
    @Query(() => SiteStats)
    async siteStats(): Promise<SiteStats> {
        const [users, books, reviews] = await Promise.all([
            User.count(),
            Book.count(),
            BookReview.count(),
        ]);

        return { users, books, reviews };
    }
}
