#!/bin/bash

npm i -g pnpm
pnpm build

# docs
cd docs
npm install # not in workspace because of Vue 2/3 version
pnpm build

# playground
cd ..
pnpm --filter playground build
mv playground/dist docs/.vitepress/dist/playground
