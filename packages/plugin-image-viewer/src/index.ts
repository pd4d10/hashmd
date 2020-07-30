import { BytemdPlugin } from 'bytemd';

function calculate(w: number, h: number) {
  const ratio = w / h;
  let mW = Math.min(w, window.innerWidth);
  let mH = Math.min(h, window.innerHeight);
  if (mW / mH > ratio) {
    mW = mH * ratio;
  } else {
    mH = mW / ratio;
  }
  return {
    width: mW,
    height: mH,
    left: Math.abs(window.innerWidth - mW) / 2,
    top: Math.abs(window.innerHeight - mH) / 2,
  };
}

function addStyle(style: string) {
  const el = document.createElement('style');
  el.innerHTML = style;
  document.head.appendChild(el);
  return () => {
    document.head.removeChild(el);
  };
}

function hasAnchorParent($: HTMLElement | null, root: HTMLElement): boolean {
  while ($ && $ !== root) {
    if ($.tagName === 'A') return true;
    $ = $.parentElement;
  }
  return false;
}

export default function imageViewer(): BytemdPlugin {
  return {
    viewerEffect(el) {
      const imgs = [...el.querySelectorAll('img')].filter(
        (e) => !hasAnchorParent(e, el)
      );
      if (imgs.length === 0) return;

      imgs.forEach((img) => {
        img.style.cursor = 'zoom-in';
      });

      const removeStyle = addStyle(`
.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  background-color: rgba(0, 0, 0, 0.8);
  transition: opacity 200ms;
}
.image-viewer img {
  position: absolute;
  cursor: zoom-out;
}`);

      const handler: EventListener = (e) => {
        if (!e.target) return;
        const $ = e.target as HTMLImageElement;
        if ($.tagName !== 'IMG' || hasAnchorParent($, el)) return;

        const { width, height, left, top } = calculate(
          $.naturalWidth,
          $.naturalHeight
        );
        const img = document.createElement('img');
        img.src = $.src;
        img.style.width = `${width}px`;
        img.style.height = `${height}px`;
        img.style.left = `${left}px`;
        img.style.top = `${top}px`;

        const box = document.createElement('div');
        box.className = 'image-viewer';
        box.style.opacity = '0';
        box.appendChild(img);

        document.body.appendChild(box);

        setTimeout(() => {
          box.style.opacity = '1';
        });

        box.addEventListener('click', (e) => {
          box.addEventListener('transitionend', () => {
            document.body.removeChild(box);
          });
          box.style.opacity = '0';
        });
      };

      el.addEventListener('click', handler);
      return () => {
        imgs.forEach((img) => {
          img.style.cursor = '';
        });

        removeStyle();
        el.removeEventListener('click', handler);
      };
    },
  };
}
