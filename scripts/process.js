import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import chokidar from 'chokidar';
import { preprocess } from 'svelte/compiler';
import autoprocessor from 'svelte-preprocess';

async function compile(file) {
  const source = await fs.readFile(file, 'utf8');
  const item = await preprocess(source, autoprocessor(), {
    filename: file,
  });
  await fs.ensureDir(path.resolve(__dirname, '../packages/bytemd/lib'));
  await fs.writeFile(file.replace('bytemd/src', 'bytemd/lib'), item.code);
}

if (process.argv.includes('--watch')) {
  chokidar
    .watch(path.resolve(__dirname, `../packages/bytemd/src/*.svelte`))
    .on('all', (event, file) => {
      console.log(event, file);
      compile(file);
    });
} else {
  glob(
    path.resolve(__dirname, `../packages/bytemd/src/*.svelte`),
    async (err, files) => {
      if (err) throw err;

      for (let file of files) {
        compile(file);
      }
    }
  );
}
