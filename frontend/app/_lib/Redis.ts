import Redis from 'ioredis';

// Redis 인스턴스 생성
const redis = new Redis(process.env.REDIS_URL!);
export default redis;
