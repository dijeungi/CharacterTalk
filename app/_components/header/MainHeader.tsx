'use client';

import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { GoPerson } from 'react-icons/go';
import { LuLogOut } from 'react-icons/lu';
import { HiOutlineMenu } from 'react-icons/hi';

import styles from '@/_styles/header/MainHeader.module.css';
import { Toast } from '@/_utils/Swal';
import axiosInstance from '@/lib/axiosInstance';

// MUI 추가
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';

import { useState } from 'react';

export default function MainHeader() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await axiosInstance.get('/api/user', { withCredentials: true });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const isLoggedIn = data?.isLoggedIn;

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
    <>
      <header className={styles.container}>
        {/* 왼쪽 상단 메뉴바 */}
        <div className={styles.leftSection}>
          <IconButton onClick={() => setOpen(true)}>
            <HiOutlineMenu className={styles.menuIcon} />
          </IconButton>
        </div>

        {/* 가운데 로고 */}
        <div className={styles.centerSection}>
          <Link href="/" className={styles.logo}>
            <img src="/img/logo.png" alt="logo" className={styles.logoImage} />
            <span className={styles.logoText}>캐릭톡</span>
          </Link>
        </div>

        {/* 오른쪽 상단 아이콘 */}
        <div className={styles.rightSection}>
          <Link href="/login">
            <GoPerson className={styles.Icon} />
          </Link>
        </div>
      </header>

      {/* 사이드 드로어 */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        variant="temporary"
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            width: '260px',
            top: '65px',
            height: 'calc(100vh - 65px)',
          },
        }}
      >
        <List>
          <Link href="/" passHref>
            <ListItem button component="a">
              <ListItemText primary="홈" />
            </ListItem>
          </Link>
          <Link href="/login" passHref>
            <ListItem button component="a">
              <ListItemText primary="로그인" />
            </ListItem>
          </Link>
        </List>
      </Drawer>
    </>
  );
}
