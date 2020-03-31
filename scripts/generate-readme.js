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

const plugins = fs.readdirSync(root).filter(x => x.startsWith('plugin-'));
const template = readFileSyncSafe(path.join(__dirname, 'plugin-template.md'));

plugins.forEach(p => {
  const name = p
    .split('-')
    .slice(1)
    .join('-');
  const result = mustache.render(template, {
    name,
    camelName: _.camelCase(name),
    desc: readFileSyncSafe(path.join(root, p, 'docs/desc.md')),
    options: readFileSyncSafe(path.join(root, p, 'docs/options.md')),
    example: readFileSyncSafe(path.join(root, p, 'docs/example.md')),
  });

  fs.writeFileSync(path.join(root, p, 'README.md'), result);
});
