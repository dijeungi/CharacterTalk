'use client';

import { usePathname } from 'next/navigation';
import { headerConfig } from '@/_config/headerConfig';
import MainHeader from './MainHeader';

export default function HeaderController() {
  const pathname = usePathname();

  const config = headerConfig.find(cfg => pathname.startsWith(cfg.path));
  if (!config || config.visible === false) return null;

  switch (config.variant) {
    case 'admin':
    //   return <AdminHeader />;
    default:
      return <MainHeader />;
  }
}
