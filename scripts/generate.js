import fs from 'fs-extra';
import path from 'path';
import mustache from 'mustache';
import _ from 'lodash';

function readFileSyncSafe(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch (err) {
    return '';
  }
}

const root = path.join(__dirname, '../packages');
const packages = fs.readdirSync(root);
const plugins = packages.filter(
  (x) => x.startsWith('plugin-') && !x.includes('-transform')
);
const transformers = packages.filter((x) => x.includes('-transform-'));

// tsconfig root
fs.writeJsonSync(
  path.resolve(__dirname, '../tsconfig.json'),
  {
    files: [],
    references: packages.map((p) => {
      return { path: 'packages/' + p };
    }),
  },
  { spaces: 2 }
);

// package tsconfig
packages.forEach((p) => {
  let tsconfig = {
    extends: '../../tsconfig-base.json',
    include: ['src'],
    compilerOptions: {
      composite: true,
      rootDir: 'src',
      outDir: 'lib',
    },
  };
  if (p !== 'bytemd') {
    tsconfig.references = [{ path: '../bytemd' }];
  }

  fs.writeJsonSync(path.join(root, p, 'tsconfig.json'), tsconfig, {
    spaces: 2,
  });

  // package.json
  const pkgPath = path.join(root, p, 'package.json');
  const pkg = require(pkgPath);
  pkg.repository = {
    type: 'git',
    url: 'https://github.com/bytedance/bytemd.git',
    directory: `packages/${p}`,
  };
  pkg.types = 'lib/index.d.ts';
  pkg.files = ['dist', 'lib'];
  if (pkg.name.startsWith('@')) {
    pkg.publishConfig = {
      access: 'public',
    };
  }
  fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });
});

// plugins readme
plugins.forEach((p) => {
  const name = p.split('-').slice(1).join('-');
  const result = mustache.render(
    readFileSyncSafe(path.join(__dirname, 'plugin-template.md')),
    {
      name,
      importedName: _.camelCase(name.replace('-ssr', '')),
      desc: require(path.join(root, p, 'package.json')).description,
    }
  );
  fs.writeFileSync(path.join(root, p, 'README.md'), result);
});

// transformers readme
transformers.forEach((p) => {
  const name = p.split('-').slice(-1)[0];
  const result = mustache.render(
    readFileSyncSafe(path.join(__dirname, 'plugin-transformer.md')),
    {
      name,
      desc: require(path.join(root, p, 'package.json')).description,
    }
  );
  fs.writeFileSync(path.join(root, p, 'README.md'), result);
});

// bytemd readme
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
