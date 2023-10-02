import { icons } from './icons'
import {
  BytemdAction,
  BytemdEditorContext,
  BytemdLocale,
  ViewerProps,
} from './types'
import { getProcessor } from './utils'
import { LitElement, html, css, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'

const tippyClass = 'tippy'
const tippyClassRight = 'tippy-right'
const tippyPathKey = 'tippy-path'

interface RightAction extends BytemdAction {
  active?: boolean
  hidden?: boolean
}

@customElement('bytemd-toolbar')
export class Toolbar extends LitElement {
  @property() split = true
  @property() activeTab: false | 'write' | 'preview' = false
  @property() fullscreen = false
  @property() sidebar: false | 'help' | 'toc' = false
  @property() locale: Partial<BytemdLocale> = {}
  @property() actions: BytemdAction[] = []
  @property() rightAfferentActions: BytemdAction[] = []

  dispatch(key: string, detail: string) {
    this.dispatchEvent(new CustomEvent(key, { detail }))
  }

  render() {
    const {
      split,
      activeTab,
      fullscreen,
      sidebar,
      locale,
      actions,
      rightAfferentActions,
      dispatch,
    } = this

    const tocActive = sidebar === 'toc'
    const helpActive = sidebar === 'help'
    const writeActive = activeTab === 'write'
    const previewActive = activeTab === 'preview'
    const rightActions: RightAction[] = [
      {
        title: tocActive ? locale.closeToc : locale.toc,
        icon: icons.AlignTextLeftOne,
        handler: {
          type: 'action',
          click() {
            dispatch('click', 'toc')
          },
        },
        active: tocActive,
      },
      {
        title: helpActive ? locale.closeHelp : locale.help,
        icon: icons.Helpcenter,
        handler: {
          type: 'action',
          click() {
            dispatch('click', 'help')
          },
        },
        active: helpActive,
      },
      {
        title: writeActive ? locale.exitWriteOnly : locale.writeOnly,
        icon: icons.LeftExpand,
        handler: {
          type: 'action',
          click() {
            dispatch('tab', 'write')
          },
        },
        active: writeActive,
        hidden: !split,
      },
      {
        title: previewActive ? locale.exitPreviewOnly : locale.previewOnly,
        icon: icons.RightExpand,
        handler: {
          type: 'action',
          click() {
            dispatch('tab', 'preview')
          },
        },
        active: previewActive,
        hidden: !split,
      },
      {
        title: fullscreen ? locale.exitFullscreen : locale.fullscreen,
        icon: fullscreen ? icons.OffScreen : icons.FullScreen,
        handler: {
          type: 'action',
          click() {
            dispatch('click', 'fullscreen')
          },
        },
      },
      {
        title: locale.source,
        icon: icons.GithubOne,
        handler: {
          type: 'action',
          click() {
            window.open('https://github.com/bytedance/bytemd')
          },
        },
      },
      ...rightAfferentActions,
    ]

    return html`<div class="toolbar" @click=${() => {}} @keydown=${() => {}}>
      ${split
        ? actions.map(
            (item, index) =>
              item.handler &&
              html`<div
                class=${classMap({ icon: true, [tippyClass]: true })}
                tippy-path=${index}
              >
                ${unsafeHTML(item.icon)}
              </div>`,
          )
        : html`<div
              @click=${() => {
                dispatch('tab', 'write')
              }}
              @keydown=${() => {
                //
              }}
              class=${classMap({
                tab: true,
                active: activeTab !== 'preview',
              })}
            >
              ${locale.write}
            </div>
            <div
              @click=${() => {
                dispatch('tab', 'preview')
              }}
              @keydown=${() => {
                //
              }}
              class=${classMap({
                tab: true,
                'tab-active': activeTab === 'preview',
              })}
            >
              ${locale.preview}
            </div>`}
      <div class="gap"></div>
      ${rightActions.map((item, index) =>
        item.hidden
          ? nothing
          : html`
              <div
                class=${classMap({
                  icon: true,
                  [tippyClass]: true,
                  [tippyClassRight]: true,
                  active: item.active ?? false,
                })}
                tippy-path=${index}
              >
                ${unsafeHTML(item.icon)}
              </div>
            `,
      )}
    </div>`
  }

  static styles = css`
    * {
      box-sizing: border-box;
    }

    .toolbar {
      padding: 4px 12px;
      border-bottom: 1px solid var(--border-color);
      background-color: var(--gray-000);
      user-select: none;
      overflow: hidden;
      display: flex;
    }

    .tab {
      cursor: pointer;
      padding-left: 8px;
      padding-right: 8px;
      line-height: 24px;
      font-size: 14px;
    }

    .active {
      color: var(--primary);
    }

    .icon {
      cursor: pointer;
      border-radius: 4px;
      margin-left: 6px;
      margin-right: 6px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon:hover {
      background-color: var(--border-color);
    }

    .gap {
      flex-grow: 1;
    }

    .tippy-content {
      padding-left: 0;
      padding-right: 0;
    }
  `
}
