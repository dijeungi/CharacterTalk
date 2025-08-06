/**
 * @route        /
 * @file         page.tsx
 * @component    Home
 * @desc         메인 페이지에 3종 스와이퍼 컴포넌트를 렌더링하는 컴포넌트
 *
 * @layout       default
 * @access       public
 * @props        없음
 *
 * @features
 *  - MainSwiper: 상단 메인 배너 슬라이드
 *  - SubSwiper: 중간 섹션 정보 슬라이드
 *  - GridSwiper: 캐릭터 그리드 카드 슬라이드
 *
 * @dependencies
 *  - ./_components/main/MainSwiper
 *  - ./_components/main/SubSwiper
 *  - ./_components/main/GridSwiper
 *
 * @todo
 *  - 콘텐츠 동적 로딩 최적화
 *
 * @author       최준호
 * @since        2025.06.12
 * @updated      2025.06.26
 */

'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// components
import MainSwiper from './_components/main/MainSwiper';
import SubSwiper from './_components/main/SubSwiper';
import GridSwiper from './_components/main/GridSwiper';
import { Toast } from './_utils/Swal';

export default function Home() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('character_created') === 'true') {
      Toast.fire({
        icon: 'success',
        title: '캐릭터가 성공적으로 등록되었습니다!',
      });
    }
  }, [searchParams]);

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
