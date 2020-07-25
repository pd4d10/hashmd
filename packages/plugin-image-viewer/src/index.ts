import { BytemdPlugin } from 'bytemd';
// import './index.css'; // TODO:

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

export default function imageViewer(): BytemdPlugin {
  return {
    viewerEffect(el) {
      const removeStyle = addStyle(`.markdown-body img {
  cursor: zoom-in;
}`);

      const handler: EventListener = (e) => {
        if (!e.target) return;
        const $ = e.target as HTMLImageElement;
        if ($.tagName !== 'IMG') return;

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
        removeStyle();
        el.removeEventListener('click', handler);
      };
    },
  };
}
