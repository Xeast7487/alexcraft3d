import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #4f46e5, #6366f1)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 110,
      }}
    >
      <svg
        width="320"
        height="320"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="3" y1="21" x2="3" y2="5" />
        <line x1="21" y1="21" x2="21" y2="5" />
        <line x1="3" y1="5" x2="21" y2="5" />
        <rect x="8.5" y="3.5" width="7" height="4" rx="1" />
        <path d="M10.5 7.5 L11.5 10.5 L12 11.2 L12.5 10.5 L13.5 7.5 Z" fill="white" stroke="none" />
        <line x1="2" y1="21" x2="22" y2="21" stroke-width="2.5" />
        <rect x="7" y="14.5" width="10" height="6" rx="0.5" />
        <line x1="7" y1="16.5" x2="17" y2="16.5" stroke-opacity="0.45" stroke-width="1" />
        <line x1="7" y1="18.5" x2="17" y2="18.5" stroke-opacity="0.45" stroke-width="1" />
      </svg>
    </div>,
    { width: 512, height: 512 }
  );
}
