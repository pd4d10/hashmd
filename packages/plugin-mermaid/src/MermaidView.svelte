<script>
  import mermaid from 'mermaid'
  import nanoid from 'nanoid'

  export let node
  let element
  let error

  const id = 'mermaid-' + nanoid()

  function insertSvg(svgCode, bindFunctions) {
    element.innerHTML = svgCode;
    if (bindFunctions) bindFunctions(element);
  }

  $: value = node.children[0] && node.children[0].value
  $: if (element && value) {
    try {
      mermaid.render(id, value, insertSvg, element);
      error = null
    } catch (e) {
      error = e
    }
  }
</script>

<style>
  div {
    text-align: center;
  }
  p {
    color: red;
  }
</style>

{#if error}
  <p>{error.message}</p>
{/if}
<div style={error ? 'display:none': null} bind:this={element}></div>
