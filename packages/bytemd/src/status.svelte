<script lang="ts">
  export let value: string;
  $: bytes = new TextEncoder().encode(value).length;
  $: lines = value.split('\n').length;
</script>

<div class="bytemd-status">
  <span>Bytes: <strong>{bytes}</strong></span><span
    >Lines: <strong>{lines}</strong></span
  >
</div>
