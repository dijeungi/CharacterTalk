/* styles\fonts.css */
// 컴포넌트 export 가 아닌 설정값만 export기 떄문에 .ts 입니다.

import localFont from 'next/font/local';

export const omyuPretty = localFont({
  src: '../../public/fonts/omyu_pretty.woff2',
  variable: '--font-omyu-pretty',
});
