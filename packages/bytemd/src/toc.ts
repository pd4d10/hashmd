import type { BytemdLocale } from './types'
import type { Root, Element } from 'hast'
import { LitElement, css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'
import { visit } from 'unist-util-visit'

function stringifyHeading(e: Element) {
  let result = ''
  visit(e, (node) => {
    if (node.type === 'text') {
      result += node.value
    }
  })
  return result
}

@customElement('bytemd-toc')
export class Toc extends LitElement {
  @property() hast?: Root
  @property() currentBlockIndex = 0
  @property() locale: Partial<BytemdLocale> = {}

  @property({ state: true }) items: { level: number; text: string }[] = []
  @property({ state: true }) minLevel = 6
  @property({ state: true }) currentHeadingIndex = 0

  protected render(): unknown {
    this.hast?.children
      .filter((v): v is Element => v.type === 'element')
      .forEach((node, index) => {
        if (node.tagName[0] === 'h' && !!node.children.length) {
          const i = Number(node.tagName[1])
          this.minLevel = Math.min(this.minLevel, i)
          this.items.push({
            level: i,
            text: stringifyHeading(node),
          })
        }

        // console.log(currentBlockIndex, index);
        if (this.currentBlockIndex >= index) {
          this.currentHeadingIndex = this.items.length - 1
        }
      })

    const { locale, items, currentHeadingIndex, minLevel } = this

    return html`<h2>${locale.toc}</h2>
      <ul>
        ${items.map(
          (item, index) =>
            html`<li
              class=${classMap({
                [`toc-${item.level}`]: true,
                active: currentHeadingIndex === index,
                first: item.level === minLevel,
              })}
              style=${styleMap({
                paddingLeft: `${(item.level - minLevel) * 16 + 8}px`,
              })}
              @click=${() => {
                this.dispatchEvent(new CustomEvent('click', { detail: index }))
              }}
            >
              ${item.text}
            </li>`,
        )}
      </ul>`
  }

  static styles = css`
    li {
      list-style: none;
      margin-bottom: 4px;
      font-size: 14px;
      line-height: 2;
      cursor: pointer;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .active {
      color: var(--primary);
      background-color: var(--gray-100);
    }
    &-first {
      font-weight: 500;
    }
  `
}
