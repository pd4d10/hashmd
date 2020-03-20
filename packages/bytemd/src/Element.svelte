<script>
  import Elements from './Elements.svelte'
  import { santitizeHref } from './utils'

  export let node;
  export let plugins;

  $: type = node.type
  $: value = node.value
  $: tagName = node.tagName
  $: children = node.children
  $: properties = node.properties
</script>

{#if type === 'text'}
  {value}
{:else if tagName === 'em'}
  <em><Elements nodes={children} {plugins} /></em>
{:else if tagName === 'strong'}
  <strong><Elements nodes={children} {plugins} /></strong>
{:else if tagName === 'i'}
  <i><Elements nodes={children} {plugins} /></i>
{:else if tagName === 'b'}
  <b><Elements nodes={children} {plugins} /></b>
{:else if tagName === 'del'}
  <del><Elements nodes={children} {plugins} /></del>
{:else if tagName === 'ins'}
  <ins><Elements nodes={children} {plugins} /></ins>
{:else if tagName === 'mark'}
  <mark><Elements nodes={children} {plugins} /></mark>
{:else if tagName === 'sub'}
  <sub><Elements nodes={children} {plugins} /></sub>
{:else if tagName === 'sup'}
  <sup><Elements nodes={children} {plugins} /></sup>
{:else if tagName === 'ruby'}
  <ruby><Elements nodes={children} {plugins} /></ruby>
{:else if tagName === 'rp'}
  <rp><Elements nodes={children} {plugins} /></rp>
{:else if tagName === 'rt'}
  <rt><Elements nodes={children} {plugins} /></rt>

{:else if tagName === 'code'}
  <code><Elements nodes={children} {plugins} /></code>
{:else if tagName === 'h1'}
  <h1><Elements nodes={children} {plugins} /></h1>
{:else if tagName === 'h2'}
  <h2><Elements nodes={children} {plugins} /></h2>
{:else if tagName === 'h3'}
  <h3><Elements nodes={children} {plugins} /></h3>
{:else if tagName === 'h4'}
  <h4><Elements nodes={children} {plugins} /></h4>
{:else if tagName === 'h5'}
  <h5><Elements nodes={children} {plugins} /></h5>
{:else if tagName === 'h6'}
  <h6><Elements nodes={children} {plugins} /></h6>
{:else if tagName === 'p'}
  <p align={properties.align}><Elements nodes={children} {plugins} /></p>
{:else if tagName === 'blockquote'}
  <blockquote><Elements nodes={children} {plugins} /></blockquote>
{:else if tagName === 'pre'}
  <pre><Elements nodes={children} {plugins} /></pre>
{:else if tagName === 'ol'}
  <ol><Elements nodes={children} {plugins} /></ol>
{:else if tagName === 'ul'}
  <ul><Elements nodes={children} {plugins} /></ul>
{:else if tagName === 'li'}
  <li><Elements nodes={children} {plugins} /></li>
{:else if tagName === 'a'}
  <a href={santitizeHref(properties.href)}><Elements nodes={children} {plugins} /></a>
{:else if tagName === 'img'}
  <img src={properties.src} alt={properties.alt} width={properties.width} height={properties.height} />

{:else if tagName === 'table'}
  <table><Elements nodes={children} {plugins} /></table>
{:else if tagName === 'thead'}
  <thead><Elements nodes={children} {plugins} /></thead>
{:else if tagName === 'tbody'}
  <tbody><Elements nodes={children} {plugins} /></tbody>
{:else if tagName === 'tr'}
  <tr><Elements nodes={children} {plugins} /></tr>
{:else if tagName === 'th'}
  <th align={properties.align}><Elements nodes={children} {plugins} /></th>
{:else if tagName === 'td'}
  <td align={properties.align}><Elements nodes={children} {plugins} /></td>
{:else}
  <Elements nodes={children} {plugins} />
{/if}
