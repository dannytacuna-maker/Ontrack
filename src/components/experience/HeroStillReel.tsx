"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../OnTrackExperience.module.css";

const STILLS = [
  "/media-desk.png",
  "/media-reports.png",
] as const;

const HOLD_MS = 4200;

export function HeroStillReel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % STILLS.length);
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={styles.media} aria-hidden="true">
      {STILLS.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          quality={100}
          unoptimized
          className={`${styles.still} ${i === index ? styles.stillFront : ""}`}
          sizes="100vw"
        />
      ))}
      <div className={styles.overlay} />
    </div>
  );
}
