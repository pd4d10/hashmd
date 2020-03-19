<script>
  import Elements from './Elements.svelte'
  import { santitizeHref } from './utils'

  export let node;
  export let plugins;
</script>

{#if node.type === 'text'}
  {node.value}

{:else if node.tagName === 'em'}
  <em><Elements nodes={node.children} {plugins} /></em>
{:else if node.tagName === 'strong'}
  <strong><Elements nodes={node.children} {plugins} /></strong>
{:else if node.tagName === 'del'}
  <del><Elements nodes={node.children} {plugins} /></del>
{:else if node.tagName === 'ins'}
  <ins><Elements nodes={node.children} {plugins} /></ins>
{:else if node.tagName === 'mark'}
  <mark><Elements nodes={node.children} {plugins} /></mark>
{:else if node.tagName === 'sub'}
  <sub><Elements nodes={node.children} {plugins} /></sub>
{:else if node.tagName === 'sup'}
  <sup><Elements nodes={node.children} {plugins} /></sup>
{:else if node.tagName === 'ruby'}
  <ruby><Elements nodes={node.children} {plugins} /></ruby>
{:else if node.tagName === 'rp'}
  <rp><Elements nodes={node.children} {plugins} /></rp>
{:else if node.tagName === 'rt'}
  <rt><Elements nodes={node.children} {plugins} /></rt>

{:else if node.tagName === 'code'}
  <code><Elements nodes={node.children} {plugins} /></code>
{:else if node.tagName === 'h1'}
  <h1><Elements nodes={node.children} {plugins} /></h1>
{:else if node.tagName === 'h2'}
  <h2><Elements nodes={node.children} {plugins} /></h2>
{:else if node.tagName === 'h3'}
  <h3><Elements nodes={node.children} {plugins} /></h3>
{:else if node.tagName === 'h4'}
  <h4><Elements nodes={node.children} {plugins} /></h4>
{:else if node.tagName === 'h5'}
  <h5><Elements nodes={node.children} {plugins} /></h5>
{:else if node.tagName === 'h6'}
  <h6><Elements nodes={node.children} {plugins} /></h6>
{:else if node.tagName === 'p'}
  <p align={node.properties.align}><Elements nodes={node.children} {plugins} /></p>
{:else if node.tagName === 'blockquote'}
  <blockquote><Elements nodes={node.children} {plugins} /></blockquote>
{:else if node.tagName === 'pre'}
  <pre><Elements nodes={node.children} {plugins} /></pre>
{:else if node.tagName === 'ol'}
  <ol><Elements nodes={node.children} {plugins} /></ol>
{:else if node.tagName === 'ul'}
  <ul><Elements nodes={node.children} {plugins} /></ul>
{:else if node.tagName === 'li'}
  <li><Elements nodes={node.children} {plugins} /></li>
{:else if node.tagName === 'a'}
  <a href={santitizeHref(node.properties.href)}><Elements nodes={node.children} {plugins} /></a>
{:else if node.tagName === 'img'}
  <img src={node.properties.src} alt={node.properties.alt} width={node.properties.width} height={node.properties.height} />

{:else if node.tagName === 'table'}
  <table><Elements nodes={node.children} {plugins} /></table>
{:else if node.tagName === 'thead'}
  <thead><Elements nodes={node.children} {plugins} /></thead>
{:else if node.tagName === 'tbody'}
  <tbody><Elements nodes={node.children} {plugins} /></tbody>
{:else if node.tagName === 'tr'}
  <tr><Elements nodes={node.children} {plugins} /></tr>
{:else if node.tagName === 'th'}
  <th align={node.properties.align}><Elements nodes={node.children} {plugins} /></th>
{:else if node.tagName === 'td'}
  <td align={node.properties.align}><Elements nodes={node.children} {plugins} /></td>
{/if}