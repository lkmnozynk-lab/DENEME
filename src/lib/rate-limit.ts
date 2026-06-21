import { createHash } from "crypto";
import { headers } from "next/headers";

/**
 * Rate limiting with two backends:
 *  - Upstash Redis (sliding window) when UPSTASH_REDIS_REST_URL/TOKEN are set —
 *    correct across serverless instances and multiple servers.
 *  - In-memory fixed-window fallback for single-instance/local dev.
 */

type Result = { ok: boolean; remaining: number; retryAfterMs: number };

// ── In-memory fallback ──
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function memoryLimit(key: string, limit: number, windowMs: number): Result {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterMs: 0 };
  }
  if (existing.count >= limit) {
    return { ok: false, remaining: 0, retryAfterMs: existing.resetAt - now };
  }
  existing.count += 1;
  return { ok: true, remaining: limit - existing.count, retryAfterMs: 0 };
}

// ── Upstash backend (lazily constructed, cached per limiter config) ──
const upstashEnabled =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

type Limiter = { limit: (id: string) => Promise<{ success: boolean; remaining: number; reset: number }> };
const limiterCache = new Map<string, Limiter>();

async function getUpstashLimiter(limit: number, windowMs: number): Promise<Limiter> {
  const cacheKey = `${limit}:${windowMs}`;
  const cached = limiterCache.get(cacheKey);
  if (cached) return cached;

  const [{ Ratelimit }, { Redis }] = await Promise.all([
    import("@upstash/ratelimit"),
    import("@upstash/redis"),
  ]);
  const limiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(limit, `${Math.ceil(windowMs / 1000)} s`),
    prefix: "neraajans:rl",
  });
  limiterCache.set(cacheKey, limiter);
  return limiter;
}

export async function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): Promise<Result> {
  if (upstashEnabled) {
    try {
      const limiter = await getUpstashLimiter(limit, windowMs);
      const res = await limiter.limit(key);
      return {
        ok: res.success,
        remaining: res.remaining,
        retryAfterMs: Math.max(0, res.reset - Date.now()),
      };
    } catch (err) {
      console.error("[rate-limit] Upstash failed, falling back to memory:", err);
    }
  }
  return memoryLimit(key, limit, windowMs);
}

/** Best-effort client IP from proxy headers. */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "unknown";
}

/** One-way hash of an IP — store this instead of the raw address. */
export function hashIp(ip: string): string {
  const salt = process.env.AUTH_SECRET ?? "neraajans";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}
