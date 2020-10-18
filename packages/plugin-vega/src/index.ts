import type { BytemdPlugin } from 'bytemd';
import type { default as Embed, EmbedOptions } from 'vega-embed';

export default function vega(options: EmbedOptions = {}): BytemdPlugin {
  let embed: typeof Embed;
  return {
    viewerEffect({ $el }) {
      const els = $el.querySelectorAll<HTMLElement>('pre>code.language-vega');
      if (els.length === 0) return;

      (async () => {
        if (!embed) {
          embed = await import('vega-embed').then((m) => m.default);
        }

        els.forEach((el) => {
          try {
            const pre = el.parentElement!;
            const source = el.innerText;

            const container = document.createElement('div');
            container.classList.add('bytemd-vega');
            pre.replaceWith(container);

            embed(container, source, options);
          } catch (err) {
            // console.error(err);
          }
        });
      })();
    },
  };
}
