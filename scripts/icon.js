// @ts-check
import fs from 'fs-extra';
import { execSync } from 'child_process';
import Svgo from 'svgo';
import * as icons from '@icon-park/svg';

const svgo = new Svgo();

const meta = {
  bytemd: {
    h1: icons.H1,
    h2: icons.H2,
    h3: icons.H3,
    bold: () =>
      icons
        .TextBold({})
        .replace('viewBox="0 0 48 48"', `viewBox="-4 -2 52 52"`),
    italic: icons.TextItalic,
    quote: icons.Quote,
    link: icons.LinkOne,
    code: icons.Code,
    codeBlock: icons.CodeBrackets,
    ol: icons.OrderedList,
    ul: icons.ListTwo,
    hr: icons.DividingLine,
    info: icons.Info,
    fullscreenOn: icons.FullScreen,
    fullscreenOff: icons.OffScreen,
  },
  'plugin-gfm': {
    strikethrough: icons.Strikethrough,
    task: icons.CheckCorrect,
    table: icons.InsertTable,
  },
  'plugin-import-image': {
    image: icons.Pic,
  },
  'plugin-math': {
    math: icons.Dollar,
    mathBlock: icons.Formula,
  },
  'plugin-math-ssr': {
    math: icons.Dollar,
    mathBlock: icons.Formula,
  },
  'plugin-mermaid': {
    mermaid: icons.MindMapping,
  },
};

(async () => {
  for (let [p, mapper] of Object.entries(meta)) {
    let obj = {};
    for (let [key, factory] of Object.entries(mapper)) {
      const svg = await svgo.optimize(factory({}));
      obj[key] = svg.data;
    }

    fs.writeFileSync(
      `./packages/${p}/src/icons.ts`,
      `export const icons=${JSON.stringify(obj)}`
    );
  }

  execSync('npx prettier --write packages/**/*.ts');
})();
