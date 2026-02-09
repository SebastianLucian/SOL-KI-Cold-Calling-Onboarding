import { useState } from "react";

const SECTIONS = [
  {
    id: "company",
    title: "Ihr Unternehmen",
    icon: "🏢",
    fields: [
      { key: "companyName", label: "Firmenname", type: "text", placeholder: "z.B. Acme Solutions GmbH" },
      { key: "industry", label: "Branche", type: "text", placeholder: "z.B. SaaS, Recruiting, Versicherung, Immobilien..." },
      { key: "whatYouSell", label: "Was verkaufen Sie? (ein Satz)", type: "text", placeholder: "z.B. Wir helfen Personalvermittlern, Kandidaten in der Golfregion zu finden" },
      { key: "idealCustomer", label: "Wer ist Ihr idealer Kunde?", type: "text", placeholder: "z.B. HR-Manager in mittelständischen Unternehmen im DACH-Raum" },
    ],
  },
  {
    id: "agent",
    title: "Agent-Einrichtung",
    icon: "🎙️",
    fields: [
      { key: "agentName", label: "Name des Agenten", type: "text", placeholder: "z.B. Max, Sarah, Leon..." },
      { key: "agentLanguage", label: "Sprache(n) des Agenten", type: "text", placeholder: "z.B. Deutsch, Englisch, beides" },
      { key: "tone", label: "Tonalität", type: "multiselect", options: ["Professionell", "Freundlich & Locker", "Selbstbewusst & Direkt", "Beratend", "Warm & Persönlich"] },
    ],
  },
  {
    id: "script",
    title: "Gesprächsleitfaden",
    icon: "📞",
    fields: [
      { key: "callGoal", label: "Was ist das Ziel des Anrufs? (wählen Sie alle relevanten aus)", type: "multiselect", options: ["Termin vereinbaren", "Lead qualifizieren", "An Vertriebsmitarbeiter weiterleiten", "E-Mail-Erlaubnis einholen", "Interesse bestätigen", "Demo vereinbaren"] },
      { key: "intro", label: "1. Begrüßung — Wie soll sich der Agent vorstellen?", type: "textarea", placeholder: "z.B. Hallo, hier ist [Agent-Name] von [Firma]. Spreche ich mit [Name]? Ich fasse mich kurz — ich melde mich, weil..." },
      { key: "hook", label: "2. Hook — Was weckt Aufmerksamkeit?", type: "textarea", placeholder: "z.B. Wir helfen Unternehmen wie [ähnliche Firma], die Recruiting-Kosten um 30% zu senken..." },
      { key: "pitch", label: "3. Pitch — Die wichtigsten Punkte Ihres Angebots", type: "textarea", placeholder: "z.B.\n- 30% Kostenersparnis beim Recruiting\n- Kostenloser Pilotversuch\n- Bereits 50+ Agenturen als Kunden" },
      { key: "qualify", label: "4. Qualifizierung — Fragen, um die Passung zu prüfen", type: "textarea", placeholder: "z.B.\n- Rekrutieren Sie derzeit für die Golfregion?\n- Wie viele offene Stellen haben Sie?\n- Wer entscheidet über die Personalauswahl?" },
      { key: "cta", label: "5. Call to Action — Was ist die Aufforderung?", type: "textarea", placeholder: "z.B. Ich würde Ihnen gerne in einem kurzen 15-Minuten-Gespräch zeigen, wie das funktioniert. Passt Ihnen eher Donnerstag oder Freitag?" },
      { key: "closing", label: "6. Abschluss — Wie soll der Agent das Gespräch beenden?", type: "textarea", placeholder: "z.B. Super, ich schicke Ihnen gleich eine Kalendereinladung. Vielen Dank für Ihre Zeit, [Name]. Schönen Tag noch!" },
      { key: "scriptNotes", label: "Zusätzliche Hinweise zum Ablauf (optional)", type: "textarea", placeholder: "z.B. Immer den Namen des Interessenten verwenden, das Gespräch unter 2 Minuten halten, nach dem Hook eine Pause lassen..." },
    ],
  },
  {
    id: "objections",
    title: "Einwände & Grenzen",
    icon: "🛡️",
    fields: [
      { key: "commonObjections", label: "Häufige Einwände (wählen Sie alle relevanten aus)", type: "multiselect", options: ["Kein Interesse", "Gerade keine Zeit", "Haben bereits einen Anbieter", "Zu teuer", "Schicken Sie mir eine E-Mail", "Woher haben Sie meine Nummer?", "Muss ich mit meinem Chef besprechen"] },
      { key: "objectionNotes", label: "Wie soll der Agent darauf reagieren? (optional)", type: "textarea", placeholder: "z.B.\n'Kein Interesse' → Verständnis zeigen, einen Vorteil nennen, Info-Material anbieten\n'Schicken Sie mir eine E-Mail' → Zustimmen, E-Mail bestätigen, Follow-up erwähnen" },
      { key: "neverSay", label: "Was darf der Agent NIEMALS sagen oder tun?", type: "textarea", placeholder: "z.B. Niemals Preise nennen, keine Mitbewerber schlecht reden, nicht aufdringlich sein..." },
      { key: "fallback", label: "Wenn der Interessent Nein sagt — was soll der Agent tun?", type: "select", options: ["Bedanken und auflegen", "Anbieten, Infos per E-Mail zu senden", "Fragen, ob ein späterer Rückruf passt", "An einen Mitarbeiter weiterleiten"] },
    ],
  },
  {
    id: "tools",
    title: "Tools & Kanäle",
    icon: "⚙️",
    fields: [
      { key: "hasCRM", label: "Nutzen Sie ein CRM?", type: "select", options: ["Ja", "Nein"] },
      { key: "crmName", label: "Welches CRM?", type: "select", options: ["HubSpot", "Salesforce", "Pipedrive", "Close", "Zoho CRM", "Monday Sales", "GoHighLevel", "Anderes"], conditional: (data) => data.hasCRM === "Ja" },
      { key: "crmNameOther", label: "Falls Anderes, welches CRM?", type: "text", placeholder: "z.B. Freshsales, eigenes System...", conditional: (data) => data.hasCRM === "Ja" && data.crmName === "Anderes" },
      { key: "hasCalendar", label: "Nutzen Sie ein Kalender-/Buchungstool?", type: "select", options: ["Ja", "Nein"] },
      { key: "calendarName", label: "Welches Kalender-/Buchungstool?", type: "select", options: ["Calendly", "Cal.com", "Google Calendar", "HubSpot Meetings", "Acuity", "Anderes"], conditional: (data) => data.hasCalendar === "Ja" },
      { key: "calendarNameOther", label: "Falls Anderes, welches Tool?", type: "text", placeholder: "z.B. SavvyCal, eigener Link...", conditional: (data) => data.hasCalendar === "Ja" && data.calendarName === "Anderes" },
      { key: "calendarLink", label: "Buchungslink (falls vorhanden)", type: "text", placeholder: "z.B. https://calendly.com/ihr-name", conditional: (data) => data.hasCalendar === "Ja" },
      { key: "sendConfirmation", label: "Soll der Agent nach der Buchung eine Bestätigung senden?", type: "select", options: ["Ja", "Nein"] },
      { key: "confirmationMethod", label: "Wie sollen Bestätigungen gesendet werden? (alle zutreffenden auswählen)", type: "multiselect", options: ["WhatsApp", "SMS", "E-Mail"], conditional: (data) => data.sendConfirmation === "Ja" },
      { key: "outboundChannels", label: "Möchten Sie Interessenten auch über andere Kanäle erreichen?", type: "select", options: ["Ja", "Nein, nur Anrufe"] },
      { key: "outboundChannelTypes", label: "Welche zusätzlichen Kanäle? (alle zutreffenden auswählen)", type: "multiselect", options: ["SMS", "E-Mail", "WhatsApp", "LinkedIn", "Voicemail"], conditional: (data) => data.outboundChannels === "Ja" },
      { key: "outboundNotes", label: "Hinweise zum Outbound-Messaging (optional)", type: "textarea", placeholder: "z.B. SMS senden wenn nach 2x Klingeln niemand abhebt, Follow-up E-Mail 24h nach Anruf...", conditional: (data) => data.outboundChannels === "Ja" },
      { key: "additionalNotes", label: "Gibt es sonst noch etwas, das wir wissen sollten?", type: "textarea", placeholder: "Besondere Abläufe, Integrationen oder Anforderungen..." },
    ],
  },
];

const MultiSelect = ({ options, selected = [], onChange }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
    {options.map((opt) => {
      const isSelected = selected.includes(opt);
      return (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(isSelected ? selected.filter((s) => s !== opt) : [...selected, opt])}
          style={{
            padding: "8px 16px",
            borderRadius: "100px",
            border: isSelected ? "2px solid #2563eb" : "2px solid #dde1e6",
            background: isSelected ? "#eff6ff" : "#f8f9fb",
            color: isSelected ? "#1e40af" : "#4b5563",
            fontSize: "14px",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: isSelected ? 600 : 400,
            transition: "all 0.2s ease",
          }}
        >
          {isSelected && "✓ "}{opt}
        </button>
      );
    })}
  </div>
);

export default function ColdCallingOnboarding() {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = { _formType: "Kaltakquise Onboarding" };
      SECTIONS.forEach((sec) => {
        sec.fields
          .filter((f) => !f.conditional || f.conditional(formData))
          .forEach((f) => {
            const val = formData[f.key];
            if (val && (Array.isArray(val) ? val.length > 0 : val.trim?.() !== "")) {
              payload[f.label] = Array.isArray(val) ? val.join(", ") : val;
            }
          });
      });
      await fetch("https://formspree.io/f/mnjbqvey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch (err) {
      alert("Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.");
    }
    setSubmitting(false);
  };

  const goTo = (idx) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentSection(idx);
      setAnimating(false);
    }, 200);
  };

  const section = SECTIONS[currentSection];
  const progress = ((currentSection + 1) / SECTIONS.length) * 100;

  const allFields = SECTIONS.flatMap((s) =>
    s.fields.filter((f) => !f.conditional || f.conditional(formData))
  );
  const filledFields = allFields.filter((f) => {
    const val = formData[f.key];
    return val && (Array.isArray(val) ? val.length > 0 : val.trim?.() !== "");
  }).length;

  if (submitted) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(165deg, #f0f4f8 0%, #e2e8f0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        padding: "24px",
      }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "52px 40px",
          maxWidth: "580px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(37,99,235,0.08)",
        }}>
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>✅</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "26px", color: "#111827", marginBottom: "10px" }}>
            Onboarding abgeschlossen
          </h2>
          <p style={{ color: "#6b7280", fontSize: "15px", lineHeight: 1.6, marginBottom: "28px" }}>
            {filledFields} von {allFields.length} Feldern ausgefüllt. Ihr Kaltakquise-Agent wird auf dieser Basis erstellt.
          </p>
          <div style={{
            background: "#f9fafb",
            borderRadius: "14px",
            padding: "24px",
            textAlign: "left",
            maxHeight: "400px",
            overflowY: "auto",
          }}>
            {SECTIONS.map((sec) => (
              <div key={sec.id} style={{ marginBottom: "18px" }}>
                <h4 style={{ color: "#2563eb", fontSize: "13px", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {sec.icon} {sec.title}
                </h4>
                {sec.fields
                  .filter((f) => !f.conditional || f.conditional(formData))
                  .filter((f) => {
                    const val = formData[f.key];
                    return val && (Array.isArray(val) ? val.length > 0 : val.trim?.() !== "");
                  })
                  .map((f) => (
                    <div key={f.key} style={{ marginBottom: "5px", fontSize: "13px" }}>
                      <span style={{ color: "#9ca3af", fontWeight: 500 }}>{f.label}:</span>{" "}
                      <span style={{ color: "#1f2937" }}>
                        {Array.isArray(formData[f.key]) ? formData[f.key].join(", ") : formData[f.key]}
                      </span>
                    </div>
                  ))}
              </div>
            ))}
          </div>
          <button
            onClick={() => { setSubmitted(false); setCurrentSection(0); }}
            style={{
              marginTop: "20px",
              padding: "12px 28px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ← Antworten bearbeiten
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(165deg, #f0f4f8 0%, #e2e8f0 100%)",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ padding: "28px 32px 16px" }}>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "24px",
          color: "#111827",
          margin: 0,
          fontWeight: 700,
        }}>
          📞 KI-Kaltakquise Voice Agent — Onboarding
        </h1>
        <p style={{ color: "#6b7280", fontSize: "14px", margin: "6px 0 0" }}>
          Beantworten Sie diese Fragen, damit wir Ihren individuellen Voice Agent erstellen können
        </p>
      </div>

      {/* Progress */}
      <div style={{ padding: "0 32px", marginBottom: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>
            Schritt {currentSection + 1} von {SECTIONS.length}
          </span>
          <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>
            {filledFields} / {allFields.length} ausgefüllt
          </span>
        </div>
        <div style={{
          height: "4px",
          background: "#d1d5db",
          borderRadius: "4px",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #2563eb, #3b82f6)",
            borderRadius: "4px",
            transition: "width 0.4s ease",
          }} />
        </div>
      </div>

      {/* Section Tabs */}
      <div style={{
        display: "flex",
        gap: "6px",
        padding: "10px 32px",
        overflowX: "auto",
      }}>
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            style={{
              padding: "9px 16px",
              borderRadius: "8px",
              border: "none",
              background: i === currentSection ? "#2563eb" : "#fff",
              color: i === currentSection ? "#fff" : "#4b5563",
              fontSize: "13px",
              fontWeight: i === currentSection ? 600 : 500,
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: i === currentSection ? "0 4px 12px rgba(37,99,235,0.2)" : "0 1px 3px rgba(0,0,0,0.04)",
              transition: "all 0.2s ease",
            }}
          >
            {s.icon} {s.title}
          </button>
        ))}
      </div>

      {/* Form */}
      <div style={{
        flex: 1,
        padding: "16px 32px 32px",
        opacity: animating ? 0 : 1,
        transform: animating ? "translateY(6px)" : "translateY(0)",
        transition: "all 0.2s ease",
      }}>
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "32px 28px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
          maxWidth: "640px",
        }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "20px",
            color: "#111827",
            marginTop: 0,
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <span style={{ fontSize: "24px" }}>{section.icon}</span>
            {section.title}
          </h2>

          {section.fields
            .filter((f) => !f.conditional || f.conditional(formData))
            .map((field) => (
              <div key={field.key} style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1f2937",
                  marginBottom: "7px",
                }}>
                  {field.label}
                </label>

                {field.type === "text" && (
                  <input
                    type="text"
                    value={formData[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: "8px",
                      border: "2px solid #e5e7eb",
                      fontSize: "15px",
                      fontFamily: "'DM Sans', sans-serif",
                      background: "#fafbfc",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                )}

                {field.type === "textarea" && (
                  <textarea
                    value={formData[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: "8px",
                      border: "2px solid #e5e7eb",
                      fontSize: "15px",
                      fontFamily: "'DM Sans', sans-serif",
                      background: "#fafbfc",
                      outline: "none",
                      resize: "vertical",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                )}

                {field.type === "select" && (
                  <select
                    value={formData[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: "8px",
                      border: "2px solid #e5e7eb",
                      fontSize: "15px",
                      fontFamily: "'DM Sans', sans-serif",
                      background: "#fafbfc",
                      outline: "none",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="">Auswählen...</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}

                {field.type === "multiselect" && (
                  <MultiSelect
                    options={field.options}
                    selected={formData[field.key] || []}
                    onChange={(val) => updateField(field.key, val)}
                  />
                )}
              </div>
            ))}

          {/* Navigation */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "28px",
            gap: "12px",
          }}>
            <button
              onClick={() => goTo(currentSection - 1)}
              disabled={currentSection === 0}
              style={{
                padding: "12px 24px",
                borderRadius: "10px",
                border: "2px solid #e5e7eb",
                background: "#fff",
                color: currentSection === 0 ? "#ccc" : "#374151",
                fontSize: "14px",
                fontWeight: 600,
                cursor: currentSection === 0 ? "default" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                opacity: currentSection === 0 ? 0.4 : 1,
              }}
            >
              ← Zurück
            </button>

            {currentSection < SECTIONS.length - 1 ? (
              <button
                onClick={() => goTo(currentSection + 1)}
                style={{
                  padding: "12px 28px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#2563eb",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.2)",
                }}
              >
                Weiter →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  padding: "12px 32px",
                  borderRadius: "10px",
                  border: "none",
                  background: submitting ? "#93b5e6" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: submitting ? "wait" : "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 4px 16px rgba(37,99,235,0.25)",
                }}
              >
                {submitting ? "Wird gesendet..." : "✓ Absenden"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
