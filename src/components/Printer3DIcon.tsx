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
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Left Z-rail */}
      <line x1="3" y1="21" x2="3" y2="5" />
      {/* Right Z-rail */}
      <line x1="21" y1="21" x2="21" y2="5" />
      {/* Gantry X-bar */}
      <line x1="3" y1="5" x2="21" y2="5" />
      {/* Extruder carriage */}
      <rect x="8.5" y="3.5" width="7" height="4" rx="1" />
      {/* Nozzle tapered tip */}
      <path d="M10.5 7.5 L11.5 10.5 L12 11.2 L12.5 10.5 L13.5 7.5 Z" fill={color} stroke="none" />
      {/* Print bed */}
      <line x1="2" y1="21" x2="22" y2="21" strokeWidth="2.5" />
      {/* Object being printed */}
      <rect x="7" y="14.5" width="10" height="6" rx="0.5" />
      {/* Layer lines */}
      <line x1="7" y1="16.5" x2="17" y2="16.5" strokeOpacity="0.45" strokeWidth="1" />
      <line x1="7" y1="18.5" x2="17" y2="18.5" strokeOpacity="0.45" strokeWidth="1" />
    </svg>
  );
}
