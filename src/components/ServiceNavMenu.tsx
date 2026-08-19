"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import styles from "./ServiceNavMenu.module.css";

type ServiceItem = {
  id: string;
  title: string;
};

type Props = {
  locale: Locale;
  currentId: string;
  services: ServiceItem[];
  labels: {
    menu: string;
    returnHome: string;
    services: string;
  };
};

export function ServiceNavMenu({ locale, currentId, services, labels }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{labels.menu}</span>
        <span className={styles.chevron} aria-hidden="true">
          {open ? "▴" : "▾"}
        </span>
      </button>
      {open ? (
        <div id={menuId} className={styles.panel} role="menu">
          <p className={styles.groupLabel}>{labels.services}</p>
          <ul className={styles.list}>
            {services.map((item) => {
              const active = item.id === currentId;
              return (
                <li key={item.id}>
                  <Link
                    href={`/${locale}/servicios/${item.id}`}
                    {...(active ? {} : { transitionTypes: ["nav-forward"] as const })}
                    role="menuitem"
                    className={active ? styles.itemActive : styles.item}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <span>{item.title}</span>
                    {active ? <span aria-hidden="true">●</span> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className={styles.divider} />
          <Link
            href={`/${locale}`}
            transitionTypes={["nav-back"]}
            role="menuitem"
            className={styles.home}
            onClick={() => setOpen(false)}
          >
            ← {labels.returnHome}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
