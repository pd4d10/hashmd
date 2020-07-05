import { BytemdPlugin } from 'bytemd';
import embed from 'vega-embed';

export default function veta(): BytemdPlugin {
  return {
    sanitizeSchema: {
      attributes: {
        code: ['className'],
      },
    },
    effect(el) {
      const els = el.querySelectorAll<HTMLElement>('pre>code.language-vega');
      els.forEach((el) => {
        try {
          const pre = el.parentElement!;
          embed(el, JSON.parse(el.innerText));
          pre.replaceWith(pre.children[0]);
        } catch (err) {
          console.error(err);
        }
      });
    },
  };
}
