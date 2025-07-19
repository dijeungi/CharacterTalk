/**
 * @file      frontend/app/_apis/config.ts
 * @desc      Config: Next.js와 Python 서버의 공개 API 호스트 환경변수 정의
 *
 * @author    최준호
 * @update    2025.07.19
 */

export const NEXT_API_HOST = process.env.NEXT_PUBLIC_NEXT_API_URL!;
export const PYTHON_API_HOST = process.env.NEXT_PUBLIC_PYTHON_API_URL!;
