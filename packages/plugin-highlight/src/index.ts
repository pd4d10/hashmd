import type { Plugin } from "hashmd";
import type H from "highlight.js";

export interface HashmdPluginHighlightOptions {
  init?(hljs: typeof H): void | Promise<void>;
}

export default function highlight({
  init,
}: HashmdPluginHighlightOptions = {}): Plugin {
  let hljs: typeof H;
  return {
    viewerEffect({ markdownBody }) {
      (async () => {
        const els = markdownBody.querySelectorAll<HTMLElement>("pre>code");
        if (els.length === 0) return;

        if (!hljs) {
          hljs = await import("highlight.js").then((m) => m.default);
          if (init) await init(hljs);
        }

        els.forEach((el) => {
          hljs.highlightElement(el);
        });
      })();
    },
  };
}
