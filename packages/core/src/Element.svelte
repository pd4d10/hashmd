<script>
  import sanitizeHtml from 'sanitize-html';
  import hljs from 'highlight.js';
  import katex from 'katex';

  export let items;

  function sanitize(html) {
    return sanitizeHtml(html, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
    });
  }
</script>

<style>

</style>

{#each items as { type, value, children, ordered, depth, url, alt, lang }, i}
  {#if type === 'text'}
    {value}
  {:else if type === 'emphasis'}
    <em>
      <svelte:self items={children} />
    </em>
  {:else if type === 'strong'}
    <strong>
      <svelte:self items={children} />
    </strong>
  {:else if type === 'delete'}
    <del>
      <svelte:self items={children} />
    </del>
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
    <pre>
      {#if hljs.getLanguage(lang)}
        {@html hljs.highlight(lang, value).value}
      {:else}{value}{/if}
    </pre>
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
  {:else if type === 'math'}
    <p>
      {@html katex.renderToString(value, { throwOnError: false })}
    </p>
  {:else if type === 'inlineMath'}
    {@html katex.renderToString(value, { throwOnError: false })}
  {:else if type === 'html'}
    {@html sanitize(value)}
  {/if}
{/each}
