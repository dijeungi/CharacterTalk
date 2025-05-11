/* styles\fonts.css */
// 컴포넌트 export 가 아닌 설정값만 export기 떄문에 .ts 입니다.

import localFont from "next/font/local";

export const gowunBatang = localFont({
  src: "../../public/fonts/GowunBatang-Regular.ttf",
  variable: "--font-gowun-batang",
});

export const roboto = localFont({
  src: "../../public/fonts/Roboto-VariableFont_wdth,wght.ttf",
  variable: "--font-roboto",
});
