import { Plugin, ViewerProps } from "./types";
import { getProcessor } from "./utils";
import type { Root, Element } from "hast";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";

export interface Meta {
  hast: Root;
  file: VFile;
  toc: { level: number; text: string }[];
}

function stringifyHeading(e: Element) {
  let result = "";
  visit(e, (node) => {
    if (node.type === "text") {
      result += node.value;
    }
  });
  return result;
}

@customElement("hashmd-viewer")
export class Viewer extends LitElement {
  @property({ attribute: true }) value: ViewerProps["value"] = "";
  @property() plugins: ViewerProps["plugins"];
  @property() sanitize: ViewerProps["sanitize"];
  @property() remarkRehype: ViewerProps["remarkRehype"];

  @property({ state: true }) meta?: Meta;

  protected firstUpdated() {
    this.renderRoot.addEventListener("click", (e) => {
      const $ = e.target as HTMLElement;
      if ($.tagName === "A") {
        const href = $.getAttribute("href");
        if (href?.startsWith("#")) {
          this.querySelector(
            "#user-content-" + href.slice(1),
          )?.scrollIntoView();
        }
      }
    });
  }

  render() {
    const dispatchPlugin: Plugin = {
      // @ts-ignore
      rehype: (processor) =>
        processor.use<any, Root>(() => (hast, file) => {
          // console.log(hast, file)

          let toc: Meta["toc"] = [];
          hast.children
            .filter((v): v is Element => v.type === "element")
            .forEach((node) => {
              if (node.tagName[0] === "h" && !!node.children.length) {
                const i = Number(node.tagName[1]);
                toc.push({
                  level: i,
                  text: stringifyHeading(node),
                });
              }
            });

          this.meta = { hast, file, toc };
          this.dispatchEvent(new CustomEvent("meta", { detail: this.meta }));
        }),
    };

    const { value, plugins = [], sanitize, remarkRehype } = this;
    const rawHtml = getProcessor({
      plugins: [...plugins, dispatchPlugin],
      sanitize,
      remarkRehype,
    })
      .processSync(value)
      .toString();

    return html`${unsafeHTML(rawHtml)}`;
  }
}
