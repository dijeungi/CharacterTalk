/*
  Route: '/'
  Path: app/page.tsx
  Description:
    - 이 페이지는 홈 페이지로, 사이트의 메인 콘텐츠가 표시됩니다.
    - 기본적으로 홈페이지에 필요한 모든 레이아웃을 포함하고 있으며,
      하위 컴포넌트를 호출하여 동적인 데이터를 처리합니다.
*/

'use client';

// components
import MainSwiper from './_components/main/MainSwiper';
import SubSwiper from './_components/main/SubSwiper';
import GridSwiper from './_components/main/GridSwiper';

export default function Home() {
  return (
    <main>
      {/* main */}
      <MainSwiper />
      {/* sub */}
      <SubSwiper />
      {/* body */}
      <GridSwiper />
    </main>
  );
}
