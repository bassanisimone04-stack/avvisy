/**
 * Minifies every file in src/js/ into assets/js/, preserving filenames.
 *
 *   node scripts/build-js.mjs      (or: npm run build:js)
 *
 * src/js/ is the authored source — comments, real names, readable control
 * flow. assets/js/ is a build artifact, exactly like assets/css/site.css is
 * for src/styles/tailwind.css: never hand-edit it, it will be overwritten.
 *
 * License comments (/*! ... *\/) are preserved; every other comment is
 * stripped. mangle is on (short local variable names) but toplevel is left
 * alone — every file here is a self-invoking function with nothing exported,
 * so there is nothing global to mangle safely differently from what terser
 * already does correctly by default.
 */
import { minify } from "terser";
import { readdirSync, mkdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src", "js");
const OUT = join(ROOT, "assets", "js");

mkdirSync(OUT, { recursive: true });

const files = readdirSync(SRC).filter((f) => f.endsWith(".js"));
let totalIn = 0;
let totalOut = 0;

for (const file of files) {
  const srcPath = join(SRC, file);
  const code = readFileSync(srcPath, "utf8");
  const result = await minify(code, {
    compress: true,
    mangle: true,
    format: { comments: /^!/ },
  });
  if (result.error) throw result.error;

  const outPath = join(OUT, file);
  writeFileSync(outPath, result.code, "utf8");

  const inSize = statSync(srcPath).size;
  const outSize = statSync(outPath).size;
  totalIn += inSize;
  totalOut += outSize;
  console.log(`  ✓ ${file}  ${inSize}B → ${outSize}B (${Math.round((1 - outSize / inSize) * 100)}% smaller)`);
}

console.log(`\n${files.length} files: ${totalIn}B → ${totalOut}B total (${Math.round((1 - totalOut / totalIn) * 100)}% smaller)`);
