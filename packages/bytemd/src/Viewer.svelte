<script>
  import remark from 'remark';
  import Element from './Element.svelte';
  export let source;
  $: ast = remark.parse(source);
</script>

<style>

</style>

<div>
  <Element items={ast.children} />
</div>
