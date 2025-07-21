/**
 * @file      frontend/app/_config/s3Client.ts
 * @desc      Config: R2(S3 호환) 스토리지 클라이언트 초기화 설정
 *
 * @author    최준호
 * @update    2025.07.21
 */

import { S3Client } from '@aws-sdk/client-s3';

// S3 클라이언트 설정을 초기화하여 내보냄
export const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});
