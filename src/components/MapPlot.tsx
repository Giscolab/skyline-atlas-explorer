export function MapPlot({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 430"
      className={className}
      role="img"
      aria-label="Exemple cartographique de Lyon montrant les six calques GeoJSON superposés"
    >
      <defs>
        <linearGradient id="waterFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--water)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--water)" stopOpacity="0.12" />
        </linearGradient>
        <filter id="mapGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <rect width="600" height="430" fill="var(--background)" />

      {/* Grille de coordonnées */}
      <g stroke="var(--grid)" strokeWidth="1">
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="430" />
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="600" y2={i * 50} />
        ))}
      </g>

      {/* Zones urbaines : polygones, pas simples rectangles abstraits */}
      <g fill="var(--zoning)" fillOpacity="0.11" stroke="var(--zoning)" strokeOpacity="0.58">
        <path d="M64 86 176 70 204 120 176 178 78 164 52 122Z" />
        <path d="M218 98 306 78 352 112 334 178 248 188 204 146Z" />
        <path d="M382 70 512 88 548 148 504 198 400 180 364 126Z" />
        <path d="M92 220 202 204 238 254 200 302 106 288 68 252Z" />
        <path d="M360 226 478 208 540 256 518 318 398 326 346 278Z" />
      </g>

      {/* Rhône et Saône : repères géographiques immédiatement reconnaissables */}
      <path
        d="M282 -10 C276 58 294 104 282 150 C271 196 300 222 298 270 C296 330 322 370 316 440 L366 440 C371 372 340 324 346 264 C351 215 329 187 339 143 C350 94 329 43 335 -10Z"
        fill="url(#waterFill)"
        stroke="var(--water)"
        strokeWidth="2"
      />
      <path
        d="M124 -8 C130 48 154 82 180 112 C208 145 242 169 294 205 L319 236 C280 210 231 190 196 161 C151 124 101 76 88 -8Z"
        fill="url(#waterFill)"
        stroke="var(--water)"
        strokeWidth="2"
      />

      {/* Routes principales et secondaires */}
      <g stroke="var(--road)" fill="none" strokeLinecap="round">
        <g strokeOpacity="0.32" strokeWidth="1">
          <path d="M32 140 120 116 216 130 282 156" />
          <path d="M52 276 134 250 216 260 294 246" />
          <path d="M346 104 426 122 562 104" />
          <path d="M350 282 442 270 570 302" />
          <path d="M146 34 168 114 156 204 132 326" />
          <path d="M450 24 430 124 452 216 472 366" />
        </g>
        <g strokeOpacity="0.86" strokeWidth="2.2">
          <path d="M-10 190 C90 178 164 204 244 214 C272 218 286 218 302 218" />
          <path d="M344 218 C408 214 500 176 610 190" />
          <path d="M214 -10 C224 64 242 126 286 194" />
          <path d="M348 238 C390 284 430 334 448 440" />
        </g>
      </g>

      {/* Rail */}
      <path
        className="dash-flow"
        d="M-10 342 C102 316 184 330 274 302 C384 268 452 294 610 260"
        fill="none"
        stroke="var(--rail)"
        strokeWidth="2.4"
        strokeDasharray="11 7"
      />

      {/* Chemins */}
      <g stroke="var(--path)" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="3 5" fill="none">
        <path d="M28 400 C88 344 96 290 166 242" />
        <path d="M522 42 C474 102 490 168 544 220" />
        <path d="M382 392 C398 346 432 330 508 328" />
      </g>

      {/* Services : points / centroïdes */}
      <g fill="var(--service)" fillOpacity="0.9">
        {[
          [112, 118], [236, 132], [414, 116], [482, 166], [106, 258],
          [392, 252], [526, 286], [184, 286], [420, 308],
        ].map(([cx, cy]) => (
          <circle key={`s${cx}-${cy}`} cx={cx} cy={cy} r="4" />
        ))}
      </g>

      {/* Repère de calibration */}
      <circle cx="318" cy="218" r="20" fill="var(--primary)" fillOpacity="0.08" filter="url(#mapGlow)" />
      <g fill="var(--primary)">
        <circle cx="318" cy="218" r="4" />
        <circle cx="318" cy="218" r="11" fill="none" stroke="var(--primary)" strokeOpacity="0.65" />
      </g>

      {/* Libellés de lecture */}
      <g fontFamily="var(--font-mono)" letterSpacing="1.6">
        <text x="72" y="52" fill="var(--muted-foreground)" fontSize="10">LYON · EXTRAIT REALMAP</text>
        <text x="355" y="142" fill="var(--water)" fontSize="10">RHÔNE</text>
        <text x="142" y="88" fill="var(--water)" fontSize="10">SAÔNE</text>
        <text x="335" y="207" fill="var(--foreground)" fontSize="11">CENTRE DE LYON</text>
        <text x="335" y="224" fill="var(--primary)" fontSize="9">POINT DE CALIBRATION</text>
      </g>

      {/* Nord et échelle */}
      <g transform="translate(548 38)" stroke="var(--foreground)" fill="none">
        <path d="M0 18 8 0l8 18-8-4Z" strokeWidth="1.4" />
        <text x="8" y="-6" textAnchor="middle" fill="var(--foreground)" stroke="none" fontFamily="var(--font-mono)" fontSize="10">N</text>
      </g>
      <g transform="translate(454 400)" fontFamily="var(--font-mono)" fontSize="9" fill="var(--muted-foreground)">
        <path d="M0 0h92M0-4v8M46-4v8M92-4v8" stroke="var(--foreground)" />
        <text x="46" y="17" textAnchor="middle">2 KM</text>
      </g>
    </svg>
  );
}
