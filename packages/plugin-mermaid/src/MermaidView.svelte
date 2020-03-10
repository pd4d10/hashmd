<script>
  import mermaid from 'mermaid'

  export let node
  let element
  let error

  const id = 'mermaid' // TODO:

  function insertSvg(svgCode, bindFunctions) {
    element.innerHTML = svgCode;
    if (bindFunctions) bindFunctions(element);
  }

  $: if (element) {
    try {
      mermaid.render(id, node.value, insertSvg, element);
      error = null
    } catch (e) {
      error = e
    }
  }
</script>

<style>
  p {
    color: red;
  }
</style>

{#if error}
  <p>{error.message}</p>
{/if}
<div style={error ? 'display:none': null} bind:this={element}></div>
