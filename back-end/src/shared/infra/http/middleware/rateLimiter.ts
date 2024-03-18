import 'dotenv/config'
import { AppError } from "@shared/error/AppError";
import { Request, Response, NextFunction } from "express";
import {  RateLimiterRedis } from 'rate-limiter-flexible'
import {createClient} from 'redis'

const redisClient = createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
})

const opts = {
  storeClient: redisClient,
  keyPrefix: 'rateLimit',
  points: 10,
  duration: 1,
};

const limiter = new RateLimiterRedis(opts);

export default async function rateLimiter(request: Request, response: Response, next: NextFunction) { 
  try {
    await limiter.consume(request.ip);
    return next();
  } catch (err) {
    throw new AppError('Too many request', 429);
  }
}