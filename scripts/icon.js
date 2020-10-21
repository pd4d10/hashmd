// @ts-check
import fs from 'fs-extra';
import { execSync } from 'child_process';
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
} from '@icon-park/svg';

fs.writeFileSync(
  './packages/bytemd/src/icons.ts',
  `export const icons=${JSON.stringify({
    h1: H1({}),
    h2: H2({}),
    h3: H3({}),
    bold: TextBold({}),
    italic: TextItalic({}),
    quote: Quote({}),
    link: LinkOne({}),
    code: Code({}),
    codeBlock: CodeBrackets({}),
    ol: OrderedList({}),
    ul: ListCheckbox({}),
    info: Info({}),
  })}`
);

fs.writeFileSync(
  './packages/plugin-gfm/src/icons.ts',
  `export const icons=${JSON.stringify({
    task: CheckCorrect({}),
    table: InsertTable({}),
  })}`
);

fs.writeFileSync(
  './packages/plugin-import-image/src/icons.ts',
  `export const icons=${JSON.stringify({
    image: Pic({}),
  })}`
);

execSync('npx prettier --write packages/**/*.ts');
