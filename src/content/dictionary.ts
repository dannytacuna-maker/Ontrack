import type { Locale } from "@/lib/i18n";

export type Dictionary = {
  meta: { title: string; description: string };
  nav: {
    about: string;
    why: string;
    services: string;
    contact: string;
    talk: string;
  };
  hero: {
    brand: string;
    headline: string;
    support: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scrollHint: string;
  };
  about: {
    eyebrow: string;
    headline: string;
    support: string;
  };
  stats: { value: string; label: string }[];
  why: {
    eyebrow: string;
    headline: string;
    support: string;
    points: { title: string; body: string }[];
  };
  alliance: {
    eyebrow: string;
    headline: string;
    support: string;
    sscRole: string;
    faycaRole: string;
    visit: string;
  };
  services: {
    eyebrow: string;
    headline: string;
    support: string;
    learnMore: string;
    items: {
      id: string;
      title: string;
      body: string;
      detail: string;
      bullets: string[];
    }[];
  };
  place: {
    eyebrow: string;
    headline: string;
    support: string;
    personName: string;
    personRole: string;
    personBio: string;
    teamLabel: string;
    addressLabel: string;
    phoneLabel: string;
    emailLabel: string;
    mapsLabel: string;
    mapsCta: string;
    wazeCta: string;
    callLabel: string;
  };
  contact: {
    eyebrow: string;
    headline: string;
    support: string;
    form: {
      name: string;
      email: string;
      phone: string;
      message: string;
      submit: string;
      success: string;
    };
    whatsappCta: string;
    whatsappMessage: string;
  };
  footer: {
    tagline: string;
    alliance: string;
    rights: string;
  };
};

const es: Dictionary = {
  meta: {
    title: "OnTrack | Servicios contables y administrativos en Costa Rica",
    description:
      "OnTrack, marca de SSC en alianza con FaycaTax, ofrece servicios contables integrados: contabilidad, planillas, impuestos, auditoría, facturación electrónica y zona franca. Más de 20 años de experiencia profesional.",
  },
  nav: {
    about: "Sobre OnTrack",
    why: "Por qué OnTrack",
    services: "Servicios",
    contact: "Contacto",
    talk: "Contactar",
  },
  hero: {
    brand: "OnTrack",
    headline: "Servicios contables y administrativos profesionales.",
    support:
      "Ofrecemos soluciones contables integradas para optimizar la estructura administrativa de nuestros clientes y permitirles enfocarse en sus principales actividades de negocio.",
    ctaPrimary: "Contactar",
    ctaSecondary: "Ver servicios",
    scrollHint: "Desplace para conocer OnTrack",
  },
  about: {
    eyebrow: "Sobre OnTrack",
    headline: "Firma de servicios contables y administrativos.",
    support:
      "OnTrack brinda soluciones contables integradas con más de 20 años de experiencia profesional. Combinamos habilidades, criterio y disciplina operativa para que nuestros clientes mantengan el control financiero y administrativo de su empresa.",
  },
  stats: [
    { value: "20+", label: "Años de experiencia" },
    { value: "SSC", label: "Marca del grupo SSC" },
    { value: "CR", label: "Servicios en Costa Rica" },
  ],
  why: {
    eyebrow: "Por qué OnTrack",
    headline: "Profesionalismo al servicio de su operación.",
    support:
      "Elegimos un estándar claro: servicios bien ejecutados, comunicación directa y un expediente que sostiene el día a día de su empresa.",
    points: [
      {
        title: "Servicios integrados",
        body: "Contabilidad, planillas, impuestos, auditoría, facturación electrónica y zona franca en una misma relación profesional.",
      },
      {
        title: "Enfoque en el cliente",
        body: "Diseñamos el back-office para optimizar la estructura administrativa y liberar foco en las actividades principales del negocio.",
      },
      {
        title: "Criterio y respaldo",
        body: "Más de 20 años de trayectoria, con el respaldo del grupo SSC y alianza estratégica con FaycaTax en materia tributaria.",
      },
    ],
  },
  alliance: {
    eyebrow: "Grupo y alianza",
    headline: "Parte de SSC. En alianza con FaycaTax.",
    support:
      "SSC agrupa OnTrack y COUNTME. OnTrack opera como marca propia del grupo y mantiene una alianza estratégica con FaycaTax para criterio tributario.",
    sscRole:
      "SSC es el grupo que respalda a OnTrack — con trayectoria en servicios contables y administrativos.",
    faycaRole:
      "FaycaTax es el aliado estratégico de OnTrack en asesoría y criterio tributario.",
    visit: "Visitar sitio",
  },
  services: {
    eyebrow: "Servicios",
    headline: "Servicios de primera calidad.",
    support:
      "Servicios contables integrados, diseñados para optimizar la estructura administrativa de nuestros clientes.",
    learnMore: "Consultar",
    items: [
      {
        id: "accounting",
        title: "Contabilidad",
        body: "Contabilidad general, costos y reportes financieros para el control de su operación.",
        detail:
          "Servicios contables integrados pensados para optimizar la estructura administrativa. Incluye contabilidad general, reportes financieros y contabilidad de costos.",
        bullets: [
          "Contabilidad general",
          "Planillas",
          "Presentación de impuestos",
          "Reportes financieros",
          "Contabilidad de costos",
        ],
      },
      {
        id: "payroll",
        title: "Planillas",
        body: "Cálculo, reportes y cumplimiento laboral de punta a punta.",
        detail:
          "Operamos la planilla completa: cálculo con deducciones y retenciones, archivos de banca electrónica, reportes a la CCSS y al INS, aguinaldo y liquidaciones.",
        bullets: [
          "Cálculo con deducciones y retenciones",
          "Planillas en plataformas de banca electrónica",
          "Reportes CCSS e INS",
          "Aguinaldos y comprobante de pago",
          "Preparación de liquidaciones laborales",
        ],
      },
      {
        id: "tax-cr",
        title: "Impuestos en Costa Rica",
        body: "Cumplimiento y asesoría tributaria según las necesidades de su empresa.",
        detail:
          "Los servicios tributarios se basan en una concepción dinámica de las necesidades del cliente, integrando objetivos a corto y largo plazo.",
        bullets: ["Cumplimiento tributario", "Asesoría tributaria"],
      },
      {
        id: "einvoice",
        title: "Facturación electrónica",
        body: "Activación, emisión según el giro del negocio y conciliación con cuentas por cobrar.",
        detail:
          "Activación del servicio con el proveedor, emisión según el giro del negocio, conciliación con cuentas por cobrar y reportes periódicos.",
        bullets: [
          "Activación con el proveedor autorizado",
          "Emisión según el giro del negocio",
          "Conciliación con cuentas por cobrar",
          "Reportes periódicos de facturación",
        ],
      },
      {
        id: "freezone",
        title: "Régimen de zonas francas",
        body: "Obligaciones formales, auxiliares de activos fijos e informes ante PROCOMER.",
        detail:
          "Cumplimiento de obligaciones formales mensuales, auxiliares de activos fijos, informe anual de operaciones y acompañamiento en auditorías de PROCOMER.",
        bullets: [
          "Cumplimiento de obligaciones formales mensuales",
          "Levantamiento de auxiliares de activos fijos",
          "Preparación de informe anual de operaciones",
          "Acompañamiento de auditorías de PROCOMER",
        ],
      },
      {
        id: "audit",
        title: "Auditoría",
        body: "Auditorías financieras y operativas con enfoque en áreas clave de riesgo.",
        detail:
          "Servicios de auditoría diseñados para enfocarse en las áreas clave de riesgo, analizando de manera profunda y objetiva la información financiera y operativa.",
        bullets: ["Auditorías financieras", "Auditorías operativas"],
      },
    ],
  },
  place: {
    eyebrow: "Equipo",
    headline: "Dirección y equipo OnTrack.",
    support:
      "El equipo que opera OnTrack desde Santa Ana, con la misma estructura profesional del grupo SSC.",
    personName: "Shirley Solís",
    personRole: "Fundadora y Directora de OnTrack",
    personBio:
      "Dirige OnTrack y responde por el estándar profesional de la firma en contabilidad, planillas, impuestos, auditoría, facturación electrónica y régimen de zona franca.",
    teamLabel: "El equipo OnTrack",
    addressLabel: "Dirección",
    phoneLabel: "Teléfono",
    emailLabel: "Correo",
    mapsLabel: "Ubicación",
    mapsCta: "Abrir en Google Maps",
    wazeCta: "Ir con Waze",
    callLabel: "Llamar",
  },
  contact: {
    eyebrow: "Escribanos",
    headline: "Contáctenos.",
    support:
      "Cuéntenos cómo podemos apoyar a su empresa. Respondemos desde Santa Ana.",
    form: {
      name: "Nombre",
      email: "Correo",
      phone: "Teléfono",
      message: "Mensaje",
      submit: "Enviar mensaje",
      success: "Se abrirá su correo para enviar el mensaje a OnTrack.",
    },
    whatsappCta: "Escribir por WhatsApp",
    whatsappMessage:
      "Hola, me gustaría información sobre los servicios de OnTrack.",
  },
  footer: {
    tagline: "Servicios contables y administrativos en Costa Rica.",
    alliance: "Marca de SSC · En alianza con FaycaTax",
    rights: "OnTrack. Todos los derechos reservados.",
  },
};

const en: Dictionary = {
  meta: {
    title: "OnTrack | Accounting and administrative services in Costa Rica",
    description:
      "OnTrack, an SSC brand in alliance with FaycaTax, provides integrated accounting services: bookkeeping, payroll, tax, audit, e-invoicing, and free-zone compliance. More than 20 years of professional experience.",
  },
  nav: {
    about: "About OnTrack",
    why: "Why OnTrack",
    services: "Services",
    contact: "Contact",
    talk: "Contact us",
  },
  hero: {
    brand: "OnTrack",
    headline: "Professional accounting and administrative services.",
    support:
      "We provide integrated accounting solutions designed to optimize our clients’ administrative structure and allow them to focus on their core business activities.",
    ctaPrimary: "Contact us",
    ctaSecondary: "View services",
    scrollHint: "Scroll to learn about OnTrack",
  },
  about: {
    eyebrow: "About OnTrack",
    headline: "An accounting and administrative services firm.",
    support:
      "OnTrack delivers integrated accounting solutions with more than 20 years of professional experience. We combine skill, judgment, and operating discipline so clients keep financial and administrative control of their company.",
  },
  stats: [
    { value: "20+", label: "Years of experience" },
    { value: "SSC", label: "Brand of the SSC group" },
    { value: "CR", label: "Services in Costa Rica" },
  ],
  why: {
    eyebrow: "Why OnTrack",
    headline: "Professionalism in service of your operation.",
    support:
      "We hold a clear standard: well-executed services, direct communication, and a file that sustains the day-to-day of your company.",
    points: [
      {
        title: "Integrated services",
        body: "Accounting, payroll, tax, audit, electronic invoicing, and free-zone compliance in one professional relationship.",
      },
      {
        title: "Client focus",
        body: "We design the back-office to optimize administrative structure and free attention for the core business.",
      },
      {
        title: "Judgment and backing",
        body: "More than 20 years of practice, with the backing of the SSC group and a strategic alliance with FaycaTax on tax matters.",
      },
    ],
  },
  alliance: {
    eyebrow: "Group and alliance",
    headline: "Part of SSC. In alliance with FaycaTax.",
    support:
      "SSC groups OnTrack and COUNTME. OnTrack operates as its own brand within the group and maintains a strategic alliance with FaycaTax for tax judgment.",
    sscRole:
      "SSC is the group behind OnTrack — with a track record in accounting and administrative services.",
    faycaRole:
      "FaycaTax is OnTrack’s strategic ally for tax advisory and judgment.",
    visit: "Visit site",
  },
  services: {
    eyebrow: "Services",
    headline: "Our professional services.",
    support:
      "Integrated accounting services designed to optimize our clients’ administrative structure.",
    learnMore: "Inquire",
    items: [
      {
        id: "accounting",
        title: "Accounting",
        body: "General accounting, cost accounting, and financial reporting for operational control.",
        detail:
          "Integrated accounting services designed to optimize administrative structure — general books, financial reports, and cost accounting.",
        bullets: [
          "General accounting",
          "Payroll",
          "Tax filing support",
          "Financial reporting",
          "Cost accounting",
        ],
      },
      {
        id: "payroll",
        title: "Payroll",
        body: "Calculation, reporting, and labor compliance end to end.",
        detail:
          "Full payroll operations: calculation with deductions and withholdings, electronic banking files, CCSS and INS reports, aguinaldo, and settlements.",
        bullets: [
          "Calculation with deductions and withholdings",
          "Payroll files for electronic banking",
          "CCSS and INS reports",
          "Aguinaldo and payment certificates",
          "Labor settlement preparation",
        ],
      },
      {
        id: "tax-cr",
        title: "Costa Rica tax",
        body: "Tax compliance and advisory aligned to your company’s needs.",
        detail:
          "Tax services based on a dynamic view of client needs, integrating short- and long-term objectives.",
        bullets: ["Tax compliance", "Tax advisory"],
      },
      {
        id: "einvoice",
        title: "Electronic invoicing",
        body: "Activation, issuance by business type, and accounts receivable reconciliation.",
        detail:
          "Provider activation, issuance by business type, AR reconciliation, and periodic invoicing reports.",
        bullets: [
          "Activation with the authorized provider",
          "Issuance aligned to the business",
          "Reconciliation with accounts receivable",
          "Periodic invoicing reports",
        ],
      },
      {
        id: "freezone",
        title: "Free-zone regime",
        body: "Formal obligations, fixed-asset ledgers, and PROCOMER reporting.",
        detail:
          "Monthly formal obligations, fixed-asset ledgers, annual operations report, and support for PROCOMER audits.",
        bullets: [
          "Monthly formal obligations",
          "Fixed-asset subsidiary ledgers",
          "Annual operations report",
          "Support for PROCOMER audits",
        ],
      },
      {
        id: "audit",
        title: "Audit",
        body: "Financial and operational audits focused on key risk areas.",
        detail:
          "Audit services focused on key risk areas, with objective review of financial and operational information.",
        bullets: ["Financial audits", "Operational audits"],
      },
    ],
  },
  place: {
    eyebrow: "Team",
    headline: "OnTrack leadership and team.",
    support:
      "The team that runs OnTrack from Santa Ana, with the same professional structure as the SSC group.",
    personName: "Shirley Solís",
    personRole: "Founder and Director of OnTrack",
    personBio:
      "Leads OnTrack and answers for the firm’s professional standard across accounting, payroll, tax, audit, electronic invoicing, and free-zone compliance.",
    teamLabel: "The OnTrack team",
    addressLabel: "Address",
    phoneLabel: "Phone",
    emailLabel: "Email",
    mapsLabel: "Location",
    mapsCta: "Open in Google Maps",
    wazeCta: "Go with Waze",
    callLabel: "Call",
  },
  contact: {
    eyebrow: "Write to us",
    headline: "Contact us.",
    support:
      "Tell us how we can support your company. We respond from Santa Ana.",
    form: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      message: "Message",
      submit: "Send message",
      success: "Your email client will open to send the message to OnTrack.",
    },
    whatsappCta: "Message on WhatsApp",
    whatsappMessage:
      "Hello, I would like information about OnTrack services.",
  },
  footer: {
    tagline: "Accounting and administrative services in Costa Rica.",
    alliance: "Brand of SSC · In alliance with FaycaTax",
    rights: "OnTrack. All rights reserved.",
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return locale === "en" ? en : es;
}
