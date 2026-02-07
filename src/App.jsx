import { useState } from "react";

const SECTIONS = [
  {
    id: "company",
    title: "Your Company",
    icon: "🏢",
    fields: [
      { key: "companyName", label: "Company Name", type: "text", placeholder: "e.g. Acme Solutions GmbH" },
      { key: "industry", label: "Industry", type: "text", placeholder: "e.g. SaaS, Recruiting, Insurance, Real Estate..." },
      { key: "whatYouSell", label: "What do you sell? (one sentence)", type: "text", placeholder: "e.g. We help recruiting agencies find candidates in the Gulf region" },
      { key: "idealCustomer", label: "Who is your ideal customer?", type: "text", placeholder: "e.g. HR managers at mid-size companies in DACH" },
    ],
  },
  {
    id: "agent",
    title: "Agent Setup",
    icon: "🎙️",
    fields: [
      { key: "agentName", label: "Agent Name", type: "text", placeholder: "e.g. Max, Sarah, Leon..." },
      { key: "agentLanguage", label: "Language(s) the agent should speak", type: "text", placeholder: "e.g. German, English, both" },
      { key: "tone", label: "Tone", type: "multiselect", options: ["Professional", "Friendly & Casual", "Confident & Direct", "Consultative", "Warm & Personal"] },
    ],
  },
  {
    id: "script",
    title: "Call Script",
    icon: "📞",
    fields: [
      { key: "callGoal", label: "What's the goal of the call? (select as many as relevant)", type: "multiselect", options: ["Book a meeting", "Qualify the lead", "Transfer to sales rep", "Get email permission", "Confirm interest", "Schedule a demo"] },
      { key: "intro", label: "1. Intro — How should the agent introduce themselves?", type: "textarea", placeholder: "e.g. Hi, this is [agent name] from [company]. Am I speaking with [prospect name]? I'll be brief — I'm reaching out because..." },
      { key: "hook", label: "2. Hook — What grabs their attention?", type: "textarea", placeholder: "e.g. We've been helping companies like [similar company] reduce hiring costs by 30% in the Gulf region..." },
      { key: "pitch", label: "3. Pitch — Key points about your offer", type: "textarea", placeholder: "e.g.\n- We save clients 30% on hiring costs\n- Free pilot available\n- Already working with 50+ agencies" },
      { key: "qualify", label: "4. Qualify — Questions to check if it's a fit", type: "textarea", placeholder: "e.g.\n- Are you currently hiring for the Gulf region?\n- How many open positions do you have?\n- Who handles recruitment decisions?" },
      { key: "cta", label: "5. Call to Action — What's the ask?", type: "textarea", placeholder: "e.g. I'd love to show you how this works in a quick 15-minute call with our team. Would Thursday or Friday work better for you?" },
      { key: "closing", label: "6. Closing — How should the agent wrap up?", type: "textarea", placeholder: "e.g. Perfect, I'll send you a calendar invite right away. Thanks for your time, [prospect name]. Have a great day!" },
      { key: "scriptNotes", label: "Any extra notes on the flow? (optional)", type: "textarea", placeholder: "e.g. Always use the prospect's name, keep the whole call under 2 minutes, pause after the hook to let them respond..." },
    ],
  },
  {
    id: "objections",
    title: "Objections & Boundaries",
    icon: "🛡️",
    fields: [
      { key: "commonObjections", label: "Common objections you hear (select as many as relevant)", type: "multiselect", options: ["Not interested", "No time right now", "Already have a provider", "Too expensive", "Send me an email", "Who gave you my number?", "I need to check with my boss"] },
      { key: "objectionNotes", label: "How should the agent handle these? (optional)", type: "textarea", placeholder: "e.g.\n'Not interested' → Acknowledge, mention one key benefit, offer to send info\n'Send me an email' → Agree, confirm email, mention you'll follow up" },
      { key: "neverSay", label: "Anything the agent should NEVER say or do?", type: "textarea", placeholder: "e.g. Never mention pricing, never badmouth competitors, don't be pushy..." },
      { key: "fallback", label: "If the prospect says no — what should the agent do?", type: "select", options: ["Thank them and end call", "Ask to send info via email", "Ask to call back another time", "Transfer to a human"] },
    ],
  },
  {
    id: "tools",
    title: "Tools & Channels",
    icon: "⚙️",
    fields: [
      { key: "hasCRM", label: "Do you use a CRM?", type: "select", options: ["Yes", "No"] },
      { key: "crmName", label: "Which CRM?", type: "select", options: ["HubSpot", "Salesforce", "Pipedrive", "Close", "Zoho CRM", "Monday Sales", "GoHighLevel", "Other"], conditional: (data) => data.hasCRM === "Yes" },
      { key: "crmNameOther", label: "If Other, which CRM?", type: "text", placeholder: "e.g. Freshsales, custom system...", conditional: (data) => data.hasCRM === "Yes" && data.crmName === "Other" },
      { key: "hasCalendar", label: "Do you use a calendar/booking tool for meetings?", type: "select", options: ["Yes", "No"] },
      { key: "calendarName", label: "Which calendar/booking tool?", type: "select", options: ["Calendly", "Cal.com", "Google Calendar", "HubSpot Meetings", "Acuity", "Other"], conditional: (data) => data.hasCalendar === "Yes" },
      { key: "calendarNameOther", label: "If Other, which tool?", type: "text", placeholder: "e.g. SavvyCal, custom link...", conditional: (data) => data.hasCalendar === "Yes" && data.calendarName === "Other" },
      { key: "calendarLink", label: "Booking link (if any)", type: "text", placeholder: "e.g. https://calendly.com/your-name", conditional: (data) => data.hasCalendar === "Yes" },
      { key: "sendConfirmation", label: "Should the agent send a confirmation after booking?", type: "select", options: ["Yes", "No"] },
      { key: "confirmationMethod", label: "How should confirmations be sent? (select all that apply)", type: "multiselect", options: ["WhatsApp", "SMS", "Email"], conditional: (data) => data.sendConfirmation === "Yes" },
      { key: "outboundChannels", label: "Do you also want to reach prospects via other outbound channels?", type: "select", options: ["Yes", "No, just calling"] },
      { key: "outboundChannelTypes", label: "Which additional channels? (select all that apply)", type: "multiselect", options: ["SMS", "Email", "WhatsApp", "LinkedIn", "Voicemail drop"], conditional: (data) => data.outboundChannels === "Yes" },
      { key: "outboundNotes", label: "Any notes on outbound messaging? (optional)", type: "textarea", placeholder: "e.g. Send an SMS if no answer after 2 rings, follow up with email 24h after call...", conditional: (data) => data.outboundChannels === "Yes" },
      { key: "additionalNotes", label: "Anything else we should know?", type: "textarea", placeholder: "Any special workflows, integrations, or requirements..." },
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
      const payload = { _formType: "Cold Calling Onboarding" };
      SECTIONS.forEach((sec) => {
        sec.fields.forEach((f) => {
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
      alert("Something went wrong. Please try again.");
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

  const allFields = SECTIONS.flatMap((s) => s.fields);
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
            Onboarding Complete
          </h2>
          <p style={{ color: "#6b7280", fontSize: "15px", lineHeight: 1.6, marginBottom: "28px" }}>
            {filledFields} of {allFields.length} fields answered. Your cold calling agent will be built from this.
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
            ← Edit Responses
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
          📞 Cold Calling Voice Agent — Onboarding
        </h1>
        <p style={{ color: "#6b7280", fontSize: "14px", margin: "6px 0 0" }}>
          Answer these questions so we can build your custom Voice Agent
        </p>
      </div>

      {/* Progress */}
      <div style={{ padding: "0 32px", marginBottom: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>
            Step {currentSection + 1} of {SECTIONS.length}
          </span>
          <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>
            {filledFields} / {allFields.length} answered
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

          {section.fields.map((field) => (
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
                  <option value="">Select...</option>
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
              ← Back
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
                Next →
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
                {submitting ? "Submitting..." : "✓ Submit"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
