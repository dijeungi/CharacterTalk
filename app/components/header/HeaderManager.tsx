// 헤더 관리 함수
import { usePathname } from "next/navigation";
import MainHeader from "./MainHeader";

export const useRenderHeader = () => {
  // 현재 경로
  const pathname = usePathname();

  // 경로에 따라 헤더 결정
  const renderHeader = () => {
    // if (pathname.startsWith("/")) {
    //   return <AuthHeader />;
    // }
    return <MainHeader />;
  };

  return renderHeader;
};
