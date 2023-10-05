// @ts-check
import { packages, packagesDir, rootDir } from "./utils.js";
import fs from "fs-extra";
import _ from "lodash-es";
import mustache from "mustache";
import path from "path";

function readFileSyncSafe(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch (err) {
    return "";
  }
}

const plugins = packages.filter((x) => x.startsWith("plugin-"));

packages.forEach((p) => {
  const tsconfig = path.join(packagesDir, p, "tsconfig.json");
  const c = fs.readJsonSync(tsconfig);
  c.include = ["src", "src/locales/*.json"]; //  https://github.com/microsoft/TypeScript/issues/25636#issuecomment-627111031
  c.compilerOptions = {
    rootDir: "src",
    outDir: "dist",
  };

  // tsconfig
  fs.writeJsonSync(tsconfig, c);
});

packages.forEach((p) => {
  // license
  fs.copyFileSync(
    path.join(rootDir, "LICENSE"),
    path.join(packagesDir, p, "LICENSE"),
  );

  // package.json
  const pkgPath = path.join(packagesDir, p, "package.json");
  const pkg = fs.readJsonSync(pkgPath);
  pkg.repository = {
    type: "git",
    url: "https://github.com/pd4d10/hashmd.git",
    directory: `packages/${p}`,
  };

  pkg.types = "./dist/index.d.ts";
  pkg.module = "./dist/index.mjs";
  pkg.main = "./dist/index.js";
  pkg.type = "module";

  pkg.exports = {
    ".": {
      types: "./dist/index.d.ts",
      import: "./dist/index.mjs",
      require: "./dist/index.js",
    },
    "./locales/*": "./locales/*",
  };
  pkg.files = ["dist", "locales"];
  fs.writeJsonSync(pkgPath, pkg);
});

// plugins readme
plugins.forEach((p) => {
  const name = p.split("-").slice(1).join("-");
  const result = mustache.render(
    readFileSyncSafe(path.join(rootDir, "scripts/plugin-template.md")),
    {
      name,
      importedName: _.camelCase(name.replace("-ssr", "")),
      header: p.startsWith("plugin-math")
        ? 'import "katex/dist/katex.css"'
        : p.startsWith("plugin-highlight")
        ? 'import "highlight.js/styles/default.css"'
        : "",
      desc: fs.readJsonSync(path.join(packagesDir, p, "package.json"))
        .description,
    },
  );
  fs.writeFileSync(path.join(packagesDir, p, "README.md"), result);
});

// readme
const readme = readFileSyncSafe(path.join(rootDir, "README.md")).replace(
  /### Official Plugins\s+([\w\W])*?\s+##/,
  (match, p1, offset, string) => {
    const content = plugins
      .map((p) => {
        const pkg = fs.readJsonSync(path.join(packagesDir, p, "package.json"));
        if (pkg.private) return;

        const name = p.split("-").slice(1).join("-");
        const badge = `[![npm](https://img.shields.io/npm/v/@hashmd/plugin-${name}.svg?label=)](https://npm.im/@hashmd/plugin-${name})`;
        const desc = _.upperFirst(
          pkg.description.replace("HashMD plugin to ", ""),
        );
        return `| [@hashmd/plugin-${name}](https://github.com/pd4d10/hashmd/tree/main/packages/plugin-${name}) | ${badge} | ${desc} |`;
      })
      .filter((x) => x)
      .join("\n");

    return `### Official Plugins

| Package | Status | Description |
| --- | --- | --- |
${content}

##`;
  },
);

fs.writeFileSync(path.join(rootDir, "README.md"), readme);
