// app/components/header/MainHeader.tsx

// next.js
import Link from "next/link";

// css
import styles from "@/_styles/header/MainHeader.module.css";

// React-icon Lib
import { GoPerson } from "react-icons/go";
import { LuLogOut } from "react-icons/lu";

export default function MainHeader() {
  return (
    <header className={styles.container}>
      <Link href="/" className={styles.logo}>
        다시, 안녕
      </Link>
      <Link href="/login" className={styles.button}>
        <GoPerson />
      </Link>
    </header>
  );
}
