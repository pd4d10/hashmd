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
      url: properties.url,
      width: properties.width,
      height: properties.height,
    })
  }
</script>

<div bind:this={el}></div>
