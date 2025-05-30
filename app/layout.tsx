import './globals.css';
import './reset.css';
import '@/_config/fonts';
import { omyuPretty, pretendard } from '@/_config/fonts';
import { ReactNode } from 'react';
import HeaderController from './_components/header/HeaderController';
import ReactQueryProvider from './_providers/ReactQueryProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={`${omyuPretty.variable} ${pretendard.variable}`}>
      <body className="container">
        <ReactQueryProvider>
          <HeaderController />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
