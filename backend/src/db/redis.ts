import Redis from 'ioredis';
import * as dotenv from 'dotenv';

dotenv.config();

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379');

// Create a client that connects explicitly (lazyConnect: true as we handle startup in index.ts)
const redis = new Redis({
  host: redisHost,
  port: redisPort,
  lazyConnect: true,
});

export default redis;
