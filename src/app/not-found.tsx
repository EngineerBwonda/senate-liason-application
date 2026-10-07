"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  HardHat,
  Hammer,
  Wrench,
  Sparkles,
  Home,
} from "lucide-react";
import styles from "./not-found.module.css";

export default function NotFound() {
  const router = useRouter();

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="dev-heading">
        <div className={styles.illustration} aria-hidden="true">
          <span className={styles.ringOuter} />
          <span className={styles.ringInner} />
          <span className={styles.iconBubble}>
            <HardHat size={34} strokeWidth={1.8} />
          </span>
          <span className={`${styles.miniIcon} ${styles.miniIconA}`}>
            <Hammer size={16} />
          </span>
          <span className={`${styles.miniIcon} ${styles.miniIconB}`}>
            <Wrench size={16} />
          </span>
          <span className={`${styles.miniIcon} ${styles.miniIconC}`}>
            <Sparkles size={16} />
          </span>
        </div>

        <p className={styles.badge}>
          <span className={styles.badgeDot} aria-hidden="true" />
          Under construction
        </p>

        <h1 id="dev-heading" className={styles.title}>
          This page is still being built
        </h1>

        <p className={styles.description}>
          Our team is working on it right now. Please check back soon — or head
          back to where you came from.
        </p>

        <div className={styles.actions}>
          <button type="button" className={styles.primaryBtn} onClick={goBack}>
            <ArrowLeft size={16} aria-hidden="true" />
            Go back
          </button>

          <button
            type="button"
            className={styles.ghostBtn}
            onClick={() => router.push("/")}
          >
            <Home size={16} aria-hidden="true" />
            Dashboard
          </button>
        </div>

        <p className={styles.footnote}>
          If you believe this is a mistake, contact the system administrator.
        </p>
      </section>
    </main>
  );
}
