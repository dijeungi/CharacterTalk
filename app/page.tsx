// app/page.tsx

'use client';

import MainBanner from './_components/main/MainBanner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Toast } from './_utils/Swal';
// import style from "@/globals.module.css";

/*
  React로 치면 메인 화면 App.js 라고 생각하시면 됩니다.
  클라이언트 코드 사용 시 `use client` 선언이 필요합니다.
*/

export default function Home() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (params.get('login') === 'success') {
      Toast.fire({
        icon: 'success',
        title: '로그인 성공!',
        timer: 1500,
      });
      const url = new URL(window.location.href);
      url.searchParams.delete('login');
      router.replace(url.toString());
    }
  }, [params, router]);

  return (
    <>
      <MainBanner />
    </>
  );
}
