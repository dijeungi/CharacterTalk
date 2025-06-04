/*
  route: '/header/main'
  Path: app/_components/header/MainHeader.tsx
  Description:
    - 이 페이지는 상단 네비게이션 바와 MUI 드로어 메뉴를 구현한 헤더 컴포넌트입니다.
    - 메뉴 아이콘을 클릭하면 왼쪽에서 슬라이드되는 드로어 메뉴가 열리고 닫히며, 메뉴에는 홈, 추천, 랭킹, 캐릭터 제작 등 여러 기능을 제공합니다.
*/

'use client';

// React
import { useEffect, useState } from 'react';

// Next.js
import Link from 'next/link';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// React Query
import { useQueryClient } from '@tanstack/react-query';

// 스타일
import styles from '@/_styles/header/MainHeader.module.css';

// 아이콘
import { HiOutlineMenu, HiOutlineMenuAlt1 } from 'react-icons/hi';
import { GoPerson } from 'react-icons/go';
import { TbSmartHome } from 'react-icons/tb';
import { CiSquarePlus } from 'react-icons/ci';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { PiRanking } from 'react-icons/pi';
import { HiOutlineFire } from 'react-icons/hi2';

// MUI
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';

// 유틸
import { Toast } from '@/_utils/Swal';
import axiosInstance from '@/lib/axiosInstance';

export default function MainHeader() {
  // 상태
  const [open, setOpen] = useState(false);

  // 라우터
  const router = useRouter();

  // React Query 클라이언트
  const queryClient = useQueryClient();

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

  // 경로 변경 시 Drawer 닫기
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header className={styles.container}>
        <div className={styles.leftSection}>
          <IconButton onClick={() => setOpen(prev => !prev)}>
            {open ? (
              <HiOutlineMenuAlt1 className={styles.menuIcon} /> // 닫히고
            ) : (
              <HiOutlineMenu className={styles.menuIcon} /> // 열리고
            )}
          </IconButton>
        </div>

        <div className={styles.centerSection}>
          <Link href="/" className={styles.logo}>
            <img src="/img/logo.png" alt="logo" className={styles.logoImage} />
            <span className={styles.logoText}>캐릭톡</span>
          </Link>
        </div>

        <div className={styles.rightSection}>
          <Link href="/login">
            <GoPerson className={styles.Icon} />
          </Link>
        </div>
      </header>

      {/* MUI Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        variant="temporary"
        ModalProps={{ keepMounted: true }}
        slotProps={{
          paper: {
            sx: {
              width: '260px',
              top: '60px',
              height: 'calc(100vh - 60px)',
            },
          },
        }}
      >
        <List sx={{ borderBottom: '1px solid #ccc' }}>
          {/* 홈 */}
          <ListItem component={NextLink} href="/">
            <ListItemText
              primary={
                <span className={styles.Drawer_Icon}>
                  <TbSmartHome />홈
                </span>
              }
            />
          </ListItem>

          {/* 추천 */}
          <ListItem component={NextLink} href="/">
            <ListItemText
              primary={
                <span className={styles.Drawer_Icon}>
                  <HiOutlineFire />
                  추천
                </span>
              }
            />
          </ListItem>

          {/* 랭킹 */}
          <ListItem component={NextLink} href="/ranking">
            <ListItemText
              primary={
                <span className={styles.Drawer_Icon}>
                  <PiRanking />
                  랭킹
                </span>
              }
            />
          </ListItem>
        </List>

        <List sx={{ borderBottom: '1px solid #ccc' }}>
          <ListItem component={NextLink} href="/characters">
            <ListItemText
              primary={
                <span className={styles.Drawer_Icon}>
                  <CiSquarePlus />
                  캐릭터 제작
                </span>
              }
            />
          </ListItem>

          <ListItem>
            <ListItemText
              primary={
                <span className={styles.Drawer_Icon}>
                  <HiOutlineChatAlt2 />
                  대화 내역
                </span>
              }
            />
          </ListItem>
        </List>

        <List>
          {/* 마이페이지 */}
          <ListItem component={NextLink} href="/my">
            <ListItemText
              primary={
                <span className={styles.Drawer_Icon}>
                  <GoPerson />
                  마이페이지
                </span>
              }
            />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
