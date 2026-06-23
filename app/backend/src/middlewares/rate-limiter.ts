import { AppError } from "./error-handler";

/**
 * A fixed-window rate limit rule: at most `limit` hits per `windowMs`.
 */
export interface RateLimitRule {
    limit: number;
    windowMs: number;
}

/**
 * Named rules, keyed by the action they protect. Tuned to slow down
 * brute-force and spam without hurting legitimate use.
 */
export const RATE_LIMIT_RULES = {
    // Brute-force protection on credentials.
    login: { limit: 10, windowMs: 5 * 60 * 1000 },
    // Throttle mass account creation.
    register: { limit: 5, windowMs: 15 * 60 * 1000 },
    // Throttle book import spam (hits external APIs + Cloudinary).
    importBook: { limit: 20, windowMs: 5 * 60 * 1000 },
} as const satisfies Record<string, RateLimitRule>;

export type RateLimitAction = keyof typeof RATE_LIMIT_RULES;

interface WindowEntry {
    count: number;
    resetAt: number;
}

/**
 * In-memory, single-process fixed-window rate limiter.
 *
 * Apollo Server runs via startStandaloneServer (no Express), so we can't
 * plug in an Express middleware - this is called explicitly from resolvers.
 * State lives in this process only; good enough for a single-instance dev
 * and small prod deployment. For a multi-instance setup, back it with Redis.
 */
export class RateLimiter {
    private readonly store = new Map<string, WindowEntry>();

    constructor(private readonly now: () => number = () => Date.now()) {}

    /**
     * Records a hit for `key`. Throws a 429 AppError once the rule's limit
     * is exceeded within the current window.
     */
    consume(key: string, rule: RateLimitRule): void {
        const now = this.now();
        const entry = this.store.get(key);

        if (!entry || entry.resetAt <= now) {
            this.store.set(key, { count: 1, resetAt: now + rule.windowMs });
            return;
        }

        entry.count += 1;

        if (entry.count > rule.limit) {
            const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
            throw new AppError(
                `Trop de tentatives. Réessayez dans ${retryAfter} seconde(s).`,
                429,
                "TooManyRequestsError"
            );
        }
    }

    /**
     * Drops expired windows to keep the map from growing unbounded.
     */
    prune(): void {
        const now = this.now();
        for (const [key, entry] of this.store) {
            if (entry.resetAt <= now) {
                this.store.delete(key);
            }
        }
    }

    /** Test helper: wipes all recorded windows. */
    reset(): void {
        this.store.clear();
    }
}

/** Shared singleton used across resolvers. */
export const rateLimiter = new RateLimiter();

// Periodically evict expired windows. unref() so it never keeps the
// process (or a test runner) alive on its own.
const PRUNE_INTERVAL_MS = 10 * 60 * 1000;
setInterval(() => rateLimiter.prune(), PRUNE_INTERVAL_MS).unref();

/**
 * Enforces the named rule for a given client IP, scoping the counter to
 * the action so different actions don't share a budget.
 */
export function enforceRateLimit(action: RateLimitAction, ip: string): void {
    rateLimiter.consume(`${action}:${ip}`, RATE_LIMIT_RULES[action]);
}
