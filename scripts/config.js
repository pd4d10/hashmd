import fs from 'fs-extra';
import path from 'path';

const root = path.join(__dirname, '../packages');
const packages = fs.readdirSync(root);

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
  if (p !== 'bytemd') {
    tsconfig.references = [{ path: '../bytemd' }];
  }

  fs.writeJsonSync(path.join(root, p, 'tsconfig.json'), tsconfig, {
    spaces: 2,
  });

  // package.json
  const pkgPath = path.join(root, p, 'package.json');
  const pkg = require(pkgPath);
  pkg.types = 'lib/index.d.ts';
  pkg.files = ['dist', 'lib'];
  fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });
});
