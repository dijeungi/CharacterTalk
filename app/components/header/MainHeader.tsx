// app/components/header/MainHeader.tsx

// next.js
import Link from "next/link";

// css
import styles from "@/app/styles/header/MainHeader.module.css";

// React-icon Lib
import { GoPerson } from "react-icons/go";
import { LuLogOut } from "react-icons/lu";

export default function MainHeader() {
  return (
    <header className={styles.container}>
      <Link href="/" className={styles.logo}>
        다시, 안녕
      </Link>
      <Link href="/auth/login" className={styles.button}>
        <GoPerson />
      </Link>
    </header>
  );
}
