<script>
  import Player from 'xgplayer';

  export let properties;
  let el
  let player

  $: if (el) {
    if (player) {
      player.destroy()
    }
    player = new Player({
      el,
      url: properties.src,
      width: properties.width,
      height: properties.height,
      poster: properties.poster,
    })
  }
</script>

<div bind:this={el}></div>
