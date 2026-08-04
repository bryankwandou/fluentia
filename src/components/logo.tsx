import { cn } from "@/lib/utils";

/**
 * The Cadence Mark.
 *
 * A single vertical stem carries three horizontal strokes that grow as they
 * rise. Read one way it is an F; read another it is a voice gaining range,
 * or the ascending tone contour that Mandarin learners drill for months.
 * The notch cut into the stem is the pause a fluent speaker leaves behind.
 */
export function LogoMark({ className, id = "fl" }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("h-8 w-8", className)} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-a`} x1="6" y1="42" x2="42" y2="6" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" />
          <stop offset="0.55" stopColor="#34d399" />
          <stop offset="1" stopColor="#7de6bd" />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f5a524" />
          <stop offset="1" stopColor="#ff6b5b" />
        </linearGradient>
      </defs>

      <rect x="1" y="1" width="46" height="46" rx="13" fill="#0b1815" stroke="rgba(255,255,255,0.1)" />

      {/* stem, broken by a deliberate rest */}
      <rect x="12" y="11" width="5" height="11" rx="2.5" fill={`url(#${id}-a)`} />
      <rect x="12" y="25" width="5" height="12" rx="2.5" fill={`url(#${id}-a)`} />

      {/* three rising strokes: the tone contour */}
      <rect x="20" y="30" width="8" height="5" rx="2.5" fill={`url(#${id}-a)`} opacity="0.55" />
      <rect x="20" y="21" width="13" height="5" rx="2.5" fill={`url(#${id}-a)`} opacity="0.8" />
      <rect x="20" y="12" width="17" height="5" rx="2.5" fill={`url(#${id}-a)`} />

      {/* the seal: proof anchored on chain */}
      <circle cx="36.5" cy="33.5" r="4" fill={`url(#${id}-b)`} />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {!compact && (
        <span className="text-[17px] font-semibold tracking-[-0.02em] text-paper">
          Fluentia
        </span>
      )}
    </span>
  );
}
