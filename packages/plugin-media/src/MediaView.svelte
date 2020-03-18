<script>
  export let node;

  $: tagName = node.tagName

  $: src = node.properties.src
  $: poster = node.properties.poster
  $: width = node.properties.width
  $: height = node.properties.height
</script>

{#if tagName === 'video'}
  <video {src} {poster} {width} {height} controls></video>
{:else if tagName === 'audio'}
  <audio {src} controls></audio>
{/if}
