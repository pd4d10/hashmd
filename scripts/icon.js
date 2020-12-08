// @ts-check
import fs from 'fs-extra';
import { execSync } from 'child_process';
import Svgo from 'svgo';
import {
  H1,
  H2,
  H3,
  TextBold,
  TextItalic,
  Quote,
  LinkOne,
  Code,
  CodeBrackets,
  OrderedList,
  ListCheckbox,
  Info,
  CheckCorrect,
  InsertTable,
  Pic,
  FullScreen,
  OffScreen,
} from '@icon-park/svg';

const svgo = new Svgo();

const meta = {
  bytemd: {
    h1: H1,
    h2: H2,
    h3: H3,
    bold: () =>
      TextBold({}).replace('viewBox="0 0 48 48"', `viewBox="-4 -2 52 52"`),
    italic: TextItalic,
    quote: Quote,
    link: LinkOne,
    code: Code,
    codeBlock: CodeBrackets,
    ol: OrderedList,
    ul: ListCheckbox,
    info: Info,
    fullscreenOn: FullScreen,
    fullscreenOff: OffScreen,
  },
  'plugin-gfm': {
    task: CheckCorrect,
    table: InsertTable,
  },
  'plugin-import-image': {
    image: Pic,
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
