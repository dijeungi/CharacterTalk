/**
 * @route        /firebase/config
 * @file         frontend/app/firebase/config.ts
 * @component    -
 * @desc         Firebase 초기화 및 인증 인스턴스 설정
 *
 * @layout       -
 * @access       internal
 * @props        -
 *
 * @features
 *  - Firebase 앱 중복 초기화 방지
 *  - 인증(Auth) 모듈 인스턴스 생성 및 외부 export
 *
 * @dependencies
 *  - firebase/app
 *  - firebase/auth
 *
 * @todo         -
 * @author       최준호
 * @since        2025.06.12
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
