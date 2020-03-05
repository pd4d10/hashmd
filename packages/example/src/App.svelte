<script>
  import { onMount } from 'svelte';
  import { Editor } from 'bytemd';
  let source = `<p align="center">
  <img src="https://getkap.co/static/favicon/kap.svg" height="64">
  <h3 align="center">Kap</h3>
  <p align="center">An open-source screen recorder built with web technology<p>
  <p align="center"><a href="https://circleci.com/gh/wulkano/kap"><img src="https://circleci.com/gh/wulkano/kap.svg?style=shield" alt="Build Status"></a> <a href="https://github.com/sindresorhus/xo"><img src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg" alt="XO code style"></a></p>
</p>`;

  onMount(async () => {
    // const res = await fetch('/fixture.md');
    // source = await res.text();
  });
</script>

<style>

</style>

<Editor {source} />
