# Plan : ajouter une démo 3D marketing à CityTimelineMod

## Objectif
Ajouter une démonstration 3D interactive au site existant, à vocation marketing/démo, sans modifier le design actuel de la page d'accueil. La démo illustrera les trois cas évoqués :
1. Visualisation 3D web des calques GeoJSON (routes, eau, zonage, rail).
2. Aperçu 3D du terrain avec relief procédural.
3. Représentation conceptuelle du rendu in-game (caméra et scène stylisée type "éditeur CS2").

## Choix d'implémentation
- Créer une **route dédiée** `/demo` (ou `/3d`) montée en `ssr: false`, car `<Canvas>` de React Three Fiber ne doit pas être rendu côté serveur dans TanStack Start.
- Ajouter un **lien discret** vers cette démo dans la page d'accueil existante (header + section Overview), afin de ne pas alourdir ni modifier la structure actuelle.
- Utiliser **React Three Fiber v9** et **Drei v10**, compatibles avec React 19 déjà présent dans le projet.
- La scène restera légère : géométries procédurales, pas de modèles externes lourds, pas de chargement de textures distantes.

## Contenu de la démo 3D
La scène affichera :
- Un **terrain généré procéduralement** (planeGeometry avec displacement via bruit simple ou hauteur sinusoïdale) pour illustrer la calibration du relief.
- Les **quatre calques géospatiaux** issus du bundle GeoJSON :
  - Routes : lignes 3D épaisses (tube ou lineSegments) en couleur `--road`.
  - Eau : surface plane semi-transparente en couleur `--water`.
  - Zonage : surfaces extrudées en couleur `--zoning`.
  - Rail : lignes 3D avec effet de dash animé en couleur `--rail`.
- Des **points de calibration** verticaux marqués en `--primary`.
- Une **caméra orbitale** (OrbitControls) et un panneau de toggles pour activer/désactiver chaque calque.
- Un bandeau "Démonstration web uniquement — le rendu final dépend de l'API modding de Cities: Skylines II" pour ne pas prétendre que c'est le jeu.

## Fichiers créés / modifiés
- `src/routes/demo.tsx` : nouvelle route client-only `/demo` avec la scène 3D.
- `src/components/GeoScene3D.tsx` : composant React Three Fiber encapsulant la scène, les lumières, le terrain et les calques.
- `src/components/LayerToggle.tsx` : panneau de contrôle des calques (DOM overlay).
- `src/routes/index.tsx` : ajout d'un lien "Démo 3D" dans le header et d'un court renvoi dans la section Overview.
- `package.json` : ajout de `three`, `@react-three/fiber@^9`, `@react-three/drei@^10` et `@types/three` en dev.
- `src/styles.css` : ajout éventuel d'une utilité pour le canvas plein écran, sans toucher aux styles existants.

## Compatibilité et contraintes
- La route `/demo` sera en `ssr: false` pour éviter les problèmes d'hydratation liés au canvas WebGL.
- Les chemins d'assets resteront relatifs pour préserver la compatibilité GitHub Pages sous `/CityTimeline-Mod/`.
- Aucune ressource externe (CDN d'HDRI, modèles GLB) ne sera chargée : tout est procédural pour garantir la fiabilité du déploiement.
- Le site restera responsive : la démo s'adaptera à la taille de l'écran, avec un fallback texte si WebGL est indisponible.

## Métadonnées
- Ajouter des métadonnées SEO/OpenGraph spécifiques à la route `/demo` (titre, description, canonical `https://giscolab.github.io/CityTimeline-Mod/demo`).
- Conserver intactes les métadonnées de la page d'accueil.

## Livrables et validation
- Build statique réussi avec `BASE_PATH=/CityTimeline-Mod/`.
- Vérification visuelle de la scène 3D (terrain + 4 calques + caméra interactive).
- Vérification que la page d'accueil n'est pas altérée visuellement.
- Vérification des liens et des métadonnées.