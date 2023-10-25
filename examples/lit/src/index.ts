import markdownText from "./text.md?raw";
import breaks from "@hashmd/plugin-breaks";
import frontmatter from "@hashmd/plugin-frontmatter";
import gfm from "@hashmd/plugin-gfm";
import highlight from "@hashmd/plugin-highlight";
import math from "@hashmd/plugin-math";
import mediumZoom from "@hashmd/plugin-medium-zoom";
import mermaid from "@hashmd/plugin-mermaid";
import "github-markdown-css";
import "hashmd";
import "highlight.js/styles/vs.css";
// placed after highlight styles to override `code` padding
import "katex/dist/katex.css";
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

function stripPrefixes(obj: Record<string, any>) {
  return Object.entries(obj).reduce(
    (p, [key, value]) => {
      p[key.split("/").slice(-1)[0].replace(".json", "")] = value;
      // console.log(p)
      return p;
    },
    {} as Record<string, any>,
  );
}

const locales = stripPrefixes(
  import.meta.glob("/node_modules/hashmd/locales/*.json", { eager: true }),
);
const gfmLocales = stripPrefixes(
  import.meta.glob("/node_modules/@hashmd/plugin-gfm/locales/*.json", {
    eager: true,
  }),
);
const mathLocales = stripPrefixes(
  import.meta.glob("/node_modules/@hashmd/plugin-math/locales/*.json", {
    eager: true,
  }),
);
const mermaidLocales = stripPrefixes(
  import.meta.glob("/node_modules/@hashmd/plugin-mermaid/locales/*.json", {
    eager: true,
  }),
);

@customElement("my-element")
export class MyElement extends LitElement {
  @property() value = markdownText;
  @property() mode = "auto";
  @property() locale = "en";
  @property() enabled = {
    breaks: false,
    frontmatter: true,
    gfm: true,
    highlight: true,
    math: true,
    "medium-zoom": true,
    mermaid: true,
  };

  render() {
    const { value, mode, enabled, locale } = this;
    const plugins = [
      enabled.breaks && breaks(),
      enabled.frontmatter && frontmatter(),
      enabled.gfm &&
        gfm({
          locale: gfmLocales[locale],
        }),
      enabled.highlight && highlight(),
      enabled.math &&
        math({
          locale: mathLocales[locale],
          katexOptions: { output: "html" }, // https://github.com/KaTeX/KaTeX/issues/2796
        }),
      enabled["medium-zoom"] && mediumZoom(),
      enabled.mermaid &&
        mermaid({
          locale: mermaidLocales[locale],
        }),
    ].filter((x) => x);

    return html`
      <div class="container">
        <div class="line">
          Mode:
          ${["auto", "split", "tab"].map(
            (m) =>
              html`<label>
                <input
                  type="radio"
                  name="mode"
                  value=${m}
                  ?checked=${m === mode}
                  @change=${(e: Event) => {
                    this.mode = (e.target as HTMLInputElement).value;
                  }}
                />${m}</label
              >`,
          )}
          , Locale:
          <select
            value=${locale}
            @change=${(e: Event) => {
              this.locale = (e.target as HTMLInputElement).value;
            }}
          >
            ${Object.keys(locales).map(
              (l) => html`<option value=${locale}>${l}</option>`,
            )}
          </select>
        </div>
        <div class="line">
          Plugins:
          ${Object.entries(enabled).map(
            ([p, v]) =>
              html`<label
                ><input
                  type="checkbox"
                  ?checked=${v}
                  name=${p}
                  @change=${(e: Event) => {
                    const current = (e.target as HTMLInputElement)
                      .value as keyof typeof this.enabled;
                    this.enabled[current] = !this.enabled[current];
                  }}
                />${p}</label
              >`,
          )}
        </div>
        <hashmd-editor
          .value=${value}
          .plugins=${plugins}
          .mode=${mode}
        ></hashmd-editor>
      </div>
    `;
  }

  static styles = css`
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .line {
      margin: 10px 0;
      text-align: center;
    }
    :global(body) {
      margin: 0 10px;
      font-size: 14px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica,
        Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    }
    :global(hashmd-editor) {
      height: calc(100vh - 100px);
    }
    :global(.medium-zoom-overlay) {
      z-index: 100;
    }
    :global(.medium-zoom-image--opened) {
      z-index: 101;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element": MyElement;
  }
}
