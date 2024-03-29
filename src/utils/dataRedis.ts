import { RateLimiterRedis } from "rate-limiter-flexible";
import RedisClient from "@redis/client/dist/lib/client";
import { Redis } from "ioredis";
import "dotenv/config"

const maxConsecutiveFailsByUserName = 5;
const maxWrongAttemptsByIPperDay = 100;
const maxConsecutiveFailsByUserNameAndIP = 10;

const redisClient = new Redis({
    host: process.env.HOST_REDIS,
    port: Number(process.env.PORT_REDIS),
    password: process.env.PASSWORD_REDIS,
});

const limiterConsecutiveFailsByUsername = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "login_fail_consecutive_username",
    points: maxConsecutiveFailsByUserName,
    duration: 60, // Store number for 60 seconds since first fail
    blockDuration: 60 * 2, // Block for 2 minutes
});

const limiterSlowBruteByIP = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "login_fail_ip_per_day",
    points: maxWrongAttemptsByIPperDay,
    duration: 60 * 60 * 24, // 60 * 60 * 24,
    blockDuration: 60 * 60 * 24, //60 * 60 * 24, Block for 1 day, if 100 wrong attempts per day
});


const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "login_fail_ip_per_day",
    points: maxConsecutiveFailsByUserNameAndIP,
    duration: 60 , // 60 * 60 * 24 * 90 Store number for 90 days since first fail
    blockDuration: 60 * 60, // 60* 60 Block for 1 hour
});

const getUsernameIPkey = (username: string, ip: string) => `${username}_${ip}`;

export {
    limiterConsecutiveFailsByUsername,
    maxConsecutiveFailsByUserName,
    redisClient,
    limiterSlowBruteByIP,
    maxConsecutiveFailsByUserNameAndIP,
    maxWrongAttemptsByIPperDay,
    limiterConsecutiveFailsByUsernameAndIP,
    getUsernameIPkey,
};
