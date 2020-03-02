<script>
  export let items;
</script>

<style>

</style>

{#each items as { type, value, children, ordered, depth, url, alt }, i}
  {#if type === 'text'}
    {value}
  {:else if type === 'emphasis'}
    <em>
      <svelte:self items={children} />
    </em>
  {:else if type === 'strong'}
    <code>
      <svelte:self items={children} />
    </code>
  {:else if type === 'inlineCode'}
    <code>{value}</code>
  {:else if type === 'heading'}
    {#if depth === 1}
      <h1>
        <svelte:self items={children} />
      </h1>
    {:else if depth === 2}
      <h2>
        <svelte:self items={children} />
      </h2>
    {:else if depth === 3}
      <h3>
        <svelte:self items={children} />
      </h3>
    {:else if depth === 4}
      <h4>
        <svelte:self items={children} />
      </h4>
    {:else if depth === 5}
      <h5>
        <svelte:self items={children} />
      </h5>
    {:else if depth === 6}
      <h6>
        <svelte:self items={children} />
      </h6>
    {/if}
  {:else if type === 'paragraph'}
    <p>
      <svelte:self items={children} />
    </p>
  {:else if type === 'blockquote'}
    <blockquote>
      <svelte:self items={children} />
    </blockquote>
  {:else if type === 'code'}
    <pre>{value}</pre>
  {:else if type === 'list'}
    {#if ordered}
      <ol>
        <svelte:self items={children} />
      </ol>
    {:else}
      <ul>
        <svelte:self items={children} />
      </ul>
    {/if}
  {:else if type === 'listItem'}
    <li>
      <svelte:self items={children} />
    </li>
  {:else if type === 'link'}
    <a href={url}>
      <svelte:self items={children} />
    </a>
  {:else if type === 'image'}
    <img src={url} {alt} />
  {/if}
{/each}
