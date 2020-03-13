<script>
  export let properties;

  $: src = properties.src
  $: poster = properties.poster
  $: width = properties.width
  $: height = properties.height
  $: controls = properties.controls
  $: autoplay = properties.autoplay
  $: muted = properties.muted
  $: loop = properties.loop
</script>

<video {src} {poster} {width} {height} {controls} {autoplay} {muted} {loop}></video>
