/**
 * @route        /login
 * @file         frontend/app/(routes)/(public)/login/page.tsx
 * @component    LoginPage
 * @desc         카카오/구글 소셜 로그인 기능을 제공하는 로그인 페이지 컴포넌트
 *
 * @layout       PublicLayout
 * @access       public (비로그인 접근 가능)
 * @props        없음 (페이지 단위 컴포넌트)
 *
 * @features
 *  - 카카오/구글 OAuth 로그인 연동
 *  - 로그인 실패 시 reason 쿼리값에 따라 알림 노출
 *  - 로그인 없이 홈으로 이동 가능 (둘러보기 버튼)
 *
 * @dependencies
 *  - next/navigation: useSearchParams 사용
 *  - @/_utils/Swal: 커스텀 토스트 알림
 *
 * @todo         추후 기능: 구글 소셜 로그인 api 연결
 * @author       최준호
 * @since        2025.06.12
 * @updated      2025.06.22
 */

'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// css
import styles from './page.module.css';

// library
import { Toast } from '../../../_utils/Swal';

export default function LoginPage() {
  // Kakao Login btn
  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `${process.env.NEXT_PUBLIC_KAUTH_HOST}/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  // 추후 추가 예정
  const handleGoogleLogin = () => {};

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
      {/* 상단 헤더 영역 */}
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

      {/* 소셜 로그인 영역 */}
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
        <button className={styles.socialLoginBtn} onClick={handleGoogleLogin}>
          구글로 로그인
          <img
            src="https://raw.githubusercontent.com/AI-himedia/Final_Project_Assets/main/btn_google.svg"
            className={styles.socialLoginLogo}
            alt="Google Login"
          />
        </button>

        <Link href="/" className={styles.socialLoginDescription}>
          로그인하지 않고 둘러보기
        </Link>
      </div>
    </div>
  );
}
