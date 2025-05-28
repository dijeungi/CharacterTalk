/*
  메인 헤더 컴포넌트
  app/_components/header/MainHeader.tsx
*/

'use client';

// 라이브러리
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoPerson } from 'react-icons/go';
import { LuLogOut } from 'react-icons/lu';
import { CiMenuBurger } from 'react-icons/ci';
import { IoSearchOutline } from 'react-icons/io5';
import { TbBrandDingtalk } from 'react-icons/tb';

// 스타일 & 유틸
import styles from '@/_styles/header/MainHeader.module.css';
import { Toast } from '@/_utils/Swal';
import axiosInstance from '@/lib/axiosInstance';

// 메인 헤더 컴포넌트
export default function MainHeader() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 로그인 상태 조회
  const { data } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await axiosInstance.get('/api/user', { withCredentials: true });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const isLoggedIn = data?.isLoggedIn;

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/auth/refresh/logout');

      Toast.fire({
        icon: 'success',
        title: '로그아웃 완료',
        timer: 1500,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/');
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: '로그아웃 실패',
      });
    }
  };

  return (
    <header className={styles.container}>
      <div className={styles.leftIcon}>
        <CiMenuBurger />
      </div>

      <div className={styles.logoWrapper}>
        <Link href="/" className={styles.logo}>
          캐릭톡
          <TbBrandDingtalk />
        </Link>
      </div>

      <div className={styles.rightIcon}>
        <IoSearchOutline />
      </div>
    </header>
  );
}
