import { BannerAudience } from "../types/types";
import { isBannerVisibleTo } from "./banner-visibility";

describe("isBannerVisibleTo", () => {
    it("montre une bannière publique à tout le monde", () => {
        expect(isBannerVisibleTo(BannerAudience.ALL, false)).toBe(true);
        expect(isBannerVisibleTo(BannerAudience.ALL, true)).toBe(true);
    });

    it("réserve une bannière « connectés » aux utilisateurs authentifiés", () => {
        expect(isBannerVisibleTo(BannerAudience.AUTHENTICATED, true)).toBe(true);
        expect(isBannerVisibleTo(BannerAudience.AUTHENTICATED, false)).toBe(false);
    });
});
