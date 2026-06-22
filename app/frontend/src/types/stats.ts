export interface SiteStats {
    users: number;
    books: number;
    reviews: number;
}

export interface SiteStatsQuery {
    siteStats: SiteStats;
}
