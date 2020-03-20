<script>
  import Player from 'xgplayer';

  export let url
  export let width
  export let height
  export let poster
  export let playerOptions

  let el
  let player

  $: if (el) {
    if (player) {
      player.destroy()
    }
    player = new Player({
      ...playerOptions,
      el,
      url,
      width,
      height,
      poster,
    })
  }
</script>

<div bind:this={el}></div>
