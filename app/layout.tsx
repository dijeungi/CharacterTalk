import './globals.css';
import '@/_config/fonts';
import { omyuPretty } from '@/_config/fonts';
import { ReactNode } from 'react';
import HeaderController from './_components/header/HeaderController';
import ReactQueryProvider from './_providers/ReactQueryProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={`${omyuPretty.variable}`}>
      <body>
        <ReactQueryProvider>
          <HeaderController />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
