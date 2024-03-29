// @ts-check
import * as icons from "@icon-park/svg";
import fs from "fs-extra";
import svgo from "svgo";

/** @type {Record<string, Record<string, keyof typeof import('@icon-park/svg/es/map')>>} */
const meta = {
  "core/src": {
    close: "Close",

    heading: "H",
    bold: "TextBold",
    italic: "TextItalic",
    quote: "Quote",
    link: "LinkOne",
    image: "Pic",
    code: "Code",
    codeBlock: "CodeBrackets",
    ul: "ListTwo",
    ol: "OrderedList",
    hr: "DividingLine",

    toc: "AlignTextLeftOne",
    help: "Helpcenter",
    write: "LeftExpand",
    preview: "RightExpand",
    exitFullscreen: "OffScreen",
    fullscreen: "FullScreen",
    source: "GithubOne",
  },
  "plugin-gfm/src": {
    strike: "Strikethrough",
    task: "CheckCorrect",
    table: "InsertTable",
  },
  "plugin-math/src/utils": {
    formula: "Formula",
    block: "Inline",
    inline: "Block",
  },
  "plugin-mermaid/src": { mermaid: "ChartGraph" },
};

for (let [p, keyMap] of Object.entries(meta)) {
  let obj = {};
  for (let [key, iconKey] of Object.entries(keyMap)) {
    const svg = svgo.optimize(icons[iconKey]({}));
    obj[key] = svg.data;
  }

  fs.writeFileSync(
    `./packages/${p}/icons.ts`,
    `// DO NOT EDIT, generated by "pnpm icon" command
      export const icons=${JSON.stringify(obj)}`,
  );
}
