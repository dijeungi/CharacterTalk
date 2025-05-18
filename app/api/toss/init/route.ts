// app/api/toss/init/route.ts
import { NextRequest, NextResponse } from "next/server";

const TOSS_API_KEY = process.env.TOSS_API_KEY!;
const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY!;

export async function POST() {
  try {
    // 1. Access Token 발급
    const tokenRes = await fetch("https://oauth2.cert.toss.im/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: TOSS_API_KEY,
        client_secret: TOSS_SECRET_KEY,
        scope: "ca",
      }),
    });
    const { access_token } = await tokenRes.json();

    // 2. 본인인증 요청 (표준창 방식)
    const authRes = await fetch(
      "https://cert.toss.im/api/v2/sign/user/auth/id/request",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestType: "USER_NONE",
          requestUrl: "http://localhost:3000/signup",
        }),
      }
    );

    const result = await authRes.json();
    if (result.resultType === "SUCCESS") {
      const { authUrl, txId } = result.success;
      return NextResponse.json({ authUrl, txId });
    }

    return NextResponse.json({ error: result.error }, { status: 400 });
  } catch (err: any) {
    console.error("TOSS INIT ERROR", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ----------------------------- USER_PERSONAL 방식 -----------------------------

// import { NextRequest, NextResponse } from "next/server";
// import crypto from "crypto";
// import { tossCrypto } from "@/lib/toss/tossCrypto";

// const TOSS_API_KEY = process.env.TOSS_API_KEY!;
// const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY!;
// // const TOSS_PUBLIC_KEY = process.env.TOSS_PUBLIC_KEY!;

// export async function POST(req: NextRequest) {
//   try {
//     const { name, phone, birthday } = await req.json();

//     // 세션 구성
//     const sessionId = crypto.randomUUID();
//     const secretKey = tossCrypto.generateRandomBytes(32);
//     const iv = tossCrypto.generateRandomBytes(12);

//     // const sessionKey = tossCrypto.generateSessionKey(
//     //   sessionId,
//     //   secretKey,
//     //   iv
//     //   TOSS_PUBLIC_KEY
//     // );

//     // 개인정보 암호화
//     const encryptedName = tossCrypto.encryptData(
//       sessionId,
//       secretKey,
//       iv,
//       name
//     );
//     const encryptedPhone = tossCrypto.encryptData(
//       sessionId,
//       secretKey,
//       iv,
//       phone
//     );
//     const encryptedBirthday = tossCrypto.encryptData(
//       sessionId,
//       secretKey,
//       iv,
//       birthday
//     );

//     // 액세스 토큰 발급
//     const tokenRes = await fetch("https://oauth2.cert.toss.im/token", {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: new URLSearchParams({
//         grant_type: "client_credentials",
//         client_id: TOSS_API_KEY,
//         client_secret: TOSS_SECRET_KEY,
//         scope: "ca",
//       }),
//     });

//     const { access_token } = await tokenRes.json();

//     // 본인인증 요청
//     const authRes = await fetch(
//       "https://cert.toss.im/api/v2/sign/user/auth/id/request",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${access_token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           requestType: "USER_PERSONAL",
//           triggerType: "PUSH",
//           requestUrl: "http://localhost:3000/signup",
//           userName: encryptedName,
//           userPhone: encryptedPhone,
//           userBirthday: encryptedBirthday,
//           sessionKey,
//         }),
//       }
//     );

//     const result = await authRes.json();

//     if (result.resultType === "SUCCESS") {
//       return NextResponse.json({
//         txId: result.success.txId,
//         authUrl: result.success.authUrl,
//       });
//     }

//     return NextResponse.json({ error: result.error }, { status: 400 });
//   } catch (err: any) {
//     console.error("토스 init 에러:", err);
//     return NextResponse.json(
//       { error: err.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
