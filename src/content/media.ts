export const mapsLink = "https://maps.app.goo.gl/XbPuu5RRmexrtN8A7";

export const mapsEmbed =
  "https://www.google.com/maps?q=9.9310625,-84.1795625&z=17&output=embed";

export const wazeLink =
  "https://www.waze.com/ul?ll=9.9310625,-84.1795625&navigate=yes";

export const ONTRACK_WHATSAPP = "50688696489";
export const ONTRACK_WHATSAPP_DISPLAY = "(506) 8869-6489";
export const ONTRACK_EMAIL = "info@ontrackcr.net";
export const ONTRACK_PHONE_DISPLAY = "(506) 2582-1879";
export const ONTRACK_PHONE_TEL = "+50625821879";

export function whatsAppHref(message?: string) {
  const base = `https://wa.me/${ONTRACK_WHATSAPP}`;
  const text = message?.trim();
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

export const ADDRESS =
  "Centro Comercial Paseo de Angel, local 12, Santa Ana, San José, Costa Rica";

export const PARTNERS = {
  ssc: {
    name: "SSC",
    href: "https://www.sscoutsourcing.com/es",
  },
  faycatax: {
    name: "FaycaTax",
    href: "https://faycatax.com/",
  },
} as const;
