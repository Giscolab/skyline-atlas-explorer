import { createFileRoute, Link, ClientOnly } from "@tanstack/react-router";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { lazy, Suspense } from "react";

const GeoScene3D = lazy(() =>
  import("@/components/GeoScene3D").then((m) => ({ default: m.GeoScene3D }))
);

function SceneSkeleton() {
  return (
    <div className="flex h-[60vh] min-h-[420px] w-full items-center justify-center rounded-lg border border-border bg-background sm:h-[70vh]">
      <p className="label-mono text-muted-foreground">Chargement de la scène 3D…</p>
    </div>
  );
}

const CANONICAL = "https://giscolab.github.io/CityTimeline-Mod/demo";
const TITLE = "Démo 3D — CityTimelineMod";
const DESCRIPTION =
  "Démonstration web 3D des calques GeoJSON de CityTimelineMod : routes, eau, zonage, rail, relief procédural et points de calibration.";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
  }),
  component: DemoPage,
});

function DemoPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-70" aria-hidden />
      <div className="pointer-events-none fixed inset-0 topo-bg" aria-hidden />

      <main className="relative z-10 mx-auto max-w-6xl px-5 py-16">
        <Link
          to="/"
          className="label-mono inline-flex items-center gap-2 transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-3.5" aria-hidden /> Retour au site
        </Link>

        <p className="label-mono mt-8 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1">
          <FlaskConical className="size-3.5 text-primary" aria-hidden />
          Démonstration expérimentale
        </p>
        <h1 className="mt-6 text-balance text-3xl font-semibold leading-tight sm:text-5xl">
          Démo 3D des calques géospatiaux
        </h1>
        <p className="mt-5 max-w-2xl text-muted-foreground">
          Aperçu web du relief procédural et des quatre calques d'un bundle RealMap. Utilisez la
          souris pour orbiter, zoomer et déplacer la caméra ; activez ou désactivez chaque calque
          depuis le panneau.
        </p>

        <div className="mt-10">
          <ClientOnly fallback={<SceneSkeleton />}>
            <Suspense fallback={<SceneSkeleton />}>
              <GeoScene3D />
            </Suspense>
          </ClientOnly>
        </div>
      </main>
    </div>
  );
}
