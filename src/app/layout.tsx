import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "OnTrack | Servicios contables y administrativos en Costa Rica",
    template: "%s | OnTrack",
  },
  description:
    "OnTrack, marca de SSC en alianza con FaycaTax, ofrece servicios contables integrados: contabilidad, planillas, impuestos, auditoría, facturación electrónica y zona franca. Más de 20 años de experiencia profesional.",
  metadataBase: new URL("https://ontrackcr.net"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: "OnTrack",
    title: "OnTrack | Servicios contables y administrativos en Costa Rica",
    description:
      "OnTrack, marca de SSC en alianza con FaycaTax, ofrece servicios contables integrados para empresas en Costa Rica.",
    url: "https://ontrackcr.net",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
