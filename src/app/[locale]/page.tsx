import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { OnTrackExperience } from "@/components/OnTrackExperience";
import { getDictionary } from "@/content/dictionary";
import { isLocale, locales, type Locale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const dict = getDictionary(raw);
  const url = `https://ontrackcr.net/${raw}`;
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: url,
      languages: {
        es: "https://ontrackcr.net/es",
        en: "https://ontrackcr.net/en",
      },
    },
    openGraph: {
      type: "website",
      siteName: "OnTrack",
      title: dict.meta.title,
      description: dict.meta.description,
      url,
      locale: raw === "es" ? "es_CR" : "en_US",
    },
  };
}

export default async function LocalePage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(locale)};`,
        }}
      />
      <ViewTransition
        enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
        exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
        default="none"
      >
        <OnTrackExperience locale={locale} dict={dict} />
      </ViewTransition>
    </>
  );
}
