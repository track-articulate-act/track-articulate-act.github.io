import { cp, lstat, mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Keep the editable source and the ready-to-serve Pages site in one repository.
const root = fileURLToPath(new URL("../", import.meta.url));
const built = path.join(root, "dist/client");
const html = await readFile(path.join(built, "index.html"), "utf8");
const files = new Set(["index.html", "index.rsc", "404.html", ".nojekyll", "paper.pdf", "og.png"]);

// Export the media actually used on the page, not previous drafts or recordings.
for (const match of html.matchAll(/(?:src|poster|href)="\/(videos\/[^"?#]+|assets\/[^"?#]+)"/g)) {
  files.add(match[1]);
}

async function collect(directory) {
  for (const entry of await readdir(path.join(built, directory), { withFileTypes: true })) {
    const relative = `${directory}/${entry.name}`;
    if (entry.isDirectory()) await collect(relative);
    else if (entry.isFile()) files.add(relative);
  }
}
await collect("assets");

const allowed = (file) => !file.split("/").some((part) => part === ".." || part === ".") &&
  /^(?:index\.(?:html|rsc)|404\.html|\.nojekyll|paper\.pdf|og\.png|(?:assets|videos)\/.+)$/.test(file);
const manifest = path.join(root, ".pages-manifest.json");
let previous = [];
try {
  previous = JSON.parse(await readFile(manifest, "utf8"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

for (const file of new Set([...files, ...previous])) {
  if (!allowed(file)) throw new Error(`Unexpected export path: ${file}`);
  let directory = root;
  for (const part of file.split("/")) {
    directory = path.join(directory, part);
    const stat = await lstat(directory).catch((error) => {
      if (error.code !== "ENOENT") throw error;
      return null;
    });
    if (stat?.isSymbolicLink()) throw new Error(`Refusing to follow a symlink: ${file}`);
  }
}
for (const file of files) {
  const source = path.join(built, file);
  if ((await lstat(source)).size >= 100 * 1024 * 1024) {
    throw new Error(`File exceeds GitHub's ordinary file limit: ${file}`);
  }
  await mkdir(path.dirname(path.join(root, file)), { recursive: true });
  await cp(source, path.join(root, file));
}
// Delete only obsolete files recorded by this exporter, never source files.
for (const file of previous) {
  if (!files.has(file)) await unlink(path.join(root, file)).catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
}
await writeFile(manifest, `${JSON.stringify([...files].sort(), null, 2)}\n`);
console.log(`Packaged ${files.size} files for GitHub Pages at the repository root.`);
