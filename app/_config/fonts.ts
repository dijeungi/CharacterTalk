/* styles\fonts.css */
// 컴포넌트 export 가 아닌 설정값만 export기 떄문에 .ts 입니다.

import localFont from 'next/font/local';

// 오뮤 다예쁨체 폰트 (제목)
export const omyuPretty = localFont({
  src: '../../public/fonts/omyu_pretty.woff2',
  variable: '--font-omyu-pretty',
});

// 프리텐다드 폰트 (설명)
export const pretendard = localFont({
  src: '../../public/fonts/Pretendard-Regular.woff',
  variable: '--font-pretendard',
});
