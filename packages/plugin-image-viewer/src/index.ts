import { BytemdPlugin } from 'bytemd';
import './index.css';

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

export default function imageViewer(): BytemdPlugin {
  return {
    effect(el) {
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

        const container = document.createElement('div');
        container.className = 'image-viewer';
        container.appendChild(img);

        document.body.appendChild(container);

        container.addEventListener('click', (e) => {
          document.body.removeChild(container);
        });
      };

      el.addEventListener('click', handler);
      return () => {
        el.removeEventListener('click', handler);
      };
    },
  };
}
