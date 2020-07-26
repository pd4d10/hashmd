import { BytemdPlugin } from 'bytemd';
import H from 'highlight.js';

export interface HighlightLazyOptions {
  init?(hljs: typeof H): void | Promise<void>;
}

export default function highlightLazy({
  init,
}: HighlightLazyOptions = {}): BytemdPlugin {
  let hljs: typeof H;
  return {
    viewerEffect(el) {
      (async () => {
        const els = el.querySelectorAll<HTMLElement>('pre>code');
        if (els.length === 0) return;

        if (!hljs) {
          hljs = await import('highlight.js');
          if (init) await init(hljs);
        }

        els.forEach((el) => {
          hljs.highlightBlock(el);
        });
      })();
    },
  };
}
