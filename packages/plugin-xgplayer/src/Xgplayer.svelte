<script>
  import Player from 'xgplayer';

  export let src
  export let width
  export let height
  export let poster

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
