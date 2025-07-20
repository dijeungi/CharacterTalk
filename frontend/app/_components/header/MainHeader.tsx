/*
  Route: '/header/main'
  Path: app/_components/header/MainHeader.tsx
  Description:
    - 이 페이지는 상단 네비게이션 바와 MUI 드로어 메뉴를 구현한 헤더 컴포넌트입니다.
    - 메뉴 아이콘을 클릭하면 왼쪽에서 슬라이드되는 드로어 메뉴가 열리고 닫히며, 메뉴에는 홈, 추천, 랭킹, 캐릭터 제작 등 여러 기능을 제공합니다.
    - Zustand를 연동하여 로그인 상태에 따라 UI가 동적으로 변경됩니다.
*/

'use client';
import { useEffect, useState } from 'react';
import styles from '@/app/_components/header/MainHeader.module.css';

import Link from 'next/link';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/app/_store/auth/index';

import { HiOutlineMenu, HiOutlineMenuAlt1 } from 'react-icons/hi';
import { GoPerson } from 'react-icons/go';
import { TbSmartHome } from 'react-icons/tb';
import { CiSquarePlus } from 'react-icons/ci';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { PiRanking } from 'react-icons/pi';
import { HiOutlineFire } from 'react-icons/hi2';
import { FiLogIn, FiLogOut } from 'react-icons/fi';

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';

import { Toast } from '@/app/_utils/Swal';
import axiosInstance from '@/app/_lib/axiosNext';

export default function MainHeader() {
  // 상태
  const [open, setOpen] = useState(false);
  // 라우터
  const router = useRouter();
  // Query
  const queryClient = useQueryClient();
  // store
  const { isLoggedIn, logout: logoutFromStore } = useAuthStore();

  // Logout
  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/refresh/logout');
      Toast.fire({
        icon: 'success',
        title: '로그아웃 완료',
        timer: 1500,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      logoutFromStore();
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
        {/* Left */}
        <div className={styles.leftSection}>
          <IconButton onClick={() => setOpen(prev => !prev)}>
            {open ? (
              <HiOutlineMenuAlt1 className={styles.menuIcon} />
            ) : (
              <HiOutlineMenu className={styles.menuIcon} />
            )}
          </IconButton>
        </div>

        <div className={styles.centerSection}>
          <Link href="/" className={styles.logo}>
            <img src="/img/logo.png" alt="logo" className={styles.logoImage} />
            <span className={styles.logoText}>캐릭톡</span>
          </Link>
        </div>

        {/* Right */}
        <div className={styles.rightSection}>
          {isLoggedIn ? (
            // 로그인 후: 로그아웃 아이콘 버튼
            <IconButton onClick={handleLogout} aria-label="logout">
              <FiLogOut className={styles.Icon} />
            </IconButton>
          ) : (
            // 로그인 전: 로그인 페이지로 이동하는 아이콘 링크
            <Link href="/login">
              <GoPerson className={styles.Icon} />
            </Link>
          )}
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
          <ListItemButton component={NextLink} href="/">
            <ListItemText
              primary={
                <span className={styles.Drawer_Icon}>
                  <TbSmartHome />홈
                </span>
              }
            />
          </ListItemButton>
          <ListItemButton component={NextLink} href="/">
            <ListItemText
              primary={
                <span className={styles.Drawer_Icon}>
                  <HiOutlineFire />
                  추천
                </span>
              }
            />
          </ListItemButton>
          <ListItemButton component={NextLink} href="/ranking">
            <ListItemText
              primary={
                <span className={styles.Drawer_Icon}>
                  <PiRanking />
                  랭킹
                </span>
              }
            />
          </ListItemButton>
        </List>

        <List sx={{ borderBottom: '1px solid #ccc' }}>
          <ListItemButton component={NextLink} href="/characters">
            <ListItemText
              primary={
                <span className={styles.Drawer_Icon}>
                  <CiSquarePlus />
                  캐릭터 제작
                </span>
              }
            />
          </ListItemButton>
          <ListItemButton>
            <ListItemText
              primary={
                <span className={styles.Drawer_Icon}>
                  <HiOutlineChatAlt2 />
                  대화 내역
                </span>
              }
            />
          </ListItemButton>
        </List>

        {isLoggedIn ? (
          // 로그인 되었을 때: 마이페이지, 로그아웃 메뉴 표시
          <List>
            <ListItemButton component={NextLink} href="/my">
              <ListItemText
                primary={
                  <span className={styles.Drawer_Icon}>
                    <GoPerson />
                    마이페이지
                  </span>
                }
              />
            </ListItemButton>
            <ListItemButton onClick={handleLogout}>
              <ListItemText
                primary={
                  <span className={styles.Drawer_Icon}>
                    <FiLogOut />
                    로그아웃
                  </span>
                }
              />
            </ListItemButton>
          </List>
        ) : (
          // 로그아웃 되었을 때: 로그인 메뉴 표시
          <List>
            <ListItemButton component={NextLink} href="/login">
              <ListItemText
                primary={
                  <span className={styles.Drawer_Icon}>
                    <FiLogIn />
                    로그인
                  </span>
                }
              />
            </ListItemButton>
          </List>
        )}
      </Drawer>
    </>
  );
}
