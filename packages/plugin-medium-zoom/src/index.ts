import { BytemdPlugin } from 'bytemd';
import { ZoomOptions } from 'medium-zoom';

export default function mediumZoom(options?: ZoomOptions): BytemdPlugin {
  return {
    viewerEffect(el) {
      const imgs = [...el.querySelectorAll('img')].filter((e) => {
        // Exclude images with anchor parent
        let $: HTMLElement | null = e;
        while ($ && $ !== el) {
          if ($.tagName === 'A') return false;
          $ = $.parentElement;
        }
        return true;
      });
      if (imgs.length === 0) return;

      import('medium-zoom').then(({ default: init }) => {
        init(imgs, options);
      });
    },
  };
}
