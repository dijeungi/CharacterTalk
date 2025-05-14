/*
  layout.tsx 에만 적용할 컴포넌트 입니다.
  app/_components/common/LoadingOverlay.tsx
*/

"use client";

// css
import "@/globals.css";

import { ScaleLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="Spinner_Overlay">
      <ScaleLoader color="#2e80ff" />
    </div>
  );
}
