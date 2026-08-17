import { ImageResponse } from "next/og";

export const alt = "Shibil Mohammed — Full-stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#101412",
        color: "#f5f5f4",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "72px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ color: "#b9f6d2", fontSize: 26, letterSpacing: "0.12em" }}>
        SHIBIL MOHAMMED
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: "-0.06em" }}>
          Full-stack Developer
        </div>
        <div style={{ color: "#a1a1aa", fontSize: 30 }}>
          I build products from the problem up.
        </div>
      </div>
      <div style={{ color: "#71717a", fontSize: 24 }}>Kerala, India · MERN · TypeScript</div>
    </div>,
    { ...size },
  );
}
