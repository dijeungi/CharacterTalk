// tossCrypto.ts
import crypto from "crypto";

export const tossCrypto = {
  generateRandomBytes(length: number) {
    return crypto.randomBytes(length).toString("base64");
  },

  generateSessionKey(
    sessionId: string,
    secretKey: string,
    iv: string,
    base64PublicKey: string
  ) {
    const sessionAesKey = `AES_GCM$${secretKey}$${iv}`;
    const encryptedSessionAesKey = this.encryptSessionAesKey(
      base64PublicKey,
      sessionAesKey
    );
    return `v1$${sessionId}$${encryptedSessionAesKey}`;
  },

  encryptSessionAesKey(base64PublicKey: string, sessionAesKey: string) {
    const publicKey = `-----BEGIN PUBLIC KEY-----\n${base64PublicKey}\n-----END PUBLIC KEY-----`;

    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      Buffer.from(sessionAesKey, "utf-8")
    );

    return encrypted.toString("base64");
  },

  encryptData(sessionId: string, secretKey: string, iv: string, data: string) {
    const cipher = crypto.createCipheriv(
      "aes-256-gcm",
      Buffer.from(secretKey, "base64"),
      Buffer.from(iv, "base64")
    );

    cipher.setAAD(Buffer.from(secretKey, "base64"));

    const encrypted = Buffer.concat([
      cipher.update(data, "utf8"),
      cipher.final(),
    ]);
    const combined = Buffer.concat([encrypted, cipher.getAuthTag()]).toString(
      "base64"
    );

    return `v1$${sessionId}$${combined}`;
  },

  decryptData(secretKey: string, iv: string, encryptedData: string) {
    const parsed = Buffer.from(encryptedData.split("$")[2], "base64");
    const encrypted = parsed.slice(0, parsed.length - 16);
    const tag = parsed.slice(parsed.length - 16);

    const cipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(secretKey, "base64"),
      Buffer.from(iv, "base64")
    );

    cipher.setAAD(Buffer.from(secretKey, "base64"));
    cipher.setAuthTag(tag);

    const decrypted = Buffer.concat([cipher.update(encrypted), cipher.final()]);
    return decrypted.toString("utf-8");
  },
};
