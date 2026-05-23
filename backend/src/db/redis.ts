import Redis from 'ioredis';
import * as dotenv from 'dotenv';

dotenv.config();

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379');

// Prefer REDIS_URL (cloud deployments) → fall back to host/port (local dev)
const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, { lazyConnect: true })
  : new Redis({ host: redisHost, port: redisPort, lazyConnect: true });

export default redis;
