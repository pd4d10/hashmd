<script>
  import abcjs from 'abcjs';

  let el;
  export let value;
  $: if (el && value) {
    abcjs.renderAbc(el, value);
  }
</script>

<style>
  div {
    text-align: center;
  }
</style>

<div bind:this={el} />
