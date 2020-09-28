const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '../packages');
const packages = fs.readdirSync(root);

packages.forEach((p) => {
  // tsconfig
  let tsconfig = {
    extends: '../../tsconfig-base.json',
    include: ['src'],
    compilerOptions: {
      composite: true,
      rootDir: 'src',
      outDir: 'lib',
    },
  };
  if (p.startsWith('plugin-')) {
    tsconfig.references = [{ path: '../bytemd' }];
  }

  fs.writeFileSync(
    path.join(root, p, 'tsconfig.json'),
    JSON.stringify(tsconfig, null, 2) + '\n'
  );

  // package.json
  const pkgPath = path.join(root, p, 'package.json');
  const pkg = require(pkgPath);
  pkg.types = 'lib/index.d.ts';
  pkg.files = ['dist', 'lib'];
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
});
