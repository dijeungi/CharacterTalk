export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* <header>로그인 전용 헤더</header> */}
      <main>{children}</main>
    </div>
  );
}
