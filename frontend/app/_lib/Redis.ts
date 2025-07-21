/**
 * @file      frontend/app/_lib/Redis.ts
 * @desc      Lib: Redis 연결을 위한 ioredis 인스턴스 초기화 설정
 *
 * @author    최준호
 * @update    2025.07.21
 */

import Redis from 'ioredis';

// Redis 인스턴스 생성
const redis = new Redis(process.env.REDIS_URL!);
export default redis;
