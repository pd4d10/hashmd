<script>
  import c from 'classnames'
  import Elements from './Element.svelte'
  export let lang
  export let items
</script>

<pre><code class={`hljs language-${lang}`}>
  <Elements children={items} />
</code></pre>
