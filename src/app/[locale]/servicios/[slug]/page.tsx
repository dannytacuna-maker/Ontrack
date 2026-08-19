import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { BrandMark } from "@/components/BrandMark";
import { ServiceNavMenu } from "@/components/ServiceNavMenu";
import { getDictionary } from "@/content/dictionary";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import styles from "./service.module.css";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getDictionary(locale).services.items.map((service) => ({
      locale,
      slug: service.id,
    })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const service = getDictionary(rawLocale).services.items.find(
    (item) => item.id === slug,
  );
  if (!service) return {};
  return {
    title: `${service.title} | OnTrack`,
    description: service.detail,
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const service = dict.services.items.find((item) => item.id === slug);
  if (!service) notFound();

  const copy =
    locale === "es"
      ? {
          menu: "Servicios",
          menuServices: "Cambiar de servicio",
          returnHome: "Volver al sitio",
          label: "Servicio OnTrack",
          heading: "Alcance de trabajo",
          included: "Este servicio incluye",
          related: "También podría necesitar",
          assessment: "Solicitar una evaluación",
          contact: "Hablar por WhatsApp",
          for: "Para empresas que necesitan",
          firstConversation: "Primera conversación",
          delivery: "Qué organizamos",
          scrollHint: "Deslizar para más información",
          serviceImage: `Equipo OnTrack trabajando en ${service.title}`,
        }
      : {
          menu: "Services",
          menuServices: "Switch service",
          returnHome: "Return to site",
          label: "OnTrack service",
          heading: "Working scope",
          included: "This service includes",
          related: "You may also need",
          assessment: "Request an assessment",
          contact: "Chat on WhatsApp",
          for: "For companies that need",
          firstConversation: "First conversation",
          delivery: "What we organize",
          scrollHint: "Scroll for more information",
          serviceImage: `OnTrack team working on ${service.title}`,
        };

  const related = dict.services.items.filter((item) => item.id !== service.id).slice(0, 3);
  const serviceBriefs = locale === "es"
    ? {
        accounting: {
          for: "Orden y visibilidad sobre la información financiera de su operación.",
          delivery: "Contabilidad general, costos y reportes financieros con un ritmo de trabajo definido.",
          conversation: "Revisamos la estructura actual, las fuentes de información y los reportes que su empresa necesita.",
        },
        payroll: {
          for: "Una planilla puntual, con deducciones, reportes y obligaciones bien coordinadas.",
          delivery: "Cálculo, archivos de banca electrónica, reportes CCSS e INS, aguinaldos y liquidaciones.",
          conversation: "Entendemos su ciclo de pago, tamaño de equipo y responsabilidades de cumplimiento.",
        },
        "tax-cr": {
          for: "Cumplimiento tributario y criterio para decisiones de corto y largo plazo.",
          delivery: "Presentaciones, seguimiento de obligaciones y acompañamiento tributario según la necesidad.",
          conversation: "Identificamos el giro del negocio, obligaciones actuales y el calendario de cumplimiento.",
        },
        einvoice: {
          for: "Emisión electrónica conectada con las cuentas por cobrar de su empresa.",
          delivery: "Activación con proveedor, emisión por giro de negocio, conciliación y reportes periódicos.",
          conversation: "Revisamos el volumen de facturación, el flujo comercial y la solución que utiliza hoy.",
        },
        freezone: {
          for: "Operaciones bajo zona franca que requieren disciplina documental y reportes formales.",
          delivery: "Obligaciones mensuales, auxiliares de activos, informe anual y acompañamiento PROCOMER.",
          conversation: "Revisamos la etapa de su operación, activos, registros disponibles y próximos vencimientos.",
        },
        audit: {
          for: "Una revisión objetiva de información financiera u operativa en áreas de riesgo relevantes.",
          delivery: "Auditorías financieras y operativas enfocadas en el alcance acordado con su empresa.",
          conversation: "Definimos el objetivo de revisión, periodo, información disponible y personas involucradas.",
        },
      }
    : {
        accounting: {
          for: "Order and visibility across your operation’s financial information.",
          delivery: "General accounting, cost accounting, and financial reporting with a defined working rhythm.",
          conversation: "We review the current structure, information sources, and reports your business needs.",
        },
        payroll: {
          for: "A timely payroll process, with deductions, reporting, and obligations well coordinated.",
          delivery: "Calculations, electronic banking files, CCSS and INS reporting, aguinaldo, and settlements.",
          conversation: "We understand your pay cycle, team size, and compliance responsibilities.",
        },
        "tax-cr": {
          for: "Tax compliance and judgment for both short- and long-term decisions.",
          delivery: "Filings, obligation tracking, and tax support aligned to the need.",
          conversation: "We identify the business activity, current obligations, and compliance calendar.",
        },
        einvoice: {
          for: "Electronic issuance connected to your company’s accounts receivable.",
          delivery: "Provider activation, business-specific issuance, reconciliation, and periodic reporting.",
          conversation: "We review invoicing volume, commercial flow, and the solution you use today.",
        },
        freezone: {
          for: "Free-zone operations that require documentary discipline and formal reporting.",
          delivery: "Monthly obligations, asset ledgers, the annual report, and PROCOMER audit support.",
          conversation: "We review your operating stage, assets, available records, and upcoming deadlines.",
        },
        audit: {
          for: "An objective review of financial or operational information in relevant risk areas.",
          delivery: "Financial and operational audits focused on the scope agreed with your business.",
          conversation: "We define the review objective, period, available information, and stakeholders.",
        },
      };
  const serviceBrief = serviceBriefs[service.id as keyof typeof serviceBriefs];

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
        <ServiceNavMenu
          locale={locale}
          currentId={service.id}
          services={dict.services.items.map((item) => ({
            id: item.id,
            title: item.title,
          }))}
          labels={{
            menu: copy.menu,
            services: copy.menuServices,
            returnHome: copy.returnHome,
          }}
        />
      </header>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{copy.label}</p>
          <h1>{service.title}</h1>
          <p className={styles.lead}>{service.detail}</p>
          <div className={styles.actions}>
            <Link
              href={`/${locale}/assessment?service=${service.id}`}
              transitionTypes={["nav-forward"]}
              className="btn btn-primary"
            >
              {copy.assessment}
            </Link>
            <Link href={`/${locale}#contact`} className="btn btn-ghost">
              {copy.contact}
            </Link>
          </div>
        </div>
        <div className={styles.heroMedia} aria-hidden="true">
          <Image
            src={`/photos/service-${service.id}.jpg`}
            alt={copy.serviceImage}
            fill
            priority
            quality={100}
            sizes="100vw"
            className={styles.heroPhoto}
          />
        </div>
        <a href="#service-detail" className={styles.scrollHint}>
          <span className={styles.scrollIcon} aria-hidden="true">
            <svg viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1.5" y="1.5" width="21" height="37" rx="10.5" stroke="currentColor" strokeWidth="1.5" />
              <circle className={styles.scrollDot} cx="12" cy="11" r="2.2" fill="currentColor" />
            </svg>
          </span>
          <span>{copy.scrollHint}</span>
        </a>
      </section>
      <section id="service-detail" className={styles.detail}>
        <div>
          <p className={styles.eyebrow}>{copy.included}</p>
          <h2>{copy.heading}</h2>
        </div>
        <ul>
          {service.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </section>
      <section className={styles.serviceContext} aria-label={service.title}>
        <article>
          <p>{copy.for}</p>
          <strong>{serviceBrief.for}</strong>
        </article>
        <article>
          <p>{copy.delivery}</p>
          <strong>{serviceBrief.delivery}</strong>
        </article>
        <article>
          <p>{copy.firstConversation}</p>
          <strong>{serviceBrief.conversation}</strong>
        </article>
      </section>
      <section className={styles.related}>
        <p className={styles.eyebrow}>{copy.related}</p>
        <div className={styles.relatedGrid}>
          {related.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}/servicios/${item.id}`}
              transitionTypes={["nav-forward"]}
            >
              <span>{item.title}</span>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
    </ViewTransition>
  );
}
