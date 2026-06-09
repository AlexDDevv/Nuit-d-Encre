import { AppError } from "./error-handler";
import { RateLimiter } from "./rate-limiter";

describe("RateLimiter", () => {
    const rule = { limit: 3, windowMs: 1000 };

    it("allows hits up to the limit", () => {
        const limiter = new RateLimiter(() => 0);
        expect(() => {
            limiter.consume("k", rule);
            limiter.consume("k", rule);
            limiter.consume("k", rule);
        }).not.toThrow();
    });

    it("throws a 429 AppError once the limit is exceeded", () => {
        const limiter = new RateLimiter(() => 0);
        limiter.consume("k", rule);
        limiter.consume("k", rule);
        limiter.consume("k", rule);

        try {
            limiter.consume("k", rule);
            fail("expected a rate-limit error");
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect((error as AppError).statusCode).toBe(429);
            expect((error as AppError).errorType).toBe("TooManyRequestsError");
        }
    });

    it("resets the window once it expires", () => {
        let now = 0;
        const limiter = new RateLimiter(() => now);
        limiter.consume("k", rule);
        limiter.consume("k", rule);
        limiter.consume("k", rule);

        // Window elapsed → counter restarts, no throw.
        now = 1001;
        expect(() => limiter.consume("k", rule)).not.toThrow();
    });

    it("scopes counters per key", () => {
        const limiter = new RateLimiter(() => 0);
        limiter.consume("a", rule);
        limiter.consume("a", rule);
        limiter.consume("a", rule);

        // A different key has its own budget.
        expect(() => limiter.consume("b", rule)).not.toThrow();
    });

    it("drops expired windows on prune", () => {
        let now = 0;
        const limiter = new RateLimiter(() => now);
        limiter.consume("k", rule);
        now = 1001;
        limiter.prune();

        // After pruning, the key starts fresh and can be consumed fully again.
        expect(() => {
            limiter.consume("k", rule);
            limiter.consume("k", rule);
            limiter.consume("k", rule);
        }).not.toThrow();
    });
});
