"use client";

// font
import { Geist } from "next/font/google";

// css
import "./globals.css";
import "./reset.css";

// 함수
import { useRenderHeader } from "@/app/components/header/HeaderManager";

// next.js
import { usePathname } from "next/navigation";

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

  return (
    <html lang="ko" className={geistSans.variable}>
      <body>
        {renderHeader()}
        <main>{children}</main>
      </body>
    </html>
  );
}
