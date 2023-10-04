import { BytemdAction, BytemdLocale } from './types'
import { LitElement, css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'

function flatItems(actions: BytemdAction[]) {
  let items: BytemdAction[] = []

  actions.forEach((action) => {
    const { handler, cheatsheet } = action
    if (handler?.type === 'dropdown') {
      items.push(...flatItems(handler.actions))
    }
    if (cheatsheet) {
      items.push(action)
    }
  })

  return items
}

@customElement('bytemd-help')
export class Help extends LitElement {
  @property() locale: Partial<BytemdLocale> = {}
  @property() actions: BytemdAction[] = []

  protected render(): unknown {
    const { actions, locale } = this
    const items = flatItems(actions)

    return html`<div class="help"></div>
      <h2>${locale.cheatsheet}</h2>
      <ul>
        ${items.map((action) =>
          action.cheatsheet
            ? html`<li>
                <div class="icon">${unsafeHTML(action.icon)}</div>
                <div class="title">${action.title}</div>
                <div class="content">
                  <code>${action.cheatsheet}</code>
                </div>
              </li>`
            : nothing,
        )}
      </ul>
      <h2>${locale.shortcuts}</h2>
      <ul>
      ${items.map((action) =>
        action.handler?.type === 'action' && action.handler.shortcut
          ? html`<li>
              <div class="icon">${unsafeHTML(action.icon)}</div>
              <div class="title">${action.title}</div>
              <div class="content">
                <code>${action.handler.shortcut}</code>
              </div>
            </li>`
          : nothing,
      )}
      </ul>
    </div>`
  }
  static styles = css`
    .help {
      font-size: 13px;
    }
    ul {
      line-height: 20px;
    }
    li {
      list-style: none;
      margin-bottom: 12px;
    }
    svg {
      width: 16px;
      height: 16px;
      display: block;
    }
    .icon {
      padding: 2px 0;
    }
    .title {
      padding-left: 8px;
    }
    .content {
      float: right;
      font-size: 12px;
    }
  `
}
