import { ImageResponse } from "next/og";

export const alt = "NERAAJANS — Editörlük, Dizgi ve Kapak Tasarımı";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default Open Graph image for the site (and any route without its own).
export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #F7F4EF 0%, #EAEFE7 100%)",
          padding: "72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Logomark */}
          <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="#ffffff" />
            <path
              d="M16 31V17l16 14V17"
              stroke="#2A2E2A"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11 9c4-.4 9 .6 13 2.7v28C20 37.6 15 36.6 11 37V9z"
              stroke="#6E8268"
              strokeWidth="2.4"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M37 9c-4-.4-9 .6-13 2.7v28c4-2.1 9-3.1 13-2.7V9z"
              stroke="#8195A1"
              strokeWidth="2.4"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span style={{ fontSize: 34, fontWeight: 700, color: "#2A2E2A", letterSpacing: "-1px" }}>
            NERA<span style={{ color: "#6E8268" }}>AJANS</span>
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 64, fontWeight: 700, color: "#23271F", lineHeight: 1.1, letterSpacing: "-2px" }}>
            Kelimelerinize profesyonel
          </span>
          <span style={{ fontSize: 64, fontWeight: 700, color: "#6E8268", lineHeight: 1.1, letterSpacing: "-2px" }}>
            bir kimlik kazandırıyoruz.
          </span>
        </div>

        <span style={{ fontSize: 28, color: "#5E6358", fontFamily: "Arial, sans-serif" }}>
          Editörlük · Dizgi · Kapak Tasarımı
        </span>
      </div>
    ),
    { ...size },
  );
}
