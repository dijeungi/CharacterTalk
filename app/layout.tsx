// app/layout.tsx

"use client";

// font
import { Geist } from "next/font/google";

// css
import "./reset.css";
import "@/_config/fonts";

// 함수
import { useRenderHeader } from "@/_components/header/HeaderManager";

// 라이브러리
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// 폰트 설정
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const roboto = Geist({
  variable: "--font-roboto",
  subsets: ["latin"],
});

// 모든 페이지에 적용될 레이아웃 컴포넌트
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const renderHeader = useRenderHeader();
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="ko" className={`${geistSans.variable} ${roboto.variable}`}>
      <head>
        <script src="https://cdn.toss.im/cert/v1"></script>
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {renderHeader()}
          <main>{children}</main>
        </QueryClientProvider>
      </body>
    </html>
  );
}
