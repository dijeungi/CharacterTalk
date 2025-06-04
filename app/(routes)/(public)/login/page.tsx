// app/auth/login/page.tsx

'use client';

import styles from './Login.module.css';
import { Toast } from '@/_utils/Swal';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `${process.env.NEXT_PUBLIC_KAUTH_HOST}/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  const params = useSearchParams();
  const reason = params.get('reason');

  useEffect(() => {
    if (['unauthorized', 'expired', 'forbidden'].includes(reason ?? '')) {
      Toast.fire({
        icon: 'warning',
        title: '로그인이 필요합니다.',
      });
    }
  }, [reason]);

  return (
    <div className={styles.Container}>
      <div className={styles.Title}>
        <div className={styles.titleText}>
          <h1 className={styles.top_title}>기억 속 대화</h1>
          <h4 className={styles.sub_title}>다시 이어가요</h4>
          <p className={styles.Explanation}>AI 기반 캐릭터 챗봇 플랫폼</p>
        </div>
        <div className={styles.logo}>
          <img src="/img/logo.png" alt="logo" className={styles.logoImage} />
        </div>
      </div>
      <div className={styles.Social_Login}>
        <p className={styles.Social_Explanation}>SMS 계정으로 간편 가입하기</p>
        <button className={styles.Social_Login_Button} onClick={handleKakaoLogin}>
          카카오로 로그인
          <img
            src="https://raw.githubusercontent.com/AI-himedia/Final_Project_Assets/main/btn_kakao.svg"
            className={styles.Social_Login_Logo}
            alt="Kakao Login"
          />
        </button>
        <button className={styles.Social_Login_Button} onClick={handleKakaoLogin}>
          구글로 로그인
          <img
            src="https://raw.githubusercontent.com/AI-himedia/Final_Project_Assets/main/btn_google.svg"
            className={styles.Social_Login_Logo}
            alt="Kakao Login"
          />
        </button>

        <Link href="/" className={styles.Social_Login_Description}>
          로그인하지 않고 둘러보기
        </Link>
      </div>
    </div>
  );
}
