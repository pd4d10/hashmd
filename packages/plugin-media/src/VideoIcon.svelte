<script>
  import icon from 'icons/play-16.svg';
  export let onClick;
  export let editor;
</script>

<div on:click={() => onClick(editor)}>
  {@html icon}
</div>
