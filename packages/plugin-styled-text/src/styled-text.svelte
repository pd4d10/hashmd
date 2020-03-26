<script>
  import { Elements } from 'bytemd'
  export let children = [];
  export let style
</script>

<span {style}><Elements nodes={children} /></span>
