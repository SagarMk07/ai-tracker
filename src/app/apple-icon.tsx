import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(150deg, #080b12, #101728)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "42px",
          border: "3px solid rgba(119,227,200,0.3)",
          color: "#77e3c8",
          fontSize: 70,
          fontWeight: 700,
        }}
      >
        FG
      </div>
    ),
    {
      ...size,
    }
  );
}
