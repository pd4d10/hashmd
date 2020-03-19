<script>
  import Player from 'xgplayer';

  export let node;
  $: src = node.properties.src
  $: width = node.properties.width
  $: height = node.properties.height
  $: poster = node.properties.poster

  let el
  let player

  $: if (el) {
    if (player) {
      player.destroy()
    }
    player = new Player({
      el,
      url: src,
      width,
      height,
      poster,
    })
  }
</script>

<div bind:this={el}></div>
