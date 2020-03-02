<script>
  import remark from 'remark';
  import Element from './Element.svelte';
  export let source;
  $: ast = remark.parse(source);
</script>

<style>
  div {
    flex: 1;
    overflow: auto;
    padding: 20px;
  }
</style>

<div class="markdown-body">
  <Element items={ast.children} />
</div>
