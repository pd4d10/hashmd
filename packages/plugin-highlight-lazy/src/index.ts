import { BytemdPlugin } from 'bytemd';
import H from 'highlight.js';

export interface HighlightLazyOption {
  init?(hljs: typeof H): void | Promise<void>;
}

export default function highlightLazy({
  init,
}: HighlightLazyOption): BytemdPlugin {
  let hljs: typeof H;
  return {
    viewerEffect(el) {
      const func = async () => {
        if (!hljs) {
          hljs = await import('highlight.js');
          if (init) await init(hljs);
        }

        el.querySelectorAll<HTMLElement>('pre>code')?.forEach((code) => {
          hljs.highlightBlock(code);
        });
      };

      func();
    },
  };
}
