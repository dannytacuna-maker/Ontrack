"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { BrandMark } from "@/components/BrandMark";
import { HeroReel } from "@/components/experience/HeroReel";
import {
  CursorBlock,
  PhotoPop,
} from "@/components/portfolio/CursorBlock";
import type { Dictionary } from "@/content/dictionary";
import {
  ADDRESS,
  mapsEmbed,
  mapsLink,
  ONTRACK_EMAIL,
  ONTRACK_PHONE_DISPLAY,
  ONTRACK_PHONE_TEL,
  ONTRACK_WHATSAPP_DISPLAY,
  PARTNERS,
  wazeLink,
  whatsAppHref,
} from "@/content/media";
import type { Locale } from "@/lib/i18n";
import styles from "./OnTrackExperience.module.css";

const SCROLL_KEY = "ontrack-scroll-y";
const HERO_WATCH_MS = 5000;

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export function OnTrackExperience({ locale, dict }: Props) {
  const router = useRouter();
  const [contactStatus, setContactStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [heroCollapsed, setHeroCollapsed] = useState(false);
  const [heroWatching, setHeroWatching] = useState(false);
  const [navOnLight, setNavOnLight] = useState(false);
  const [navSolid, setNavSolid] = useState(false);
  const [navProgress, setNavProgress] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const [servicePath, setServicePath] = useState(dict.services.items[0].id);
  const [companyType, setCompanyType] = useState("local");
  const heroIdleTimer = useRef<number | null>(null);
  const heroCollapsedRef = useRef(false);
  const stickyNavRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLElement>(null);

  function clearHeroIdle() {
    if (heroIdleTimer.current != null) {
      window.clearTimeout(heroIdleTimer.current);
      heroIdleTimer.current = null;
    }
  }

  function armHeroIdle() {
    clearHeroIdle();
    setHeroWatching(false);
    heroIdleTimer.current = window.setTimeout(() => {
      if (!heroCollapsedRef.current && window.scrollY < 48) {
        setHeroWatching(true);
      }
    }, HERO_WATCH_MS);
  }

  useEffect(() => {
    const onScroll = () => {
      const nearTop = window.scrollY < 48;
      const collapsed = window.scrollY >= window.innerHeight - 4;
      heroCollapsedRef.current = collapsed;
      setHeroCollapsed(collapsed);

      const stickyNav = stickyNavRef.current;
      const navBottom = stickyNav ? stickyNav.getBoundingClientRect().bottom : 72;
      const portfolio = portfolioRef.current;
      const heroPinned = portfolio
        ? portfolio.getBoundingClientRect().top > navBottom - 2
        : window.scrollY < window.innerHeight - navBottom;
      const solid = window.scrollY > 24;
      setNavSolid(solid);

      if (stickyNav && solid) {
        if (heroPinned) {
          // Over the reel the bar reads as a light plate once scrolling starts.
          setNavOnLight(true);
        } else {
          const bands = document.querySelectorAll<HTMLElement>("[data-nav-theme='light']");
          let onLight = false;
          bands.forEach((bandEl) => {
            const band = bandEl.getBoundingClientRect();
            if (band.top < navBottom - 4 && band.bottom > navBottom - 12) {
              onLight = true;
            }
          });
          setNavOnLight(onLight);
        }
      } else {
        setNavOnLight(false);
      }

      const doc = document.documentElement;
      const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
      setNavProgress(Math.min(1, Math.max(0, window.scrollY / maxScroll)));

      if (!nearTop) {
        setHeroWatching(false);
        clearHeroIdle();
        return;
      }
      if (!heroIdleTimer.current) armHeroIdle();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // This listener intentionally mounts once; its callbacks read current DOM/ref state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const raw = sessionStorage.getItem(SCROLL_KEY);
    if (!raw) return;
    sessionStorage.removeItem(SCROLL_KEY);
    const y = Number(raw);
    if (!Number.isFinite(y)) return;
    requestAnimationFrame(() => {
      window.scrollTo({ top: y, behavior: "auto" });
    });
  }, [locale]);

  function goToSection(
    event: ReactMouseEvent<HTMLAnchorElement>,
    hash: string,
  ) {
    const target = document.getElementById(hash.slice(1));
    if (!target) return;
    event.preventDefault();
    setNavOpen(false);
    const navHeight = stickyNavRef.current?.getBoundingClientRect().height ?? 68;
    const top = window.scrollY + target.getBoundingClientRect().top - navHeight;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    window.history.replaceState(null, "", hash);
  }

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      const node = stickyNavRef.current;
      if (node && !node.contains(event.target as Node)) setNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [navOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) setNavOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function switchLocale(next: Locale) {
    if (next === locale) return;
    sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    router.push(`/${next}`);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setContactStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
          source: "contact",
        }),
      });
      if (!response.ok) throw new Error("Contact form failed.");
      event.currentTarget.reset();
      setContactStatus("sent");
    } catch {
      setContactStatus("error");
    }
  }

  const waHref = whatsAppHref(dict.contact.whatsappMessage);
  const serviceRows = [
    dict.services.items.slice(0, 3),
    dict.services.items.slice(3, 6),
  ];
  const selectedService =
    dict.services.items.find((item) => item.id === servicePath) ??
    dict.services.items[0];
  const copy =
    locale === "es"
      ? {
          pathEyebrow: "Encuentre su ruta",
          pathTitle: "Empiece por la necesidad que necesita resolver.",
          pathSupport:
            "Una orientación inicial para estructurar una conversación más útil con el equipo OnTrack.",
          companyLabel: "Su empresa es",
          local: "Empresa local",
          international: "Internacional / zona franca",
          early: "Nueva o en crecimiento",
          needLabel: "La prioridad es",
          recommendation: "Ruta recomendada",
          profile: "Perfil de operación",
          scope: "Alcance inicial",
          briefing:
            "Esta selección se incorporará a su solicitud para que la primera reunión parta de un contexto claro.",
          pathDetail: "Ver detalle del servicio",
          pathContact: "Continuar con esta ruta",
          phone: "Llamar a OnTrack",
          email: "Escribir al equipo",
          sending: "Enviando…",
          sent: "Solicitud recibida. El equipo de OnTrack le responderá durante el día hábil.",
          error: "No fue posible enviar la solicitud. Escríbanos por WhatsApp, correo o teléfono.",
          phoneLabel: "Teléfono",
          serviceLabel: "Servicio de interés",
          urgencyLabel: "¿Cuándo necesita apoyo?",
          urgencyNow: "Este mes",
          urgencyPlan: "Estoy planificando",
          urgencyOngoing: "Busco un aliado continuo",
        }
      : {
          pathEyebrow: "Find your service path",
          pathTitle: "Start with the need you need to solve.",
          pathSupport:
            "An initial orientation to structure a more useful conversation with the OnTrack team.",
          companyLabel: "Your company is",
          local: "Local business",
          international: "International / free zone",
          early: "New or growing",
          needLabel: "The priority is",
          recommendation: "Recommended path",
          profile: "Operating profile",
          scope: "Initial scope",
          briefing:
            "This selection will be carried into your request so the first meeting starts with clear context.",
          pathDetail: "View service detail",
          pathContact: "Continue with this path",
          phone: "Call OnTrack",
          email: "Email the team",
          sending: "Sending…",
          sent: "Request received. The OnTrack team will reply during the business day.",
          error: "We could not send your request. Contact us by WhatsApp, email, or phone.",
          phoneLabel: "Phone",
          serviceLabel: "Service of interest",
          urgencyLabel: "When do you need support?",
          urgencyNow: "This month",
          urgencyPlan: "I am planning",
          urgencyOngoing: "I need an ongoing partner",
        };
  const companyProfile =
    companyType === "international"
      ? {
          label: copy.international,
          recommendation: "freezone",
        }
      : companyType === "early"
        ? {
            label: copy.early,
            recommendation: "einvoice",
          }
        : {
            label: copy.local,
            recommendation: "accounting",
          };

  return (
    <div className={styles.page}>
      <div
        ref={stickyNavRef}
        className={`${styles.stickyNav} ${navSolid ? styles.stickyNavSolid : styles.stickyNavClear} ${navOnLight ? styles.stickyNavLight : ""} ${navOpen ? styles.stickyNavOpen : ""}`}
        style={{ ["--nav-progress" as string]: String(navProgress) }}
      >
        <div className={styles.stickyNavInner}>
          <a
            href="#about"
            className={styles.navBrand}
            aria-label="OnTrack"
            onClick={(event) => {
              event.preventDefault();
              setNavOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
              window.history.replaceState(null, "", window.location.pathname);
            }}
          >
            <BrandMark
              height={40}
              className={styles.navLogo}
              tone={navOnLight ? "onLight" : "onDark"}
            />
          </a>
          <nav
            id="primary-nav"
            className={styles.navLinks}
            aria-label="Primary"
          >
            <a href="#about" onClick={(event) => goToSection(event, "#about")}>
              {dict.nav.about}
            </a>
            <a href="#why" onClick={(event) => goToSection(event, "#why")}>
              {dict.nav.why}
            </a>
            <a href="#services" onClick={(event) => goToSection(event, "#services")}>
              {dict.nav.services}
            </a>
            <a href="#contact" onClick={(event) => goToSection(event, "#contact")}>
              {dict.nav.contact}
            </a>
          </nav>
          <div className={styles.navEnd}>
            <div className={styles.langSwitch} role="group" aria-label="Language">
              <button
                type="button"
                className={`${styles.langBtn} ${locale === "es" ? styles.langBtnActive : ""}`}
                onClick={() => switchLocale("es")}
                aria-pressed={locale === "es"}
              >
                ES
              </button>
              <button
                type="button"
                className={`${styles.langBtn} ${locale === "en" ? styles.langBtnActive : ""}`}
                onClick={() => switchLocale("en")}
                aria-pressed={locale === "en"}
              >
                EN
              </button>
            </div>
            <button
              type="button"
              className={styles.navMenuBtn}
              aria-label={navOpen ? "Close menu" : "Open menu"}
              aria-expanded={navOpen}
              aria-controls="primary-nav"
              onClick={() => setNavOpen((open) => !open)}
            >
              <span className={styles.navMenuLine} />
              <span className={styles.navMenuLine} />
              <span className={styles.navMenuLine} />
            </button>
          </div>
        </div>
        <div className={styles.navProgress} aria-hidden="true">
          <span className={styles.navProgressBar} />
        </div>
      </div>

      <section className={styles.hero} aria-label="OnTrack">
        <HeroReel />

        <div
          className={`${styles.heroContent} ${heroWatching ? styles.heroContentWatching : ""}`}
          onPointerEnter={armHeroIdle}
          onPointerDown={armHeroIdle}
          onFocusCapture={armHeroIdle}
        >
          <h1 className={styles.srOnly}>{dict.hero.headline}</h1>
          <BrandMark height={168} priority className={styles.heroLogo} />
          <p className={styles.support}>{dict.hero.support}</p>
          <div className={styles.actions}>
            <a
              href="#path"
              className={`btn btn-primary ${styles.heroCta}`}
              onClick={(event) => goToSection(event, "#path")}
            >
              <span className={styles.heroCtaLabel}>{copy.pathContact}</span>
            </a>
            <a
              href="#contact"
              className={`btn btn-ghost ${styles.heroCta}`}
              onClick={(event) => goToSection(event, "#contact")}
            >
              <span className={styles.heroCtaLabel}>{dict.hero.ctaPrimary}</span>
            </a>
          </div>
          <p className={styles.scrollHint}>{dict.hero.scrollHint}</p>
        </div>
      </section>

      <main className={styles.portfolio} ref={portfolioRef}>
        <div className={styles.lightBand} data-nav-theme="light">
          <div className={styles.lightBandInner}>
            <section id="about" className={`${styles.section} ${styles.aboutSection}`}>
              <div className={styles.aboutSplit}>
                <PhotoPop className={styles.aboutPortrait}>
                  <div className={styles.aboutPortraitFrame}>
                    <Image
                      src="/photos/about-portrait.jpg"
                      alt={
                        locale === "es"
                          ? "Equipo profesional de OnTrack"
                          : "OnTrack professional team"
                      }
                      fill
                      quality={100}
                      priority
                      className="object-cover object-[center_38%]"
                      sizes="(max-width: 900px) 92vw, 38rem"
                    />
                  </div>
                </PhotoPop>

                <div className={styles.aboutCopy}>
                  <header className={styles.sectionHead}>
                    <p className={styles.eyebrow}>{dict.about.eyebrow}</p>
                    <h2 className={styles.title}>{dict.about.headline}</h2>
                    <p className={styles.copy}>{dict.about.support}</p>
                  </header>

                  <div className={styles.statRow}>
                    {dict.stats.map((stat) => (
                      <div key={stat.label} className={styles.aboutStat}>
                        <div className={styles.stat}>
                          <strong>{stat.value}</strong>
                          <span>{stat.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section id="why" className={styles.section}>
              <header className={styles.sectionHead}>
                <p className={styles.eyebrow}>{dict.why.eyebrow}</p>
                <h2 className={styles.title}>{dict.why.headline}</h2>
                <p className={styles.copy}>{dict.why.support}</p>
              </header>
              <ol className={styles.processSteps}>
                {dict.why.points.map((point, index) => (
                  <li key={point.title} className={styles.processStep}>
                    <PhotoPop delayMs={index * 80} className={styles.processCardPop}>
                      <article className={styles.processCard}>
                        <div className={styles.processCardMedia}>
                          <Image
                            src={
                              index === 0
                                ? "/photos/why-01.jpg"
                                : index === 1
                                  ? "/photos/why-02.jpg"
                                  : "/photos/why-03.jpg"
                            }
                            alt={
                              index === 0
                                ? locale === "es"
                                  ? "Reunión de trabajo del equipo"
                                  : "Team working meeting"
                                : index === 1
                                  ? locale === "es"
                                    ? "Sala de juntas en Santa Ana"
                                    : "Boardroom in Santa Ana"
                                  : locale === "es"
                                    ? "Oficina de atención profesional"
                                    : "Professional services office"
                            }
                            fill
                            quality={100}
                            unoptimized
                            className="object-cover object-center"
                            sizes="(max-width: 900px) 92vw, 480px"
                          />
                          <span className={styles.processCardNum} aria-hidden="true">
                            0{index + 1}
                          </span>
                        </div>
                        <div className={styles.processCardCopy}>
                          <h3>{point.title}</h3>
                          <p>{point.body}</p>
                        </div>
                      </article>
                    </PhotoPop>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>

        <div className={styles.portfolioInner}>
          <section id="services" className={styles.section}>
            <header className={styles.sectionHead}>
              <p className={styles.eyebrow}>{dict.services.eyebrow}</p>
              <h2 className={styles.title}>{dict.services.headline}</h2>
              <p className={styles.copy}>{dict.services.support}</p>
            </header>

            <div className={styles.serviceBoard}>
              {serviceRows.map((row, rowIndex) => (
                <ol
                  key={rowIndex === 0 ? "services-row-a" : "services-row-b"}
                  className={styles.serviceRow}
                >
                  {row.map((item, rowItemIndex) => {
                    const index =
                      rowIndex === 0 ? rowItemIndex : rowItemIndex + 3;
                    return (
                      <li key={item.id} id={item.id} className={styles.serviceItem}>
                        <article className={styles.serviceCard} tabIndex={0}>
                          <div className={styles.serviceTop}>
                            <span className={styles.serviceNum}>
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <h3>{item.title}</h3>
                          </div>
                          <div className={styles.serviceExpand}>
                            <div>
                              <p className={styles.serviceLead}>{item.body}</p>
                              <p className={styles.serviceDetailCopy}>
                                {item.detail}
                              </p>
                              <Link
                                href={`/${locale}/servicios/${item.id}`}
                                transitionTypes={["nav-forward"]}
                                className={styles.serviceMore}
                              >
                                {dict.services.learnMore}
                                <span aria-hidden="true">→</span>
                              </Link>
                            </div>
                          </div>
                          <span className={styles.serviceArrow} aria-hidden="true">
                            →
                          </span>
                        </article>
                      </li>
                    );
                  })}
                </ol>
              ))}
            </div>
          </section>

          <section id="path" className={`${styles.section} ${styles.servicePath}`}>
            <header className={styles.sectionHead}>
              <p className={styles.eyebrow}>{copy.pathEyebrow}</p>
              <h2 className={styles.title}>{copy.pathTitle}</h2>
              <p className={styles.copy}>{copy.pathSupport}</p>
            </header>
            <div className={styles.pathGrid}>
              <div className={styles.pathControls} aria-label={copy.pathEyebrow}>
                <fieldset className={styles.pathFieldset}>
                  <legend>
                    <span>01</span>
                    {copy.companyLabel}
                  </legend>
                  <div className={styles.pathOptions}>
                    {[
                      ["local", copy.local],
                      ["international", copy.international],
                      ["early", copy.early],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        className={companyType === value ? styles.pathOptionActive : styles.pathOption}
                        onClick={() => {
                          setCompanyType(value);
                          setServicePath(
                            value === "international"
                              ? "freezone"
                              : value === "early"
                                ? "einvoice"
                                : "accounting",
                          );
                        }}
                        aria-pressed={companyType === value}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <fieldset className={styles.pathFieldset}>
                  <legend>
                    <span>02</span>
                    {copy.needLabel}
                  </legend>
                  <div className={styles.pathOptions}>
                    {dict.services.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={servicePath === item.id ? styles.pathOptionActive : styles.pathOption}
                        onClick={() => setServicePath(item.id)}
                        aria-pressed={servicePath === item.id}
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>
              <aside className={styles.pathResult}>
                <div className={styles.pathResultTop}>
                  <p className={styles.eyebrow}>{copy.recommendation}</p>
                  <span>{String(dict.services.items.indexOf(selectedService) + 1).padStart(2, "0")}</span>
                </div>
                <h3>{selectedService.title}</h3>
                <p>{selectedService.body}</p>
                <dl className={styles.pathBrief}>
                  <div>
                    <dt>{copy.profile}</dt>
                    <dd>{companyProfile.label}</dd>
                  </div>
                  <div>
                    <dt>{copy.scope}</dt>
                    <dd>{selectedService.bullets.slice(0, 2).join(" · ")}</dd>
                  </div>
                </dl>
                <p className={styles.pathBriefing}>{copy.briefing}</p>
                <div className={styles.pathActions}>
                  <Link
                    href={`/${locale}/servicios/${selectedService.id}`}
                    transitionTypes={["nav-forward"]}
                    className={styles.serviceMore}
                  >
                    {copy.pathDetail}<span aria-hidden="true">→</span>
                  </Link>
                  <Link
                    href={`/${locale}/assessment?service=${selectedService.id}&company=${companyType}`}
                    transitionTypes={["nav-forward"]}
                    className={`btn btn-primary ${styles.pathCta}`}
                  >
                    {copy.pathContact}
                  </Link>
                </div>
              </aside>
            </div>
          </section>
        </div>

        <div className={styles.portfolioInner}>
          <section id="place" className={styles.section}>
            <header className={styles.sectionHead}>
              <p className={styles.eyebrow}>{dict.place.eyebrow}</p>
              <h2 className={styles.title}>{dict.place.headline}</h2>
              <p className={styles.copy}>{dict.place.support}</p>
            </header>

            <article className={styles.director}>
              <PhotoPop>
                <figure className={styles.directorFigure}>
                  <div className={styles.directorFrame}>
                    <Image
                      src="/photos/shirley.jpg"
                      alt={
                        locale === "es"
                          ? "Shirley Solís, fundadora y directora de OnTrack"
                          : "Shirley Solís, founder and director of OnTrack"
                      }
                      fill
                      quality={100}
                      className="object-cover object-[center_18%]"
                      sizes="(max-width: 900px) 100vw, 48vw"
                    />
                  </div>
                </figure>
              </PhotoPop>
              <div className={styles.directorCopy}>
                <p className={styles.directorRole}>{dict.place.personRole}</p>
                <h3 className={styles.directorName}>{dict.place.personName}</h3>
                <p className={styles.directorBio}>{dict.place.personBio}</p>
                <div className={styles.directorActions}>
                  <a
                    href={`mailto:${ONTRACK_EMAIL}`}
                    className={styles.directorAction}
                  >
                    <span>{ONTRACK_EMAIL}</span>
                  </a>
                </div>
              </div>
            </article>

            <div className={styles.teamBlock}>
              <p className={styles.eyebrow}>{dict.place.teamLabel}</p>
              <div className={styles.teamGallery}>
                <PhotoPop delayMs={80}>
                  <figure>
                    <div className={styles.teamShot}>
                      <Image
                        src="/photos/team-boardroom.jpg"
                        alt={
                          locale === "es"
                            ? "Equipo OnTrack en la sala de juntas de Santa Ana"
                            : "OnTrack team in the Santa Ana boardroom"
                        }
                        fill
                        quality={100}
                        className="object-cover object-[center_45%]"
                        sizes="(max-width: 900px) 100vw, 36vw"
                      />
                    </div>
                  </figure>
                </PhotoPop>
                <PhotoPop delayMs={160}>
                  <figure>
                    <div className={styles.teamShot}>
                      <Image
                        src="/photos/team-floor.jpg"
                        alt={
                          locale === "es"
                            ? "Equipo OnTrack en el piso de operaciones"
                            : "OnTrack team on the operations floor"
                        }
                        fill
                        quality={100}
                        className="object-cover object-[center_48%]"
                        sizes="(max-width: 900px) 100vw, 36vw"
                      />
                    </div>
                  </figure>
                </PhotoPop>
              </div>
            </div>
          </section>
        </div>

        <footer id="contact" className={styles.contactBand} data-nav-theme="light">
          <div className={styles.contactInner}>
            <header className={styles.sectionHead}>
              <p className={styles.eyebrow}>{dict.contact.eyebrow}</p>
              <h2 className={styles.title}>{dict.contact.headline}</h2>
              <p className={styles.copy}>{dict.contact.support}</p>
            </header>

            <div className={styles.bookingCtaBand}>
              <div>
                <p className={styles.eyebrow}>WhatsApp</p>
                <h3 className={styles.bookingCtaTitle}>{dict.contact.whatsappCta}</h3>
                <p className={styles.bookingCtaCopy}>{ONTRACK_WHATSAPP_DISPLAY}</p>
              </div>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-primary ${styles.contactBtn}`}
              >
                <svg
                  className={styles.contactBtnIcon}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
                {dict.contact.whatsappCta}
              </a>
            </div>

            <div className={styles.contactGrid}>
              <div className={styles.contactAside}>
                <div className={styles.mapWrap}>
                  <iframe
                    className={styles.mapFrame}
                    title={dict.place.mapsLabel}
                    src={`${mapsEmbed}&hl=${locale}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className={styles.mapActions}>
                    <a
                      href={mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.mapActionMaps}
                    >
                      {dict.place.mapsCta}
                    </a>
                    <a
                      href={wazeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.mapActionWaze}
                    >
                      {dict.place.wazeCta}
                    </a>
                  </div>
                </div>

                <dl className={styles.meta}>
                  <div>
                    <dt>{dict.place.addressLabel}</dt>
                    <dd>
                      <a href={mapsLink} target="_blank" rel="noopener noreferrer">
                        {ADDRESS}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>{dict.place.phoneLabel}</dt>
                    <dd>
                      <a href={`tel:${ONTRACK_PHONE_TEL}`}>
                        {dict.place.callLabel} · {ONTRACK_PHONE_DISPLAY}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>{dict.place.emailLabel}</dt>
                    <dd>
                      <a href={`mailto:${ONTRACK_EMAIL}`}>{ONTRACK_EMAIL}</a>
                    </dd>
                  </div>
                </dl>
              </div>

              <form className={styles.form} onSubmit={onSubmit}>
                <div className={styles.formRow}>
                  <label className={styles.field}>
                    {dict.contact.form.name}
                    <input
                      required
                      name="name"
                      className={styles.input}
                      autoComplete="name"
                    />
                  </label>
                  <label className={styles.field}>
                    {dict.contact.form.phone}
                    <input
                      name="phone"
                      type="tel"
                      className={styles.input}
                      autoComplete="tel"
                    />
                  </label>
                </div>
                <label className={styles.field}>
                  {dict.contact.form.email}
                  <input
                    required
                    type="email"
                    name="email"
                    className={styles.input}
                    autoComplete="email"
                  />
                </label>
                <label className={styles.field}>
                  {dict.contact.form.message}
                  <textarea
                    required
                    name="message"
                    className={styles.input}
                    rows={4}
                  />
                </label>
                <div className={styles.actions}>
                  <button
                    type="submit"
                    className={`btn btn-primary ${styles.contactBtn}`}
                    disabled={contactStatus === "sending"}
                  >
                    {contactStatus === "sending" ? copy.sending : dict.contact.form.submit}
                  </button>
                  {contactStatus === "sent" ? <p className={styles.formNote}>{copy.sent}</p> : null}
                  {contactStatus === "error" ? <p className={styles.formNote}>{copy.error}</p> : null}
                </div>
                <div className={styles.contactMethods}>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactMethodWhatsapp}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${ONTRACK_PHONE_TEL}`}
                    className={styles.contactMethodPhone}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.5 5.5c0-1.1.9-2 2-2h2.2c.8 0 1.5.5 1.8 1.2l1.1 2.6c.3.7.1 1.5-.5 2l-1.2 1.1a12.5 12.5 0 0 0 5.2 5.2l1.1-1.2c.5-.6 1.3-.8 2-.5l2.6 1.1c.7.3 1.2 1 1.2 1.8V19c0 1.1-.9 2-2 2C9.9 21 3 14.1 3 5.5z"
                      />
                    </svg>
                    {copy.phone}
                  </a>
                  <a
                    href={`mailto:${ONTRACK_EMAIL}`}
                    className={styles.contactMethodEmail}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 7.5 7.5 5.5 7.5-5.5" />
                    </svg>
                    {copy.email}
                  </a>
                </div>
              </form>
            </div>

            <div className={styles.footerBar}>
              <div>
                <BrandMark height={36} tone="onLight" />
                <p className={styles.formNote}>{dict.footer.tagline}</p>
                <p className={styles.formNote}>{dict.footer.alliance}</p>
              </div>
              <div className={styles.footerPartners} aria-label="SSC and FaycaTax">
                <a
                  href={PARTNERS.ssc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={PARTNERS.ssc.name}
                >
                  <Image
                    src="/partners/ssc-mark.png"
                    alt="SSC"
                    width={506}
                    height={143}
                  />
                </a>
                <a
                  href={PARTNERS.faycatax.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={PARTNERS.faycatax.name}
                >
                  <Image
                    src="/partners/faycatax.png"
                    alt="FaycaTax"
                    width={816}
                    height={337}
                  />
                </a>
              </div>
              <p className={styles.formNote}>
                © {new Date().getFullYear()} {dict.footer.rights}
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
