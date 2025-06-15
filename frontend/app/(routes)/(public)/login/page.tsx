/*
  Route: '/login'
  Path: frontend/app/(routes)/(public)/login/page.tsx
  Description:
    - 로그인 페이지 입니다.
*/

'use client';

// default
import Link from 'next/link';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// css
import styles from './page.module.css';

// library
import { Toast } from '../../../_utils/Swal';

export default function LoginPage() {
  // 로그인 버튼
  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `${process.env.NEXT_PUBLIC_KAUTH_HOST}/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  // login 리다이렉트 중 URL 쿼리에서 reason 값 추출
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
    <div className={styles.container}>
      {/* title */}
      <div className={styles.title}>
        <div className={styles.titleText}>
          <h1 className={styles.topTitle}>기억 속 대화</h1>
          <h4 className={styles.subTitle}>다시 이어가요</h4>
          <p className={styles.explanation}>AI 기반 캐릭터 챗봇 플랫폼</p>
        </div>
        <div className={styles.logo}>
          <img src="/img/logo.png" alt="logo" className={styles.logoImage} />
        </div>
      </div>

      {/* bottom */}
      <div className={styles.social}>
        <p className={styles.socialExplanation}>SMS 계정으로 간편 가입하기</p>
        <button className={styles.socialLoginBtn} onClick={handleKakaoLogin}>
          카카오로 로그인
          <img
            src="https://raw.githubusercontent.com/AI-himedia/Final_Project_Assets/main/btn_kakao.svg"
            className={styles.socialLoginLogo}
            alt="Kakao Login"
          />
        </button>
        <button className={styles.socialLoginBtn} onClick={handleKakaoLogin}>
          구글로 로그인
          <img
            src="https://raw.githubusercontent.com/AI-himedia/Final_Project_Assets/main/btn_google.svg"
            className={styles.socialLoginLogo}
            alt="Kakao Login"
          />
        </button>

        <Link href="/" className={styles.socialLoginDescription}>
          로그인하지 않고 둘러보기
        </Link>
      </div>
    </div>
  );
}
