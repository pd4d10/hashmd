import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import chokidar from 'chokidar';
import { preprocess } from 'svelte/compiler';
import autoprocessor from 'svelte-preprocess';

// svelte file: compile
// other files: copy
async function transform(file, dir = 'lib') {
  const dest = file.replace('/src/', `/${dir}/`);

  if (file.endsWith('.svelte')) {
    const source = await fs.readFile(file, 'utf8');
    const item = await preprocess(
      source,
      autoprocessor({
        typescript: {
          tsconfigFile: path.resolve(__dirname, '../tsconfig-base.json'),
        },
      }),
      {
        filename: file,
      }
    );
    await fs.writeFile(dest, item.code);
  } else {
    await fs.copyFile(file, dest);
  }
}

function watch(pattern, dest) {
  chokidar.watch(pattern).on('all', (event, file) => {
    console.log(event, file);
    transform(file, dest);
  });
}

function build(pattern, dir) {
  glob(pattern, (err, files) => {
    if (err) throw err;

    for (let file of files) {
      transform(file, dir);
    }
  });
}

fs.ensureDirSync(path.resolve(__dirname, '../packages/bytemd/lib'));
fs.ensureDirSync(path.resolve(__dirname, '../packages/vue/lib'));
fs.ensureDirSync(path.resolve(__dirname, '../packages/mp/lib'));

const pattern = path.resolve(
  __dirname,
  `../packages/*/src/*.{svelte,vue,json,wxml,wxss}`
);
const mpPattern = path.resolve(
  __dirname,
  `../packages/mp/src/*.{svelte,vue,json,wxml,wxss}`
);

if (process.argv.includes('--watch')) {
  watch(pattern);
  watch(mpPattern, 'dist');
} else {
  build(pattern);
  build(mpPattern, 'dist');
}
