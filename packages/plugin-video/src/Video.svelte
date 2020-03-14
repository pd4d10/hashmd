<script>
  export let node;

  $: src = node.properties.src
  $: poster = node.properties.poster
  $: width = node.properties.width
  $: height = node.properties.height
  $: controls = node.properties.controls
  $: autoplay = node.properties.autoplay
  $: muted = node.properties.muted
  $: loop = node.properties.loop
</script>

<video {src} {poster} {width} {height} {controls} {autoplay} {muted} {loop}></video>
