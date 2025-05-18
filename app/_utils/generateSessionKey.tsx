// lib/toss/encryption.ts
import crypto from "crypto";

/** 32바이트 세션키 생성 후 base64 인코딩 */
export function generateSessionKey(): string {
  const key = crypto.randomBytes(32);
  return key.toString("base64");
}
