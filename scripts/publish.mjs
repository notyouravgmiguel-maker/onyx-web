// Copies the Vite build (dist/) into the project root, which WAMP serves.
// Old hashed bundles are removed first so assets/ doesn't accumulate stale files.
import { cpSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const assets = join(root, "assets");
const hashed = /^(index|icon)-[\w-]+\.(js|css|png)$/;

for (const file of readdirSync(assets)) {
  if (hashed.test(file)) rmSync(join(assets, file));
}
cpSync(join(root, "dist"), root, { recursive: true });
console.log("Published dist/ to project root.");
