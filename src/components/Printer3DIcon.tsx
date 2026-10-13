export default function Printer3DIcon({
  size = 24,
  color = "currentColor",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Left vertical rail */}
      <line x1="3" y1="21" x2="3" y2="6" />
      {/* Right vertical rail */}
      <line x1="21" y1="21" x2="21" y2="6" />
      {/* Top horizontal gantry bar */}
      <line x1="3" y1="6" x2="21" y2="6" />
      {/* Extruder carriage on gantry */}
      <rect x="9" y="4" width="6" height="4" rx="1" />
      {/* Nozzle */}
      <path d="M12 8 L10.5 12 L12 13 L13.5 12 Z" fill={color} stroke="none" />
      {/* Print bed */}
      <rect x="2" y="21" width="20" height="2" rx="1" fill={color} stroke="none" opacity="0.9" />
      {/* Object being printed — isometric cube layers */}
      {/* Back-top face */}
      <path d="M8 18 L12 15.5 L16 18" strokeOpacity="0.5" />
      {/* Front face */}
      <rect x="8" y="18" width="8" height="3" rx="0.3" />
      {/* Right side face */}
      <path d="M16 18 L16 21 L18.5 19.5 L18.5 16.5 Z" strokeOpacity="0.7" />
      {/* Top face */}
      <path d="M8 18 L10.5 16.5 L18.5 16.5 L16 18 Z" strokeOpacity="0.7" />
    </svg>
  );
}
