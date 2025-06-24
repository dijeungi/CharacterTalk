/**
 * @config       firebaseClient
 * @file         frontend/app/firebase/config.ts
 * @desc         클라이언트 환경에서 Firebase 앱 및 인증 모듈 초기화
 *
 * @env
 *  - NEXT_PUBLIC_FIREBASE_API_KEY
 *  - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *  - NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *  - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 *  - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 *  - NEXT_PUBLIC_FIREBASE_APP_ID
 *
 * @logic
 *  - 기존 Firebase 앱이 존재하지 않으면 초기화
 *  - getAuth(app)을 통해 Firebase Auth 인스턴스 생성
 *
 * @usage        클라이언트 측 Firebase 인증 기능 사용 시 import
 * @dependencies firebase/app, firebase/auth
 *
 * @author       최준호
 * @since        2025.06.20
 * @updated      2025.06.23
 */

// Firebase Authentication Module
import { getAuth } from 'firebase/auth';
import { initializeApp, getApp, getApps } from 'firebase/app';

// env
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Firebase 앱이 없으면 초기화하고, 이미 있으면 기존 앱 사용하여 Auth 인스턴스 생성
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// export
export { app, auth };
