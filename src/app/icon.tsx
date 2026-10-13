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
        <line x1="3" y1="21" x2="3" y2="6" />
        <line x1="21" y1="21" x2="21" y2="6" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <rect x="9" y="4" width="6" height="4" rx="1" />
        <path d="M12 8 L10.5 12 L12 13 L13.5 12 Z" fill="white" stroke="none" />
        <rect x="2" y="21" width="20" height="2" rx="1" fill="white" stroke="none" opacity="0.9" />
        <path d="M8 18 L12 15.5 L16 18" stroke-opacity="0.5" />
        <rect x="8" y="18" width="8" height="3" rx="0.3" />
        <path d="M16 18 L16 21 L18.5 19.5 L18.5 16.5 Z" stroke-opacity="0.7" />
        <path d="M8 18 L10.5 16.5 L18.5 16.5 L16 18 Z" stroke-opacity="0.7" />
      </svg>
    </div>,
    { width: 512, height: 512 }
  );
}
