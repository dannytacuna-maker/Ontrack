import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AssessmentExperience } from "@/components/AssessmentExperience";
import { getDictionary } from "@/content/dictionary";
import { isLocale, locales, type Locale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ service?: string; company?: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const isSpanish = rawLocale === "es";
  return {
    title: isSpanish
      ? "Preparación de reunión | OnTrack"
      : "Meeting preparation | OnTrack",
    description: isSpanish
      ? "Comparta el contexto de su operación para preparar su reunión con OnTrack."
      : "Share your operating context to prepare your meeting with OnTrack.",
  };
}

export default async function AssessmentPage({ params, searchParams }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const query = await searchParams;
  const dict = getDictionary(locale);
  const initialService = dict.services.items.some((item) => item.id === query.service)
    ? query.service!
    : dict.services.items[0].id;
  const initialCompany = ["local", "international", "early"].includes(query.company ?? "")
    ? query.company!
    : "local";

  return (
    <AssessmentExperience
      locale={locale}
      dict={dict}
      initialService={initialService}
      initialCompany={initialCompany}
    />
  );
}
