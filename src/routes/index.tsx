import { createFileRoute } from "@tanstack/react-router";
import {
  Github,
  Globe2,
  Layers,
  Mountain,
  Route as RouteIcon,
  TrainFront,
  Waves,
  Boxes,
  Cpu,
  FileJson,
  FlaskConical,
  Ruler,
  Map as MapIcon,
} from "lucide-react";
import { MapPlot } from "@/components/MapPlot";

const REPO = "https://github.com/Giscolab/CityTimeline-Mod";
const REALMAP_REPO = "https://github.com/Giscolab/cs2-realmap-generator";
const SITE_URL = "https://giscolab.github.io/CityTimeline-Mod/";
const TITLE = "CityTimelineMod — Overlays GeoJSON géospatiaux pour Cities: Skylines II";
const DESCRIPTION =
  "Mod de visualisation géospatiale pour Cities: Skylines II : chargement de bundles GeoJSON RealMap, calques routes, eau, zonage et rail, calibration spatiale et guidage géographique in-game. Extension LargeMap / PlayableWorld 57,344 km expérimentale.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "CityTimelineMod",
          applicationCategory: "GameApplication",
          operatingSystem: "Windows",
          description: DESCRIPTION,
          codeRepository: REPO,
          isAccessibleForFree: true,
        }),
      },
    ],
  }),
});

const layers = [
  {
    icon: RouteIcon,
    name: "Routes",
    color: "text-road",
    body: "Polylignes routières issues des bundles RealMap, tracées comme réseau de référence pour aligner le plan de ville.",
  },
  {
    icon: Waves,
    name: "Eau",
    color: "text-water",
    body: "Polygones hydrographiques (rivières, plans d'eau) rendus en superposition pour situer les contraintes naturelles.",
  },
  {
    icon: Boxes,
    name: "Zonage",
    color: "text-zoning",
    body: "Emprises de zonage affichées en surfaces semi-transparentes, à valeur indicative pour la lecture du tissu urbain.",
  },
  {
    icon: TrainFront,
    name: "Rail",
    color: "text-rail",
    body: "Tracés ferroviaires distincts, utiles pour repérer corridors et franchissements avant construction.",
  },
];

const architecture = [
  {
    icon: FileJson,
    title: "Ingestion GeoJSON",
    body: "Lecture de bundles RealMap : parsing des FeatureCollection, tri par type de calque, normalisation des coordonnées vers l'espace de jeu.",
  },
  {
    icon: Layers,
    title: "Pipeline de rendu par calques",
    body: "Chaque famille géométrique (lignes, polygones) est rendue dans un calque dédié, activable indépendamment pendant les tests.",
  },
  {
    icon: Ruler,
    title: "Calibration du terrain",
    body: "Outils de calage : échelle, décalage et orientation, pour faire correspondre le relief du jeu aux données sources.",
  },
  {
    icon: Globe2,
    title: "LargeMap / PlayableWorld",
    body: "Couche expérimentale visant une emprise de 57,344 km, avec séparation entre monde étendu et zone jouable.",
  },
];

const status = [
  {
    state: "Implémenté",
    tone: "accent" as const,
    items: [
      "Chargement des bundles GeoJSON RealMap",
      "Rendu des calques routes, eau, zonage, rail",
      "Contrôles d'affichage des overlays",
    ],
  },
  {
    state: "Expérimental",
    tone: "primary" as const,
    items: [
      "Calibration et alignement du terrain",
      "Extension LargeMap / PlayableWorld 57,344 km",
      "Stabilisation à l'exécution sur bundles très larges",
    ],
  },
  {
    state: "Non garanti",
    tone: "muted" as const,
    items: [
      "Génération automatique de routes constructibles",
      "Compatibilité avec l'ensemble des mods tiers",
      "Sauvegardes pérennes entre versions",
    ],
  },
];

function SectionHeading({
  index,
  kicker,
  title,
  lead,
}: {
  index: string;
  kicker: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="max-w-2xl">
      <p className="label-mono flex items-center gap-3">
        <span className="text-primary">{index}</span>
        <span className="h-px w-10 bg-border" />
        {kicker}
      </p>
      <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">{title}</h2>
      {lead ? <p className="mt-4 text-muted-foreground">{lead}</p> : null}
    </header>
  );
}

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-70" aria-hidden />
      <div className="pointer-events-none fixed inset-0 topo-bg" aria-hidden />

      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <a href="#overview" className="flex items-center gap-2.5">
            <MapIcon className="size-5 text-primary" aria-hidden />
            <span className="font-display text-sm font-semibold tracking-tight">
              CityTimelineMod
            </span>
          </a>
          <nav className="hidden items-center gap-6 md:flex">
            {[
              ["#overview", "Overview"],
              ["#world", "LargeMap (exp.)"],
              ["#layers", "Calques"],
              ["#architecture", "Architecture"],
              ["#status", "Statut"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="label-mono transition-colors hover:text-primary"
              >
                {label}
              </a>
            ))}
            <Link to="/demo" className="label-mono text-primary transition-opacity hover:opacity-80">
              Démo 3D
            </Link>
          </nav>

          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
          >
            <Github className="size-4" aria-hidden /> GitHub
          </a>
        </div>
      </header>

      <main className="relative z-10">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 glow-top" aria-hidden />
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-28">
            <div>
              <p className="label-mono inline-flex items-center gap-2 rounded-full border border-border px-3 py-1">
                <FlaskConical className="size-3.5 text-primary" aria-hidden />
                Overlays géospatiaux · Cities: Skylines II
              </p>
              <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] sm:text-6xl">
                Build cities from the real world.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                CityTimelineMod est avant tout un mod d'<strong>overlays GeoJSON</strong> et de{" "}
                <strong>visualisation géospatiale</strong> : il charge des bundles{" "}
                <strong>RealMap</strong> et les affiche directement en jeu — routes, eau, zonage et
                rail en calques superposés — avec calibration spatiale pour un guidage géographique
                pendant la construction.
              </p>
              <p className="mt-4 max-w-xl text-sm text-muted-foreground">
                Le chargement des bundles et le rendu des overlays sont implémentés. Le terrain,
                l'extension <strong>LargeMap / PlayableWorld 57,344 km</strong> et la stabilisation à
                l'exécution restent expérimentaux.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href={REPO}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Github className="size-4" aria-hidden /> Voir le code sur GitHub
                </a>
                <a
                  href="#architecture"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                >
                  Architecture technique
                </a>
              </div>
              <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-4">
                {[
                  ["4", "Calques géo"],
                  ["GeoJSON", "Format source"],
                  ["57,344 km", "LargeMap · exp."],
                  ["Expérimental", "Développement"],
                ].map(([v, k]) => (
                  <div key={k}>
                    <dt className="label-mono">{k}</dt>
                    <dd className="mt-1 font-mono text-lg text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="panel relative overflow-hidden p-3">
              <div className="flex items-center justify-between px-2 pb-3">
                <span className="label-mono">realmap_bundle.geojson</span>
                <span className="label-mono text-primary">layers · 4</span>
              </div>
              <div className="relative overflow-hidden rounded-sm border border-border bg-background">
                <MapPlot className="block w-full" />
                <div
                  className="scan-line pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                  aria-hidden
                />
              </div>
              <div className="flex flex-wrap gap-4 px-2 pt-3">
                {[
                  ["Routes", "bg-road"],
                  ["Eau", "bg-water"],
                  ["Zonage", "bg-zoning"],
                  ["Rail", "bg-rail"],
                ].map(([l, c]) => (
                  <span key={l} className="label-mono flex items-center gap-2">
                    <span className={`size-2 rounded-full ${c}`} aria-hidden />
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* OVERVIEW */}
        <section id="overview" className="border-b border-border">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <SectionHeading
              index="01"
              kicker="Overview"
              title="Visualisation géospatiale et guidage in-game"
              lead="Le cœur du projet : importer des bundles GeoJSON préparés par RealMap (cs2-realmap-generator), les projeter dans l'espace du jeu et les afficher en calques lisibles qui servent de repères géographiques pendant la construction."
            />
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: FileJson,
                  t: "Bundles RealMap",
                  b: "Les données géographiques sont fournies sous forme de bundles GeoJSON, lus au chargement puis répartis par type de calque.",
                },
                {
                  icon: Layers,
                  t: "Overlays in-game",
                  b: "Routes, eau, zonage et rail sont dessinés en superposition, sans remplacer les outils de construction du jeu.",
                },
                {
                  icon: Mountain,
                  t: "Calibration spatiale",
                  b: "Réglages d'échelle, de décalage et d'orientation pour aligner les géométries sur le terrain de jeu ; le calage du relief reste expérimental.",
                },
              ].map(({ icon: Icon, t, b }) => (
                <article key={t} className="panel p-6">
                  <Icon className="size-5 text-primary" aria-hidden />
                  <h3 className="mt-4 text-lg font-semibold">{t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 57 KM WORLD */}
        <section id="world" className="border-b border-border">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                index="02"
                kicker="Extension expérimentale"
                title="LargeMap / PlayableWorld — extension, pas objectif principal"
                lead="Cette couche est une extension exploratoire du mod, et non sa finalité : elle teste une emprise étendue de 57,344 km, où le monde large sert de contexte géographique continu autour d'une zone jouable plus restreinte."
              />
              <ul className="mt-8 space-y-4 text-sm text-muted-foreground">
                {[
                  "Extension optionnelle : le mod fonctionne sans elle, autour des overlays GeoJSON.",
                  "Séparation explicite entre LargeMap (contexte) et PlayableWorld (zone jouable).",
                  "Objectif : conserver la continuité des tracés géographiques au-delà des limites de carte.",
                  "Travaux en cours sur la précision de projection et le coût mémoire des grands bundles.",
                  "Comportement instable attendu : cette couche n'est pas finalisée.",
                ].map((li) => (
                  <li key={li} className="flex gap-3 border-l border-border pl-4">
                    {li}
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel p-6">
              <span className="label-mono">Emprise · schéma</span>
              <div className="mt-5 aspect-square w-full rounded-sm border border-border grid-bg p-[14%]">
                <div className="relative flex size-full items-center justify-center border border-primary/40">
                  <span className="label-mono absolute -top-3 left-2 bg-surface px-1 text-primary">
                    LargeMap 57,344 km
                  </span>
                  <div className="relative flex size-[44%] items-center justify-center border border-accent/70 bg-accent/10">
                    <span className="label-mono absolute -bottom-3 bg-surface px-1 text-accent-foreground">
                      PlayableWorld
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-5 text-xs text-muted-foreground">
                Schéma indicatif des proportions ; les valeurs finales dépendent des contraintes
                techniques encore à l'étude.
              </p>
            </div>
          </div>
        </section>

        {/* LAYERS */}
        <section id="layers" className="border-b border-border">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <SectionHeading
              index="03"
              kicker="Geospatial Layers"
              title="Quatre calques géographiques"
              lead="Chaque calque provient directement des géométries du bundle GeoJSON. Aucune donnée n'est inventée : ce qui n'est pas dans la source n'apparaît pas à l'écran."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {layers.map(({ icon: Icon, name, body, color }) => (
                <article
                  key={name}
                  className="panel group p-6 transition-colors hover:border-primary/60"
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`size-5 ${color}`} aria-hidden />
                    <span className="label-mono">layer</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ARCHITECTURE */}
        <section id="architecture" className="border-b border-border">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <SectionHeading
              index="04"
              kicker="Technical Architecture"
              title="Du fichier source au rendu"
              lead="Un pipeline volontairement simple, pensé pour être inspectable et modifiable pendant la phase de recherche."
            />
            <ol className="mt-12 grid gap-4 md:grid-cols-2">
              {architecture.map(({ icon: Icon, title, body }, i) => (
                <li key={title} className="panel flex gap-5 p-6">
                  <span className="label-mono pt-1 text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-primary" aria-hidden />
                      <h3 className="text-base font-semibold">{title}</h3>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="label-mono mt-8 flex items-center gap-2">
              <Cpu className="size-4 text-primary" aria-hidden />
              Cities: Skylines II · mod client · aucune dépendance serveur
            </p>
          </div>
        </section>

        {/* STATUS */}
        <section id="status" className="border-b border-border">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <SectionHeading
              index="05"
              kicker="Development Status"
              title="Où en est réellement le projet"
              lead="Transparence totale : le mod est en développement. Les éléments listés comme expérimentaux ou non garantis ne doivent pas être considérés comme fonctionnels."
            />
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {status.map((col) => (
                <article key={col.state} className="panel p-6">
                  <span
                    className={`label-mono inline-flex items-center gap-2 ${
                      col.tone === "primary"
                        ? "text-primary"
                        : col.tone === "accent"
                          ? "text-foreground"
                          : "text-muted-foreground"
                    }`}
                  >
                    <span
                      className={`size-2 rounded-full ${
                        col.tone === "primary"
                          ? "bg-primary"
                          : col.tone === "accent"
                            ? "bg-accent"
                            : "bg-muted-foreground"
                      }`}
                      aria-hidden
                    />
                    {col.state}
                  </span>
                  <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                    {col.items.map((it) => (
                      <li key={it} className="border-t border-border pt-3 first:border-0 first:pt-0">
                        {it}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* OPEN SOURCE */}
        <section id="open-source">
          <div className="mx-auto max-w-6xl px-5 py-24">
            <div className="panel relative overflow-hidden p-8 sm:p-14">
              <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" aria-hidden />
              <div className="relative max-w-2xl">
                <p className="label-mono text-primary">06 — Développement public</p>
                <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Développement public</h2>
                <p className="mt-4 text-muted-foreground">
                  CityTimelineMod est développé publiquement. Le dépôt contient le code du mod, les
                  notes de recherche et l'état d'avancement des couches expérimentales. Aucune
                  licence open source n'a encore été retenue : le code est consultable, sans
                  conditions de réutilisation définies à ce stade.
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Les bundles GeoJSON consommés par le mod sont produits par{" "}
                  <strong>cs2-realmap-generator</strong> (extraction OpenStreetMap, zonage, packs
                  GeoJSON).
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href={REPO}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 rounded-md bg-primary px-6 py-4 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <Github className="size-5" aria-hidden />
                    Giscolab/CityTimeline-Mod
                  </a>
                  <a
                    href={REALMAP_REPO}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 rounded-md border border-border px-6 py-4 text-base font-medium transition-colors hover:border-primary hover:text-primary"
                  >
                    <Github className="size-5" aria-hidden />
                    Giscolab/cs2-realmap-generator
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            CityTimelineMod · overlays GeoJSON et visualisation géospatiale pour Cities: Skylines II
            · développement expérimental.
          </p>
          <a href={REPO} target="_blank" rel="noreferrer" className="hover:text-primary">
            github.com/Giscolab/CityTimeline-Mod
          </a>
        </div>
      </footer>
    </div>
  );
}
