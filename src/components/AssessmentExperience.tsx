"use client";

import Link from "next/link";
import { useRef, useState, ViewTransition, type FormEvent } from "react";
import { BrandMark } from "@/components/BrandMark";
import type { Dictionary } from "@/content/dictionary";
import { ONTRACK_EMAIL, ONTRACK_PHONE_TEL, whatsAppHref } from "@/content/media";
import type { Locale } from "@/lib/i18n";
import styles from "./AssessmentExperience.module.css";

type Props = {
  locale: Locale;
  dict: Dictionary;
  initialService: string;
  initialCompany: string;
};

export function AssessmentExperience({
  locale,
  dict,
  initialService,
  initialCompany,
}: Props) {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [service, setService] = useState(initialService);
  const [companyType, setCompanyType] = useState(initialCompany);
  const [brief, setBrief] = useState({
    industry: "",
    team: "",
    timing: "",
    context: "",
    name: "",
    company: "",
    email: "",
    phone: "",
  });
  const formRef = useRef<HTMLFormElement>(null);
  const isSpanish = locale === "es";
  const copy = isSpanish
    ? {
        back: "Volver a OnTrack",
        label: "Preparación de reunión",
        title: "Preparemos la reunión.",
        support:
          "Comparta lo esencial. El equipo OnTrack llegará preparado.",
        steps: ["Operación", "Prioridad", "Contacto"],
        companyType: "Tipo de empresa",
        local: "Empresa local",
        international: "Internacional / zona franca",
        early: "Nueva o en crecimiento",
        industry: "Industria o actividad principal",
        team: "Rango de colaboradores",
        service: "Servicio de interés",
        timing: "Momento de la necesidad",
        now: "Este mes",
        planning: "Estoy planificando",
        ongoing: "Busco un aliado continuo",
        context: "¿Qué le gustaría que OnTrack conozca antes de la reunión?",
        name: "Nombre",
        email: "Correo",
        phone: "Teléfono",
        company: "Empresa",
        next: "Continuar",
        previous: "Atrás",
        submit: "Enviar preparación",
        sentTitle: "Preparación recibida.",
        sent:
          "El equipo de OnTrack revisará la información y responderá durante el día hábil para coordinar el siguiente paso.",
        error:
          "No fue posible enviar la preparación. Puede contactar a OnTrack por WhatsApp, teléfono o correo.",
        alternate: "¿Prefiere otro canal?",
        whatsapp: "WhatsApp",
        call: "Llamar",
        emailLink: "Escribir por correo",
        summary: "Resumen para OnTrack",
      }
    : {
        back: "Back to OnTrack",
        label: "Meeting preparation",
        title: "Prepare the meeting.",
        support:
          "Share the essentials. The OnTrack team will arrive prepared.",
        steps: ["Operation", "Priority", "Contact"],
        companyType: "Company type",
        local: "Local business",
        international: "International / free zone",
        early: "New or growing",
        industry: "Primary industry or activity",
        team: "Employee range",
        service: "Service of interest",
        timing: "Timing of the need",
        now: "This month",
        planning: "I am planning",
        ongoing: "I need an ongoing partner",
        context: "What would you like OnTrack to know before the meeting?",
        name: "Name",
        email: "Email",
        phone: "Phone",
        company: "Company",
        next: "Continue",
        previous: "Back",
        submit: "Send preparation",
        sentTitle: "Preparation received.",
        sent:
          "The OnTrack team will review the information and reply during the business day to coordinate the next step.",
        error:
          "We could not send the preparation. You can contact OnTrack by WhatsApp, phone, or email.",
        alternate: "Prefer another channel?",
        whatsapp: "WhatsApp",
        call: "Call",
        emailLink: "Email us",
        summary: "OnTrack brief",
      };

  const selected = dict.services.items.find((item) => item.id === service) ?? dict.services.items[0];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: brief.name,
          email: brief.email,
          phone: brief.phone,
          company: brief.company,
          service: selected.title,
          companyType,
          urgency: brief.timing,
          industry: brief.industry,
          team: brief.team,
          context: brief.context,
          message: [
            `Industry: ${brief.industry || "—"}`,
            `Employee range: ${brief.team || "—"}`,
            `Meeting context: ${brief.context || "—"}`,
          ].join("\n"),
          source: "assessment",
        }),
      });
      if (!response.ok) throw new Error("Assessment delivery failed.");
      const result = (await response.json()) as {
        delivery?: "client";
        notifyUrl?: string;
        notifyPayload?: Record<string, string>;
      };
      if (result.delivery === "client" && result.notifyUrl && result.notifyPayload) {
        const notify = await fetch(result.notifyUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(result.notifyPayload),
        });
        if (!notify.ok) throw new Error("Assessment fallback delivery failed.");
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  function nextStep() {
    if (formRef.current?.reportValidity()) setStep(step + 1);
  }

  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
    <main className={styles.page}>
      <header className={styles.nav}>
        <Link href={`/${locale}`} aria-label="OnTrack">
          <BrandMark height={34} />
        </Link>
        <Link href={`/${locale}#path`} transitionTypes={["nav-back"]} className={styles.back}>
          ← {copy.back}
        </Link>
      </header>
      <div className={styles.shell}>
        <section className={styles.intro}>
          <p className={styles.eyebrow}>{copy.label}</p>
          <h1>{copy.title}</h1>
          <p>{copy.support}</p>
          <dl className={styles.summary}>
            <dt>{copy.summary}</dt>
            <dd>{selected.title}</dd>
          </dl>
        </section>
        <section className={styles.workspace}>
          <ol className={styles.steps} aria-label={copy.label}>
            {copy.steps.map((label, index) => (
              <li key={label} className={step === index + 1 ? styles.stepActive : undefined}>
                <span>0{index + 1}</span>
                {label}
              </li>
            ))}
          </ol>
          {status === "sent" ? (
            <div className={styles.complete} role="status">
              <p className={styles.eyebrow}>OnTrack</p>
              <h2>{copy.sentTitle}</h2>
              <p>{copy.sent}</p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={submit}>
              {step === 1 ? (
                <div className={styles.formStep}>
                  <fieldset>
                    <legend>{copy.companyType}</legend>
                    <div className={styles.choiceGrid}>
                      {[
                        ["local", copy.local],
                        ["international", copy.international],
                        ["early", copy.early],
                      ].map(([value, label]) => (
                        <button
                          type="button"
                          key={value}
                          className={companyType === value ? styles.choiceActive : styles.choice}
                          onClick={() => setCompanyType(value)}
                          aria-pressed={companyType === value}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <label>
                    {copy.industry}
                    <input
                      name="industry"
                      required
                      autoComplete="organization-title"
                      value={brief.industry}
                      onChange={(event) => setBrief({ ...brief, industry: event.target.value })}
                    />
                  </label>
                  <label>
                    {copy.team}
                    <select
                      name="team"
                      required
                      value={brief.team}
                      onChange={(event) => setBrief({ ...brief, team: event.target.value })}
                    >
                      <option value="" disabled>
                        —
                      </option>
                      <option>1–10</option>
                      <option>11–50</option>
                      <option>51–200</option>
                      <option>200+</option>
                    </select>
                  </label>
                </div>
              ) : null}
              {step === 2 ? (
                <div className={styles.formStep}>
                  <label>
                    {copy.service}
                    <select value={service} onChange={(event) => setService(event.target.value)}>
                      {dict.services.items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    {copy.timing}
                    <select
                      name="timing"
                      required
                      value={brief.timing}
                      onChange={(event) => setBrief({ ...brief, timing: event.target.value })}
                    >
                      <option value="" disabled>
                        —
                      </option>
                      <option>{copy.now}</option>
                      <option>{copy.planning}</option>
                      <option>{copy.ongoing}</option>
                    </select>
                  </label>
                  <label>
                    {copy.context}
                    <textarea
                      name="context"
                      rows={5}
                      required
                      value={brief.context}
                      onChange={(event) => setBrief({ ...brief, context: event.target.value })}
                    />
                  </label>
                </div>
              ) : null}
              {step === 3 ? (
                <div className={styles.formStep}>
                  <label>
                    {copy.name}
                    <input
                      name="name"
                      required
                      autoComplete="name"
                      value={brief.name}
                      onChange={(event) => setBrief({ ...brief, name: event.target.value })}
                    />
                  </label>
                  <label>
                    {copy.company}
                    <input
                      name="company"
                      required
                      autoComplete="organization"
                      value={brief.company}
                      onChange={(event) => setBrief({ ...brief, company: event.target.value })}
                    />
                  </label>
                  <label>
                    {copy.email}
                    <input
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={brief.email}
                      onChange={(event) => setBrief({ ...brief, email: event.target.value })}
                    />
                  </label>
                  <label>
                    {copy.phone}
                    <input
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={brief.phone}
                      onChange={(event) => setBrief({ ...brief, phone: event.target.value })}
                    />
                  </label>
                </div>
              ) : null}
              <div className={styles.actions}>
                {step > 1 ? (
                  <button type="button" className={styles.secondary} onClick={() => setStep(step - 1)}>
                    {copy.previous}
                  </button>
                ) : null}
                {step < 3 ? (
                  <button type="button" className="btn btn-primary" onClick={nextStep}>
                    {copy.next}
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
                    {status === "sending" ? "…" : copy.submit}
                  </button>
                )}
              </div>
              {status === "error" ? <p className={styles.error}>{copy.error}</p> : null}
            </form>
          )}
          <div className={styles.alternate}>
            <span>{copy.alternate}</span>
            <a href={whatsAppHref()} target="_blank" rel="noopener noreferrer">
              {copy.whatsapp}
            </a>
            <a href={`tel:${ONTRACK_PHONE_TEL}`}>{copy.call}</a>
            <a href={`mailto:${ONTRACK_EMAIL}`}>{copy.emailLink}</a>
          </div>
        </section>
      </div>
    </main>
    </ViewTransition>
  );
}
