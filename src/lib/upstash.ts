import { env } from "@/env.mjs";
import { Client, Receiver } from "@upstash/qstash";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = new Redis({
  url: env.UPSTASH_REDIS_URL ?? "",
  token: env.UPSTASH_REDIS_TOKEN ?? "",
});

const usingUpstash = env.UPSTASH_REDIS_URL && env.UPSTASH_REDIS_TOKEN;

export const ratelimit = (
  requests = 10,
  seconds:
    | `${number} ms`
    | `${number} s`
    | `${number} m`
    | `${number} h`
    | `${number} d` = "10 s",
) => {
  return usingUpstash
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(requests, seconds),
        analytics: true,
      })
    : {
        limit: () => ({ success: true }),
      };
};

const receiver = new Receiver({
  currentSigningKey: env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: env.QSTASH_NEXT_SIGNING_KEY,
});

const qstash = new Client({
  token: env.QSTASH_CLIENT_TOKEN,
  //   baseUrl: "https://qstash.upstash.io/v2/publish/"
});

export { receiver, qstash };
