// app/components/main/MainBanner.tsx

import styles from "@/styles/main/MainBanner.module.css";

export default function MainBanner() {
  return (
    <>
      <section className={styles.container}>
        <h1 className={styles.title}>다시, 안녕</h1>
        <h4 className={styles.sub_title}>
          우리가 다시 대화할 수 있는 작은 기적
        </h4>

        <div className={styles.Scroll_Indicator} />
      </section>
    </>
  );
}
