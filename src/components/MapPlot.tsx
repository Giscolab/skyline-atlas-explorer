export function MapPlot({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 420"
      className={className}
      role="img"
      aria-label="Rendu schématique de calques géospatiaux : routes, eau, zonage et rail"
    >
      <defs>
        <linearGradient id="waterFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--water)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--water)" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* grille de projection */}
      <g stroke="var(--grid)" strokeWidth="1">
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="420" />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="600" y2={i * 50} />
        ))}
      </g>

      {/* eau */}
      <path
        d="M0 300 C 90 270 140 320 220 300 C 300 280 340 330 420 316 C 490 304 540 340 600 320 L600 420 L0 420 Z"
        fill="url(#waterFill)"
        stroke="var(--water)"
        strokeWidth="1.5"
      />

      {/* zonage */}
      <g fill="var(--zoning)" fillOpacity="0.1" stroke="var(--zoning)" strokeOpacity="0.5">
        <rect x="70" y="90" width="110" height="80" />
        <rect x="205" y="120" width="70" height="60" />
        <rect x="330" y="70" width="130" height="95" />
        <rect x="400" y="200" width="90" height="60" />
      </g>

      {/* routes */}
      <g stroke="var(--road)" strokeOpacity="0.75" strokeWidth="1.6" fill="none">
        <path d="M0 200 H600" />
        <path d="M60 0 V420" />
        <path d="M300 0 V300" />
        <path d="M480 0 V420" />
        <path d="M0 100 H600" />
        <path d="M0 60 C 160 90 220 20 380 60 C 470 82 520 40 600 62" strokeOpacity="0.4" />
      </g>

      {/* rail */}
      <path
        className="dash-flow"
        d="M0 250 C 120 230 190 268 300 246 C 410 224 500 262 600 240"
        fill="none"
        stroke="var(--rail)"
        strokeWidth="2"
        strokeDasharray="10 8"
      />

      {/* points de calibration */}
      <g fill="var(--primary)">
        {[
          [60, 200],
          [300, 100],
          [480, 246],
        ].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="3.5" />
            <circle cx={cx} cy={cy} r="10" fill="none" stroke="var(--primary)" strokeOpacity="0.4" />
          </g>
        ))}
      </g>
    </svg>
  );
}
