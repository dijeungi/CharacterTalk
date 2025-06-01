import './globals.css';
import './reset.css';
import { ReactNode } from 'react';
import HeaderController from './_components/header/HeaderController';
import ReactQueryProvider from './_providers/ReactQueryProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="container">
          <ReactQueryProvider>
            <HeaderController />
            {children}
          </ReactQueryProvider>
        </div>
      </body>
    </html>
  );
}
