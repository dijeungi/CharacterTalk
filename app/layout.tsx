import './reset.css';
import '@/_config/fonts';
import { omyuPretty } from '@/_config/fonts';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={`${omyuPretty.variable}`}>
      <body>{children}</body>
    </html>
  );
}
