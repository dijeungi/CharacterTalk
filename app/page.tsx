// app/page.tsx

import MainBanner from "./components/main/MainBanner";

import "@/styles/common/globals.css";

/*
  React로 치면 메인 화면 App.js 라고 생각하시면 됩니다.
  클라이언트 코드 사용 시 `use client` 선언이 필요합니다.
*/

export default function Home() {
  return (
    <main className="main">
      <MainBanner />
    </main>
  );
}
