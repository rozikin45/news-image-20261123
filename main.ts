// news-image-20261123 entry: copy the finished front page to /output/entry.png.
//
// The image itself (entry.png, in this repository) is the entry: a newspaper
// front page summing up the world's news of Monday 23 November 2026. This
// program only places that file where the grader expects it. It takes no
// network, no arguments and no environment beyond an optional output dir.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Every path is resolved from this file's own location, never from the
// working directory: the grader may launch main.ts from anywhere.
const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
if (!existsSync(source)) {
  throw new Error(`entry image missing next to main.ts: ${source}`);
}

// The grader mounts a writable /output; honour MAKEFUN_OUTPUT_DIR when a
// local run sets it, so `MAKEFUN_OUTPUT_DIR=out node main.ts` works too.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

const target = join(outDir, "entry.png");
copyFileSync(source, target);

// Read the copy back and check it byte for byte: a short or corrupt write
// must fail the run here, not surface as a broken image at grade time.
const written = readFileSync(target);
const original = readFileSync(source);
if (!written.equals(original)) {
  throw new Error(`copy mismatch: ${target} differs from ${source}`);
}
console.log(`wrote ${target} (${written.length} bytes, verified)`);
