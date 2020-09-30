import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import chokidar from 'chokidar';
import { preprocess } from 'svelte/compiler';
import autoprocessor from 'svelte-preprocess';

async function compile(file) {
  const dest = file.replace('/src/', '/lib/');

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

const pattern = path.resolve(__dirname, `../packages/*/src/*.{svelte,vue}`);

fs.ensureDirSync(path.resolve(__dirname, '../packages/bytemd/lib'));
fs.ensureDirSync(path.resolve(__dirname, '../packages/vue/lib'));

if (process.argv.includes('--watch')) {
  chokidar.watch(pattern).on('all', (event, file) => {
    console.log(event, file);
    compile(file);
  });
} else {
  glob(pattern, (err, files) => {
    if (err) throw err;

    for (let file of files) {
      compile(file);
    }
  });
}
