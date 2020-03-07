<script>
  import mermaid from 'mermaid'

  export let value
  let element

  const id = 'mermaid' // TODO:

  function insertSvg(svgCode, bindFunctions) {
    element.innerHTML = svgCode;
    if (bindFunctions) bindFunctions(element);
  }

  $: if (element) {
    mermaid.render(id, value, insertSvg, element);
  }
</script>

<div bind:this={element}></div>
