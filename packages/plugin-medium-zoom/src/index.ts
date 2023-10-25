import type { Plugin } from "hashmd";
import type * as M from "medium-zoom";

export interface HashmdPluginMediumZoomOptions extends M.ZoomOptions {
  filter?: (img: HTMLDivElement) => boolean;
}

export default function mediumZoom(
  options?: HashmdPluginMediumZoomOptions,
): Plugin {
  let m: typeof M;

  return {
    viewerEffect({ markdownBody }) {
      const imgs = [...markdownBody.querySelectorAll("img")].filter((e) => {
        return (options?.filter?.(e) ?? true) && !e.closest("a");
      });
      if (imgs.length === 0) return;
      (async () => {
        if (!m) {
          m = await import("medium-zoom");
        }
        m.default(imgs, options);
      })();
    },
  };
}
