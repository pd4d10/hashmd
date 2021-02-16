import type { BytemdPlugin } from 'bytemd';
import type * as M from 'medium-zoom';

export default function mediumZoom(options?: M.ZoomOptions): BytemdPlugin {
  let m: typeof M;

  return {
    viewerEffect({ markdownBody }) {
      const imgs = [...markdownBody.querySelectorAll('img')].filter((e) => {
        // Exclude images with anchor parent
        let $: HTMLElement | null = e;
        while ($ && $ !== markdownBody) {
          if ($.tagName === 'A') return false;
          $ = $.parentElement;
        }
        return true;
      });
      if (imgs.length === 0) return;

      (async () => {
        if (!m) {
          m = await import('medium-zoom');
        }
        m.default(imgs, options);
      })();
    },
  };
}
