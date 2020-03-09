<script>
  import Elements from './Elements.svelte'
  import HtmlViewer from './HtmlViewer.svelte';

  export let node;
  export let plugin;
  export let plugins;
</script>

{#if plugin}
  <svelte:component this={plugin.component} {...node} />
{:else if node.type === 'text'}
  {node.value}
{:else if node.type === 'emphasis'}
  <em><Elements nodes={node.children} {plugins} /></em>
{:else if node.type === 'strong'}
  <strong><Elements nodes={node.children} {plugins} /></strong>
{:else if node.type === 'delete'}
  <del><Elements nodes={node.children} {plugins} /></del>
{:else if node.type === 'inlineCode'}
  <code>{node.value}</code>
{:else if node.type === 'heading'}
  {#if node.depth === 1}
    <h1><Elements nodes={node.children} {plugins} /></h1>
  {:else if node.depth === 2}
    <h2><Elements nodes={node.children} {plugins} /></h2>
  {:else if node.depth === 3}
    <h3><Elements nodes={node.children} {plugins} /></h3>
  {:else if node.depth === 4}
    <h4><Elements nodes={node.children} {plugins} /></h4>
  {:else if node.depth === 5}
    <h5><Elements nodes={node.children} {plugins} /></h5>
  {:else if node.depth === 6}
    <h6><Elements nodes={node.children} {plugins} /></h6>
  {/if}
{:else if node.type === 'paragraph'}
  <p><Elements nodes={node.children} {plugins} /></p>
{:else if node.type === 'blockquote'}
  <blockquote><Elements nodes={node.children} {plugins} /></blockquote>
{:else if node.type === 'code'}
  <pre>{node.value}</pre>
{:else if node.type === 'list'}
  {#if node.ordered}
    <ol><Elements nodes={node.children} {plugins} /></ol>
  {:else}
    <ul><Elements nodes={node.children} {plugins} /></ul>
  {/if}
{:else if node.type === 'listItem'}
  <li><Elements nodes={node.children} {plugins} /></li>
{:else if node.type === 'link'}
  <a href={node.url}><Elements nodes={node.children} {plugins} /></a>
{:else if node.type === 'image'}
  <img src={node.url} alt={node.alt} />
{:else if node.type === 'table'}
  <table>
    <thead>
      <tr>
        {#each node.children[0].children as subNode, i}
          <th align={node.align[i]}><Elements nodes={subNode.children} {plugins} /></th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each node.children.slice(1) as subNode, i}
        <tr>
          {#each subNode.children as subSubNode, i}
            <td align={node.align[i]}><Elements nodes={subSubNode.children} {plugins} /></td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
{:else if node.type === 'html'}
  <HtmlViewer value={node.value} />
{/if}