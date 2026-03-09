import fs from "fs";
import path from "path";

/**
 * Script per automatizzare la sincronizzazione degli export.
 * Scansiona una cartella, crea/aggiorna l'index.ts e aggiunge l'export al package.json.
 *
 * Utilizzo: node tooling/scripts/sync-exports.js packages/auth/src/web/hooks
 */

const targetDir = process.argv[2];

if (!targetDir) {
  console.error("Errore: Specifica una cartella target.");
  process.exit(1);
}

const absoluteTargetDir = path.resolve(process.cwd(), targetDir);

if (!fs.existsSync(absoluteTargetDir) || !fs.statSync(absoluteTargetDir).isDirectory()) {
  console.error("Errore: La cartella specificata non esiste.");
  process.exit(1);
}

// 1. Genera index.ts
const files = fs.readdirSync(absoluteTargetDir)
  .filter(f => (f.endsWith(".ts") || f.endsWith(".tsx")) && f !== "index.ts" && !f.endsWith(".test.ts"));

const exportsContent = files
  .map(f => `export * from "./${f.replace(/\.tsx?$/, "")}";`)
  .join("\n") + "\n";

fs.writeFileSync(path.join(absoluteTargetDir, "index.ts"), exportsContent);
console.log(`✅ Generato index.ts in ${targetDir}`);

// 2. Trova il package.json più vicino
let currentDir = absoluteTargetDir;
let packageJsonPath = null;

while (currentDir !== path.parse(currentDir).root) {
  const p = path.join(currentDir, "package.json");
  if (fs.existsSync(p)) {
    packageJsonPath = p;
    break;
  }
  currentDir = path.dirname(currentDir);
}

if (!packageJsonPath) {
  console.error("Errore: Impossibile trovare package.json.");
  process.exit(1);
}

// 3. Calcola il subpath relativo per l'export
const packageDir = path.dirname(packageJsonPath);
const relativeToPackage = path.relative(packageDir, absoluteTargetDir).replace(/\\/g, "/");
const subpath = "./" + relativeToPackage.replace(/^src\//, "");

// 4. Aggiorna package.json
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
if (!pkg.exports) pkg.exports = {};

const exportEntry = {
  types: `./${path.relative(packageDir, path.join(absoluteTargetDir, "index.ts")).replace(/\\/g, "/")}`,
  default: `./${path.relative(packageDir, path.join(absoluteTargetDir, "index.ts")).replace(/\\/g, "/")}`
};

if (JSON.stringify(pkg.exports[subpath]) !== JSON.stringify(exportEntry)) {
  pkg.exports[subpath] = exportEntry;

  const orderedExports = Object.keys(pkg.exports).sort().reduce((obj, key) => {
    obj[key] = pkg.exports[key];
    return obj;
  }, {});
  pkg.exports = orderedExports;

  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`✅ Aggiornato package.json in ${path.relative(process.cwd(), packageJsonPath)} con export "${subpath}"`);
} else {
  console.log(`ℹ️ L'export "${subpath}" è già aggiornato in package.json`);
}
