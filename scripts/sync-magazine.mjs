import { existsSync, readdirSync, writeFileSync } from "node:fs";

const dir = new URL("../public/photos/", import.meta.url);
const names = new Set(readdirSync(dir));
const map = {};
for (let i = 1; i <= 150; i++) {
  const base = `r-${String(i).padStart(3, "0")}`;
  if (
    names.has(`${base}-use.jpg`) &&
    names.has(`${base}-ing.jpg`) &&
    names.has(`${base}-ready.jpg`)
  ) {
    map[base] = { use: `${base}-use`, ing: `${base}-ing`, ready: `${base}-ready` };
  }
}
writeFileSync(
  new URL("../src/data/magazine.json", import.meta.url),
  JSON.stringify(map, null, 2) + "\n",
);
console.log(Object.keys(map).length);