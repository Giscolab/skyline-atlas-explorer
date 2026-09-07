import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Github,
  Globe2,
  Layers,
  Route as RouteIcon,
  TrainFront,
  Waves,
  Boxes,
  Cpu,
  FileJson,
  FlaskConical,
  Ruler,
  Map as MapIcon,
  Footprints,
  Hospital,
  Image as ImageIcon,
  Mountain,
  Keyboard,
  Terminal,
  ShieldAlert,
} from "lucide-react";
import { MapPlot } from "@/components/MapPlot";

const REPO = "https://github.com/Giscolab/CityTimeline-Mod";
const REALMAP_REPO = "https://github.com/Giscolab/cs2-realmap-generator";
const SITE_URL = "https://giscolab.github.io/CityTimeline-Mod/";
const TITLE = "CityTimelineMod — Overlays GeoJSON géospatiaux pour Cities: Skylines II";
const DESCRIPTION =
  "Mod Cities: Skylines II qui charge un bundle GeoJSON déjà généré par cs2-realmap-generator et l'affiche en calques visuels : routes (6 classes), chemins, eau, zonage (7 couches), rail et 9 familles de services. Module LargeMap 57,344 km expérimental. Aucun import ni spawn en jeu.";

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
          softwareVersion: "0.1.2",
          description: DESCRIPTION,
          codeRepository: REPO,
          programmingLanguage: "C#",
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
    dot: "bg-road",
    detail: "6 classes",
    body: "Polylignes issues du pack GeoJSON, scindées par classe : highway, ramp, large, medium, small, gravel, plus une variante « driveable » découpée sur l'emprise.",
  },
  {
    icon: Footprints,
    name: "Chemins",
    color: "text-path",
    dot: "bg-path",
    detail: "paths.geojson",
    body: "Calque séparé des cheminements piétons et sentiers, utile pour lire la trame fine du tissu urbain sans surcharger les routes.",
  },
  {
    icon: Waves,
    name: "Eau",
    color: "text-water",
    dot: "bg-water",
    detail: "linéaire + surfacique",
    body: "Deux fichiers distincts, découpés sur l'emprise du heightmap : water_lines_clipped pour les cours d'eau, water_areas_clipped pour les plans d'eau.",
  },
  {
    icon: Boxes,
    name: "Zonage",
    color: "text-zoning",
    dot: "bg-zoning",
    detail: "7 couches",
    body: "Résidentiel, commercial, retail, bureau, industriel, mixte et stationnement, avec leurs agrégats et le polygone de zonage global.",
  },
  {
    icon: TrainFront,
    name: "Rail",
    color: "text-rail",
    dot: "bg-rail",
    detail: "calque autonome",
    body: "railways.geojson couvre rail, voie étroite, tram, light rail et métro, ainsi que les voies de service (faisceaux, garages, antennes, communications).",
  },
  {
    icon: Hospital,
    name: "Services",
    color: "text-service",
    dot: "bg-service",
    detail: "9 familles",
    body: "Éducation, incendie, santé, parcs, électricité, déchets, transport, eau, communications — en points ou centroïdes uniquement, sans réseaux techniques.",
  },
];

const pipeline = [
  {
    icon: Globe2,
    title: "Extraction OpenStreetMap",
    body: "Requêtes Overpass avec découpage automatique des grandes emprises, reprises et cache réutilisable, puis classification des objets vers les catégories du jeu.",
  },
  {
    icon: FileJson,
    title: "Pack GeoJSON validé",
    body: "31 sources GeoJSON contrôlées par index (couches, routes, services) et un rapport d'extraction, assemblées en un bundle de 34 fichiers.",
  },
  {
    icon: ImageIcon,
    title: "Worldmap + heightmap PNG",
    body: "Deux PNG 16 bits jusqu'à 4096 px : worldmap sur l'emprise étendue, heightmap sur l'emprise jouable, avec normalisation d'altitude paramétrable.",
  },
  {
    icon: Terminal,
    title: "Manifeste et synchronisation",
    body: "manifest.json, timeline_config.json et bundle_index.json sont écrits puis synchronisés vers le mod de façon atomique ; la publication est refusée si le jeu tourne.",
  },
];

const architecture = [
  {
    icon: Cpu,
    title: "Outillage officiel + Harmony",
    body: "Mod C# compilé avec le SDK de modding Cities: Skylines II (Mod.props / Mod.targets), patché via Harmony 2.2.2 et lecture JSON par Newtonsoft.Json. Ni BepInEx, ni Unity Mod Manager.",
  },
  {
    icon: FileJson,
    title: "Résolution du bundle",
    body: "Le mod lit bundle_index.json depuis un dossier de bundles configurable, sélectionne le bundle actif et vérifie la présence des fichiers requis avant tout affichage.",
  },
  {
    icon: Layers,
    title: "Overlay au sol",
    body: "Les géométries sont converties en lots de maillage rendus au sol, calque par calque. Aucun objet de jeu n'est créé : l'affichage reste visuel et informatif.",
  },
  {
    icon: Keyboard,
    title: "Interfaces de contrôle",
    body: "Un HUD React (interface CoHTML du jeu) sur Alt+Z, encore en construction, et un panneau de débogage historique sur Alt+H. Réglages persistés dans config.json.",
  },
];

const status = [
  {
    state: "Implémenté",
    tone: "accent" as const,
    items: [
      "Lecture du bundle GeoJSON et de son index",
      "Rendu des calques routes, chemins, eau, zonage, rail, services",
      "Aide au calage du terrain et panneau de débogage",
      "Pipeline de génération complet côté générateur",
    ],
  },
  {
    state: "Expérimental",
    tone: "primary" as const,
    items: [
      "Module LargeMap 57,344 km (actif par défaut)",
      "Module PlayableWorld (désactivé par défaut, dépend de LargeMap)",
      "HUD React en cours de construction",
      "Stabilité à l'exécution sur emprises très larges",
    ],
  },
  {
    state: "Hors périmètre",
    tone: "muted" as const,
    items: [
      "Import ou spawn de routes en jeu : code exclu de la compilation",
      "Aucun téléchargement de données depuis le mod",
      "Services en polygones ou réseaux techniques (égouts, lignes)",
      "Aucune version de jeu garantie, aucune licence retenue pour le mod",
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
              ["#pipeline", "Pipeline"],
              ["#layers", "Calques"],
              ["#world", "LargeMap (exp.)"],
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
                Overlays géospatiaux · Cities: Skylines II · v0.1.2
              </p>
              <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] sm:text-6xl">
                Build cities from the real world.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                CityTimelineMod charge un <strong>bundle GeoJSON déjà généré</strong> par{" "}
                <strong>cs2-realmap-generator</strong> et l'affiche sur la carte du jeu en calques
                lisibles — routes, chemins, eau, zonage, rail et services — pour servir de repères
                géographiques pendant la construction.
              </p>
              <p className="mt-4 max-w-xl text-sm text-muted-foreground">
                Le mod ne génère aucune donnée et ne télécharge rien. Les calques restent{" "}
                <strong>visuels et informatifs</strong> : aucun objet n'est créé dans le jeu. Le
                module <strong>LargeMap 57,344 km</strong> et son extension PlayableWorld sont
                explicitement <strong>expérimentaux</strong>.
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
                  href="#pipeline"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                >
                  Pipeline de données
                </a>
              </div>
              <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-4">
                {[
                  ["34", "Fichiers du bundle"],
                  ["31", "Sources GeoJSON"],
                  ["9", "Familles de services"],
                  ["57,344 km", "LargeMap · exp."],
                ].map(([v, k]) => (
                  <div key={k}>
                    <dt className="label-mono">{k}</dt>
                    <dd className="mt-1 font-mono text-lg text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="panel relative overflow-hidden p-3 sm:p-4">
              <div className="flex items-start justify-between gap-4 px-1 pb-3">
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">Les données réelles, superposées sur la carte</p>
                  <p className="mt-1 font-mono text-[0.62rem] text-muted-foreground">Exemple de lecture · extrait de Lyon</p>
                </div>
                <span className="shrink-0 rounded-sm border border-primary/30 bg-primary/10 px-2 py-1 font-mono text-[0.62rem] text-primary">6 calques</span>
              </div>
              <div className="relative overflow-hidden rounded-sm border border-border bg-background">
                <MapPlot className="block w-full" />
                <div
                  className="scan-line pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                  aria-hidden
                />
              </div>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-3">
                {layers.map(({ name, dot, detail }) => (
                  <div key={name} className="flex min-w-0 items-center gap-2 bg-surface px-3 py-2.5">
                    <span className={`size-2.5 shrink-0 rounded-full ${dot}`} aria-hidden />
                    <span className="min-w-0">
                      <span className="block text-xs font-medium text-foreground">{name}</span>
                      <span className="block truncate font-mono text-[0.58rem] text-muted-foreground">{detail}</span>
                    </span>
                  </div>
                ))}
              </div>
              <p className="px-1 pt-3 text-xs leading-relaxed text-muted-foreground">
                Chaque couleur correspond à un fichier ou groupe de fichiers du bundle, affiché au même emplacement géographique.
              </p>
            </div>
          </div>
        </section>

        {/* OVERVIEW */}
        <section id="overview" className="border-b border-border">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <SectionHeading
              index="01"
              kicker="Overview"
              title="Un lecteur de bundles, pas un générateur"
              lead="La séparation est nette : cs2-realmap-generator prépare les données hors du jeu, CityTimelineMod les lit et les affiche. Le mod vérifie d'abord le contrat du bundle, puis dessine les calques au sol."
            />
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: FileJson,
                  t: "Bundle déjà généré",
                  b: "Le mod lit bundle_index.json, résout le bundle actif et exige au minimum l'eau linéaire, l'eau surfacique et les polygones de zonage avant d'afficher quoi que ce soit.",
                },
                {
                  icon: Layers,
                  t: "Calques visuels au sol",
                  b: "Chaque famille de géométries devient un lot de maillage affiché sur le terrain. Aucun prefab, aucun spawner, aucune modification des réseaux du jeu.",
                },
                {
                  icon: Ruler,
                  t: "Aide au calage",
                  b: "Des réglages de calibration aident à faire correspondre les géométries au relief importé ; l'alignement fin du terrain reste un chantier ouvert.",
                },
              ].map(({ icon: Icon, t, b }) => (
                <article key={t} className="panel p-6">
                  <Icon className="size-5 text-primary" aria-hidden />
                  <h3 className="mt-4 text-lg font-semibold">{t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b}</p>
                </article>
              ))}
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              Un aperçu web des calques, construit à partir d'un vrai extrait OpenStreetMap et d'un
              relief réel, est disponible dans la{" "}
              <Link to="/demo" className="text-primary underline underline-offset-4">
                démo 3D interactive
              </Link>{" "}
              (hors jeu, à titre de démonstration).
            </p>
          </div>
        </section>

        {/* PIPELINE */}
        <section id="pipeline" className="border-b border-border">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <SectionHeading
              index="02"
              kicker="Pipeline de données"
              title="Du relevé OpenStreetMap au calque affiché"
              lead="Le générateur est un pipeline Python en ligne de commande : une seule entrée produit le pack GeoJSON, les deux PNG, le manifeste, puis synchronise le résultat vers le mod."
            />

            <ol className="mt-12 grid gap-4 lg:grid-cols-4">
              {pipeline.map(({ icon: Icon, title, body }, i) => (
                <li key={title} className="panel relative p-6">
                  <span
                    className="absolute right-4 top-4 font-mono text-3xl text-primary/15"
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon className="size-5 text-primary" aria-hidden />
                  <h3 className="mt-4 text-base font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
              <div className="panel overflow-hidden">
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                  <span className="label-mono">exports / bundles / &lt;bundle_id&gt;</span>
                  <span className="label-mono text-primary">34 fichiers</span>
                </div>
                <pre className="overflow-x-auto px-5 py-4 font-mono text-[0.72rem] leading-relaxed text-muted-foreground">
                  {`geojson_pack/
├─ geojson/
│  ├─ all_features.geojson        # base overlays (hors rail & services)
│  ├─ roads.geojson  + 8 variantes de classe
│  ├─ paths.geojson
│  ├─ water_lines_clipped.geojson
│  ├─ water_areas_clipped.geojson
│  ├─ zoning_polygons.geojson  + 7 couches
│  ├─ railways.geojson
│  └─ services/  ×9  (education, medical, …)
├─ reports/  extraction_report · layer_index
│            roads_index · services_index
├─ worldmap.png     # emprise étendue, 16 bits
├─ heightmap.png    # emprise jouable, 16 bits
├─ manifest.json · timeline_config.json
└─ bundle_index.json`}
                </pre>
              </div>

              <div className="panel p-6">
                <span className="label-mono text-primary">Paramètres réels du générateur</span>
                <dl className="mt-5 space-y-3 text-sm">
                  {[
                    ["Emprise worldmap", "57,344 km"],
                    ["Emprise heightmap", "14,336 km"],
                    ["Résolution PNG", "4096 px · 16 bits"],
                    ["Niveau de mer CS2", "511,7 m"],
                    ["Identifiant de bundle", "ville_pays_lat_lon"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-baseline justify-between gap-4 border-t border-border pt-3 first:border-0 first:pt-0"
                    >
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-mono text-foreground">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 flex gap-3 border-l border-primary/40 pl-4 text-xs text-muted-foreground">
                  <Mountain className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  Les altitudes proviennent de tuiles Terrain-RGB (clé d'API requise) ou du service
                  américain 3DEP, limité aux États-Unis continentaux.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LAYERS */}
        <section id="layers" className="border-b border-border">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <SectionHeading
              index="03"
              kicker="Geospatial Layers"
              title="Six familles de calques, telles qu'elles existent dans le bundle"
              lead="Chaque calque provient directement des fichiers du pack. Rien n'est inventé : ce qui n'est pas dans la source n'apparaît pas à l'écran."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {layers.map(({ icon: Icon, name, body, color, detail }) => (
                <article
                  key={name}
                  className="panel group p-6 transition-colors hover:border-primary/60"
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`size-5 ${color}`} aria-hidden />
                    <span className="label-mono">{detail}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{body}</p>
                </article>
              ))}
            </div>
            <p className="mt-8 flex gap-3 text-sm text-muted-foreground">
              <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              Limites connues du générateur : les services sont réduits à des points ou centroïdes,
              et la densité résidentielle reste basse par défaut car l'étiquette du nombre d'étages
              manque souvent dans OpenStreetMap.
            </p>
          </div>
        </section>

        {/* LARGEMAP */}
        <section id="world" className="border-b border-border">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                index="04"
                kicker="Module expérimental"
                title="LargeMap 57,344 km = 14,336 km × 4"
                lead="Le module étend l'emprise de la carte d'origine du jeu par un facteur 4, via des patches Harmony sur les systèmes de terrain et de monde. Le monde étendu sert de contexte géographique autour d'une zone jouable plus restreinte."
              />
              <ul className="mt-8 space-y-4 text-sm text-muted-foreground">
                {[
                  "Carte d'origine 14 336 m ; facteur 4 ; emprise étendue 57 344 m.",
                  "LargeMap est actif par défaut ; PlayableWorld est désactivé par défaut et en dépend.",
                  "Les deux modules sont documentés comme expérimentaux dans le dépôt.",
                  "Des garde-fous de sécurité existent dans le code pour neutraliser le module en cas de faute à l'exécution.",
                  "Comportement instable attendu sur les grandes emprises : cette couche n'est pas finalisée.",
                ].map((li) => (
                  <li key={li} className="flex gap-3 border-l border-border pl-4">
                    {li}
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel p-6">
              <div className="flex items-center justify-between">
                <span className="label-mono">Emprise · proportions réelles</span>
                <span className="label-mono text-primary">×4</span>
              </div>
              <div className="mt-5 aspect-square w-full rounded-sm border border-border grid-bg p-[10%]">
                <div className="relative flex size-full items-center justify-center border border-primary/40">
                  <span className="label-mono absolute -top-3 left-2 bg-surface px-1 text-primary">
                    LargeMap 57 344 m
                  </span>
                  <div className="relative flex size-1/4 items-center justify-center border border-accent/70 bg-accent/15">
                    <span className="label-mono absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-surface px-1 text-accent-foreground">
                      14 336 m
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-5 text-xs text-muted-foreground">
                Le carré intérieur représente l'emprise du jeu d'origine, soit un quart du côté de
                l'emprise étendue — l'échelle du schéma est exacte.
              </p>
            </div>
          </div>
        </section>

        {/* ARCHITECTURE */}
        <section id="architecture" className="border-b border-border">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <SectionHeading
              index="05"
              kicker="Technical Architecture"
              title="Côté mod : lecture, vérification, rendu"
              lead="Un mod C# compilé avec l'outillage officiel du jeu, volontairement inspectable : le code source public montre aussi ce qui est délibérément exclu de la compilation."
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
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {[
                "C# · SDK de modding officiel",
                "Harmony 2.2.2",
                "Newtonsoft.Json 13.0.3",
                "HUD React · interface du jeu",
                "Générateur Python 3.11",
              ].map((tag) => (
                <span key={tag} className="label-mono flex items-center gap-2">
                  <Cpu className="size-3.5 text-primary" aria-hidden />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* STATUS */}
        <section id="status" className="border-b border-border">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <SectionHeading
              index="06"
              kicker="Development Status"
              title="Où en est réellement le projet"
              lead="Le mod est en développement expérimental. Ce qui est listé comme expérimental ou hors périmètre ne doit pas être considéré comme fonctionnel."
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

        {/* DÉVELOPPEMENT PUBLIC */}
        <section id="open-source">
          <div className="mx-auto max-w-6xl px-5 py-24">
            <div className="panel relative overflow-hidden p-8 sm:p-14">
              <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" aria-hidden />
              <div className="relative max-w-2xl">
                <p className="label-mono text-primary">07 — Développement public</p>
                <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Deux dépôts, un pipeline</h2>
                <p className="mt-4 text-muted-foreground">
                  <strong>CityTimeline-Mod</strong> contient le mod C#, son interface et la
                  documentation de son fonctionnement à l'exécution. Aucune licence n'a encore été
                  retenue pour ce dépôt : le code est consultable, sans conditions de réutilisation
                  définies à ce stade.
                </p>
                <p className="mt-4 text-muted-foreground">
                  <strong>cs2-realmap-generator</strong> contient le pipeline Python d'extraction,
                  ses outils de validation et un visualiseur cartographique web ; il est publié sous
                  licence MIT.
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
            CityTimelineMod · overlays GeoJSON pour Cities: Skylines II · développement expérimental
            · données OpenStreetMap (ODbL).
          </p>
          <a href={REPO} target="_blank" rel="noreferrer" className="hover:text-primary">
            github.com/Giscolab/CityTimeline-Mod
          </a>
        </div>
      </footer>
    </div>
  );
}
