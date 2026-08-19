"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import styles from "./portfolioFx.module.css";

type CursorBlockProps = {
  children: ReactNode;
  className?: string;
  tone?: "padded" | "compact" | "cta";
};

export function CursorBlock({
  children,
  className = "",
  tone = "padded",
}: CursorBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const onMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (reduced.current) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty("--mx", x.toFixed(3));
    node.style.setProperty("--my", y.toFixed(3));
    node.style.setProperty("--px", `${((x + 0.5) * 100).toFixed(1)}%`);
    node.style.setProperty("--py", `${((y + 0.5) * 100).toFixed(1)}%`);
  }, []);

  const onLeave = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--mx", "0");
    node.style.setProperty("--my", "0");
    // Keep --px/--py so the glow fades in place instead of jumping.
  }, []);

  const toneClass =
    tone === "cta"
      ? styles.cursorCta
      : tone === "compact"
        ? styles.cursorCompact
        : styles.cursorPadded;

  return (
    <div
      ref={ref}
      className={`${styles.cursorBlock} ${toneClass} ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className={styles.cursorInner}>{children}</div>
    </div>
  );
}

/** Firmus nosotros entrance: rise + scale as the photo enters view. */
export function PhotoPop({
  children,
  className = "",
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      node.classList.add(styles.photoPopIn);
      node.classList.remove(styles.photoPopOut);
      return;
    }

    node.style.transitionDelay = `${delayMs}ms`;
    // Reveal once and stop observing. The entrance transform changes how much
    // of the element intersects, so a two-way toggle oscillates around the
    // threshold and makes the photo shake while it sits half in view.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        node.classList.add(styles.photoPopIn);
        node.classList.remove(styles.photoPopOut);
        observer.disconnect();
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -6% 0px",
      },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <div
      ref={ref}
      className={`${styles.photoPop} ${styles.photoPopOut} ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function clipForProgress(progress: number) {
  const p = easeOutCubic(Math.min(1, Math.max(0, progress)));
  const radius = 10 + p * 95;
  if (p >= 0.94) return "inset(0 round 14px)";
  return `circle(${radius}% at 50% 50%)`;
}

/** Circular “pizza” reveal that opens to full frame while scrolling. */
export function ScrollRevealImage({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const frameRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      frame.style.clipPath = "none";
      frame.dataset.open = "true";
      return;
    }

    const update = () => {
      const rect = frame.getBoundingClientRect();
      const viewH = window.innerHeight;
      const start = viewH * 0.92;
      const end = viewH * 0.38;
      const progress = (start - rect.top) / ((start - end) * 1.35);
      const clipped = Math.min(1, Math.max(0, progress));
      frame.style.clipPath = clipForProgress(clipped);
      frame.dataset.open = clipped > 0.9 ? "true" : "false";
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <figure
      ref={frameRef as RefObject<HTMLElement>}
      className={`${styles.revealInline} ${className}`}
      style={{ clipPath: "circle(12% at 50% 50%)" } as CSSProperties}
    >
      {children}
    </figure>
  );
}
