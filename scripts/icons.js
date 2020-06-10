const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const iconMap = {
  heading: {},
  bold: {},
  italic: {},
  quote: {},
  image: {},
  table: { key: 'server' },
  link: {},
  ol: { key: 'list-ordered' },
  ul: { key: 'list-unordered' },
  tasklist: {},
  html: { key: 'code-review' },
};

let code = 'export const iconMap = {';

Object.entries(iconMap).forEach(([k, v]) => {
  const svg = fs.readFileSync(
    path.join(
      __dirname,
      '../node_modules/@primer/octicons-v2/build/svg',
      (v.key || k) + '-16.svg'
    ),
    'utf-8'
  );
  // console.log(svg);
  code += `${k}: '${svg}',`;
});

code += '}';

fs.writeFileSync(path.join(__dirname, '../packages/bytemd/src/icons.ts'), code);

execSync('npx prettier --write packages/bytemd/src/icons.ts', {
  cwd: path.join(__dirname, '..'),
});
