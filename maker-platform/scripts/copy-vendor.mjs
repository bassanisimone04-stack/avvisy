/**
 * Copies the MapLibre web worker into /public so the bundler does not need to
 * resolve it. Runs automatically before `dev` and `build`.
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const dist = dirname(require.resolve("maplibre-gl/dist/maplibre-gl.css"));
mkdirSync("public/vendor/maplibre", { recursive: true });
copyFileSync(join(dist, "maplibre-gl-worker.mjs"), "public/vendor/maplibre/maplibre-gl-worker.mjs");
console.log("copied maplibre worker");
