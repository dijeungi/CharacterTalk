// lib/toss/encryption.ts

import crypto from "crypto";

// Toss 요구 포맷에 맞춰 AES-256-CBC 방식으로 암호화
export function encryptWithSessionKey(
  plainText: string,
  sessionKeyBase64: string
): string {
  const sessionKey = Buffer.from(sessionKeyBase64, "base64");

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", sessionKey, iv);

  let encrypted = cipher.update(plainText, "utf8", "base64");
  encrypted += cipher.final("base64");

  const ivBase64 = iv.toString("base64");
  const encryptedData = `v1$${ivBase64}$${encrypted}`;
  return encryptedData;
}
