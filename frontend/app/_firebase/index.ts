/**
 * @file      frontend/app/_firebase/index.ts
 * @desc      Config: Firebase 앱 및 인증(Auth) 인스턴스 초기화 설정
 *
 * @author    최준호
 * @update    2025.07.21
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
