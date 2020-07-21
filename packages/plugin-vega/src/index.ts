import { BytemdPlugin } from 'bytemd';

export default function vega(): BytemdPlugin {
  return {
    viewerEffect(el) {
      const els = el.querySelectorAll<HTMLElement>('pre>code.language-vega');
      if (els.length === 0) return;

      import('vega-embed').then(({ default: embed }) => {
        els.forEach((el) => {
          try {
            const pre = el.parentElement!;
            embed(el, JSON.parse(el.innerText));
            pre.replaceWith(pre.children[0]);
          } catch (err) {
            console.error(err);
          }
        });
      });
    },
  };
}
