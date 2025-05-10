"use client";

// font
import { Geist } from "next/font/google";

// css
import "./styles/common/globals.css";
import "./reset.css";

// 함수git ad
import { useRenderHeader } from "@/components/header/HeaderManager";

// 라이브러리
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// Geist Sans 폰트 설정
const geistSans = Geist({
  variable: "--font-geist-sans",
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
    <html lang="ko" className={geistSans.variable}>
      <body>
        <QueryClientProvider client={queryClient}>
          {renderHeader()}
          <main>{children}</main>
        </QueryClientProvider>
      </body>
    </html>
  );
}
