// app/page.tsx

'use client';

import MainSwiper from './_components/main/MainSwiper';
import SubSwiper from './_components/main/SubSwiper';
import GridSwiper from './_components/main/GridSwiper';

/*
  React로 치면 메인 화면 App.js 라고 생각하시면 됩니다.
  클라이언트 코드 사용 시 `use client` 선언이 필요합니다.
*/

export default function Home() {
  return (
    <main>
      <MainSwiper />
      <SubSwiper />
      <GridSwiper />
    </main>
  );
}
