const TO_EMAIL = "esolis@sscoutsourcing.com";

type ContactRequest = {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  service?: string;
  companyType?: string;
  urgency?: string;
  industry?: string;
  team?: string;
  context?: string;
  message?: string;
  source?: "assessment" | "client-access" | "contact";
};

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function companyTypeLabel(value: string) {
  switch (value) {
    case "international":
      return "International / free zone";
    case "early":
      return "New or growing";
    case "local":
      return "Local business";
    default:
      return value || "—";
  }
}

export async function POST(request: Request) {
  let payload: ContactRequest;

  try {
    payload = (await request.json()) as ContactRequest;
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = text(payload.name, 120);
  const email = text(payload.email, 160);
  const company = text(payload.company, 160);
  const phone = text(payload.phone, 60);
  const service = text(payload.service, 120);
  const companyType = text(payload.companyType, 120);
  const urgency = text(payload.urgency, 120);
  const industry = text(payload.industry, 160);
  const team = text(payload.team, 60);
  const context = text(payload.context, 2500);
  const message = text(payload.message, 2500);
  const isSimpleContact = payload.source === "contact";
  const source = isSimpleContact
    ? "Website contact"
    : payload.source === "client-access"
      ? "Client Access"
      : "Service Path Assessment";

  if (!name || !email || !(message || context)) {
    return Response.json(
      { ok: false, error: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  const profile = companyTypeLabel(companyType);
  const body = isSimpleContact
    ? [
        "OnTrack website contact",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "—"}`,
        "",
        "Message:",
        message || "—",
      ].join("\n")
    : [
        "OnTrack meeting preparation",
        "",
        `Source: ${source}`,
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "—"}`,
        `Company: ${company || "—"}`,
        `Company type: ${profile}`,
        `Industry / activity: ${industry || "—"}`,
        `Employee range: ${team || "—"}`,
        `Service path: ${service || "—"}`,
        `Timing: ${urgency || "—"}`,
        "",
        "Meeting context:",
        context || message || "—",
      ].join("\n");

  const notifyPayload = isSimpleContact
    ? {
        _subject: `OnTrack contact: ${name}`,
        _template: "table" as const,
        _replyto: email,
        name,
        email,
        phone: phone || "—",
        message: body,
      }
    : {
        _subject: `OnTrack ${source}: ${service || name}`,
        _template: "table" as const,
        _replyto: email,
        name,
        email,
        phone: phone || "—",
        company: company || "—",
        companyType: profile,
        industry: industry || "—",
        team: team || "—",
        service: service || "—",
        urgency: urgency || "—",
        context: context || message || "—",
        message: body,
      };

  try {
    const response = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(TO_EMAIL)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(notifyPayload),
      },
    );

    if (!response.ok) throw new Error("FormSubmit rejected the request.");
  } catch {
    return Response.json({
      ok: true,
      delivery: "client",
      notifyUrl: `https://formsubmit.co/ajax/${encodeURIComponent(TO_EMAIL)}`,
      notifyPayload,
    });
  }

  return Response.json({ ok: true });
}
