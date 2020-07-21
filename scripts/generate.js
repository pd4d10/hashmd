// Generate plugins README

const fs = require('fs');
const path = require('path');
const mustache = require('mustache');
const _ = require('lodash');

function readFileSyncSafe(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch (err) {
    return '';
  }
}

const root = path.join(__dirname, '../packages');
const plugins = fs.readdirSync(root).filter((x) => x.startsWith('plugin-'));
const template = readFileSyncSafe(path.join(__dirname, 'plugin-template.md'));

plugins.forEach((p) => {
  const name = p.split('-').slice(1).join('-');
  const result = mustache.render(template, {
    name,
    camelName: _.camelCase(name),
    desc: require(path.join(root, p, 'package.json')).description,
  });

  fs.writeFileSync(path.join(root, p, 'README.md'), result);
});

const readme = readFileSyncSafe(path.join(__dirname, '../README.md')).replace(
  /## Plugins\s+([\w\W])*?\s+##/,
  (match, p1, offset, string) => {
    const content = plugins
      .map((p) => {
        const name = p.split('-').slice(1).join('-');
        const badge = `[![npm](https://img.shields.io/npm/v/@bytemd/plugin-${name}.svg)](https://npm.im/@bytemd/plugin-${name})`;
        const desc = require(path.join(root, p, 'package.json')).description;
        return `| [@bytemd/plugin-${name}](./packages/plugin-${name}) | ${badge} | ${desc} |`;
      })
      .join('\n');

    return `## Plugins

| Package | Status | Description |
| --- | --- | --- |
${content}

##`;
  }
);
fs.writeFileSync(path.join(__dirname, '../README.md'), readme);
