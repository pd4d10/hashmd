<script>
  export let src;
  export let poster;
  export let width;
  export let height;
  export let attrs;
</script>

<style>
  video {
    max-width: 100%;
  }
</style>

<video {...attrs} {src} {poster} {width} {height} />
