<script>
  import HtmlViewer from './HtmlViewer.svelte';

  export let nodes;
  export let plugins;

  function findPlugin(node) {
    return plugins.find(p => p.shouldTransformElement(node))
  }
</script>

{#each nodes as node, i}
  {#if findPlugin(node)}
    <svelte:component this={findPlugin(node).component} {...node} />
  {:else if node.type === 'text'}
    {node.value}
  {:else if node.type === 'emphasis'}
    <em><svelte:self nodes={node.children} {plugins} /></em>
  {:else if node.type === 'strong'}
    <strong><svelte:self nodes={node.children} {plugins} /></strong>
  {:else if node.type === 'delete'}
    <del><svelte:self nodes={node.children} {plugins} /></del>
  {:else if node.type === 'inlineCode'}
    <code>{node.value}</code>
  {:else if node.type === 'heading'}
    {#if node.depth === 1}
      <h1><svelte:self nodes={node.children} {plugins} /></h1>
    {:else if node.depth === 2}
      <h2><svelte:self nodes={node.children} {plugins} /></h2>
    {:else if node.depth === 3}
      <h3><svelte:self nodes={node.children} {plugins} /></h3>
    {:else if node.depth === 4}
      <h4><svelte:self nodes={node.children} {plugins} /></h4>
    {:else if node.depth === 5}
      <h5><svelte:self nodes={node.children} {plugins} /></h5>
    {:else if node.depth === 6}
      <h6><svelte:self nodes={node.children} {plugins} /></h6>
    {/if}
  {:else if node.type === 'paragraph'}
    <p><svelte:self nodes={node.children} {plugins} /></p>
  {:else if node.type === 'blockquote'}
    <blockquote><svelte:self nodes={node.children} {plugins} /></blockquote>
  {:else if node.type === 'code'}
    <pre>{node.value}</pre>
  {:else if node.type === 'list'}
    {#if node.ordered}
      <ol><svelte:self nodes={node.children} {plugins} /></ol>
    {:else}
      <ul><svelte:self nodes={node.children} {plugins} /></ul>
    {/if}
  {:else if node.type === 'listItem'}
    <li><svelte:self nodes={node.children} {plugins} /></li>
  {:else if node.type === 'link'}
    <a href={node.url}><svelte:self nodes={node.children} {plugins} /></a>
  {:else if node.type === 'image'}
    <img src={node.url} alt={node.alt} />
  {:else if node.type === 'table'}
    <table>
      <thead>
        <tr>
          {#each node.children[0].children as subNode, i}
            <th align={node.align[i]}><svelte:self nodes={subNode.children} {plugins} /></th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each node.children.slice(1) as subNode, i}
          <tr>
            {#each subNode.children as subSubNode, i}
              <td align={node.align[i]}><svelte:self nodes={subSubNode.children} {plugins} /></td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  {:else if node.type === 'html'}
    <HtmlViewer value={node.value} />
  {/if}
{/each}
