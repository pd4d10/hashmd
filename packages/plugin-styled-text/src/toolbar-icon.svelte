<script>
  import { onMount } from 'svelte';
  import Pickr from '@simonwep/pickr';
  import pencil from 'icons/pencil-16.svg';

  export let editor;
  let el;

  onMount(() => {
    const pickr = Pickr.create({
      el,
      theme: 'nano',
      useAsButton: true,
      default: '#0366d6',
      // From https://primer.style/css/support/color-system
      swatches: [
        '#0366d6',
        '#28a745',
        '#6f42c1',
        '#ffd33d',
        '#f66a0a',
        '#d73a49',
        '#ea4aaa',
      ],
      components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
          input: true,
          save: true,
        },
      },
      strings: {
        save: 'OK',
      },
    });
    pickr.on('save', color => {
      console.log(color.toHEXA());
      pickr.hide();
      const pos = editor.getCursor('from');
      const prefix = `<span style="color:${color.toHEXA()}">`;
      editor.replaceRange(`${prefix}</span>`, pos);
      editor.setCursor({ line: pos.line, ch: pos.ch + prefix.length });
      editor.focus();
    });
  });
</script>

<div bind:this={el}>
  {@html pencil}
</div>
