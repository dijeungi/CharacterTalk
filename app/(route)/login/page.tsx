// app/auth/login/page.tsx

"use client";

import styles from "@/_styles/auth/Login.module.css";

export default function LoginPage() {
  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `${process.env.NEXT_PUBLIC_KAUTH_HOST}/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1 className={styles.top_title}>다시, 안녕</h1>
        <h4 className={styles.sub_title}>
          우리가 다시 대화할 수 있는 작은 기적
        </h4>
      </div>

      <div className={styles.Social_Login}>
        <button
          className={styles.Social_Login_Button}
          onClick={handleKakaoLogin}
        >
          카카오로 로그인
          <img
            src="https://raw.githubusercontent.com/AI-himedia/Final_Project_Assets/main/btn_kakao.svg"
            className={styles.Social_Login_Logo}
            alt="Kakao Login"
          />
        </button>
        <p className={styles.Social_Login_Description}>
          카카오 계정으로 간편하게 시작하세요
        </p>
      </div>
    </div>
  );
}
