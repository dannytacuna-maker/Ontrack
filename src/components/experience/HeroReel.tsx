"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../OnTrackExperience.module.css";

const REELS = [
  "/media/hero-reel-01.mp4",
  "/media/hero-reel-02.mp4",
  "/media/hero-reel-03.mp4",
  "/media/hero-reel-04.mp4",
  "/media/hero-reel-05.mp4",
  "/media/hero-reel-06.mp4",
] as const;

type FrameVideo = HTMLVideoElement & {
  requestVideoFrameCallback?: (callback: () => void) => number;
};

export function HeroReel() {
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const indexRef = useRef(0);
  const [front, setFront] = useState<"a" | "b">("a");

  useEffect(() => {
    const slotA = aRef.current;
    const slotB = bRef.current;
    if (!slotA || !slotB) return;

    let cancelled = false;
    let timer = 0;

    const other = (element: HTMLVideoElement) =>
      element === slotA ? slotB : slotA;
    const nameOf = (element: HTMLVideoElement): "a" | "b" =>
      element === slotA ? "a" : "b";

    const assign = (element: HTMLVideoElement, index: number) => {
      const src = REELS[index];
      if (element.dataset.src !== src) {
        element.dataset.src = src;
        element.src = src;
        element.load();
      }
    };

    const waitFrame = (element: FrameVideo, callback: () => void) => {
      let complete = false;
      const run = () => {
        if (complete || cancelled) return;
        complete = true;
        callback();
      };
      if (typeof element.requestVideoFrameCallback === "function") {
        element.requestVideoFrameCallback(run);
      } else {
        element.addEventListener("playing", run, { once: true });
      }
    };

    const armCut = (outgoing: HTMLVideoElement) => {
      window.clearTimeout(timer);
      const schedule = () => {
        const duration = outgoing.duration;
        if (cancelled || !Number.isFinite(duration) || duration <= 0) return;
        // Hard cut at the end of the clip — no early fade window.
        timer = window.setTimeout(
          () => cutFrom(outgoing),
          Math.max(250, duration * 1000 - 40),
        );
      };
      if (outgoing.readyState >= 1) schedule();
      else outgoing.addEventListener("loadedmetadata", schedule, { once: true });
    };

    const cutFrom = (outgoing: HTMLVideoElement) => {
      if (cancelled) return;
      const nextIndex = (indexRef.current + 1) % REELS.length;
      const incoming = other(outgoing);
      assign(incoming, nextIndex);

      const playIncoming = () => {
        if (cancelled) return;
        incoming.currentTime = 0;
        void incoming.play().catch(() => undefined);
        waitFrame(incoming as FrameVideo, () => {
          if (cancelled) return;
          // Instant cut: swap the visible layer only after a painted frame.
          setFront(nameOf(incoming));
          indexRef.current = nextIndex;
          outgoing.pause();
          assign(outgoing, (nextIndex + 1) % REELS.length);
          armCut(incoming);
        });
      };

      if (incoming.readyState >= 2) playIncoming();
      else incoming.addEventListener("canplay", playIncoming, { once: true });
    };

    assign(slotA, 0);
    assign(slotB, 1);
    const start = () => {
      if (cancelled) return;
      slotA.currentTime = 0;
      void slotA.play().catch(() => undefined);
      waitFrame(slotA as FrameVideo, () => armCut(slotA));
    };
    if (slotA.readyState >= 2) start();
    else slotA.addEventListener("canplay", start, { once: true });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      slotA.pause();
      slotB.pause();
    };
  }, []);

  return (
    <div className={styles.media} aria-hidden="true">
      <video
        ref={aRef}
        className={`${styles.video} ${front === "a" ? styles.videoFront : ""}`}
        muted
        playsInline
        preload="auto"
      />
      <video
        ref={bRef}
        className={`${styles.video} ${front === "b" ? styles.videoFront : ""}`}
        muted
        playsInline
        preload="auto"
      />
      <div className={styles.overlay} />
    </div>
  );
}
