// app/layout.tsx

import './reset.css';
import '@/_config/fonts';
import { Geist } from 'next/font/google';
import { ReactNode } from 'react';
import ClientProviders from '@/_components/provider/ClientProviders';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});
const roboto = Geist({
  variable: '--font-roboto',
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${roboto.variable}`}>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
