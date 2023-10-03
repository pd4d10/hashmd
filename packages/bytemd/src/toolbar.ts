import { icons } from './icons'
import {
  BytemdAction,
  BytemdEditorContext,
  BytemdLocale,
  ViewerProps,
} from './types'
import { getProcessor } from './utils'
import { LitElement, html, css, nothing, PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { DelegateInstance, delegate } from 'tippy.js'

const tippyClass = 'tippy'
const tippyClassRight = 'tippy-right'
const tippyPathKey = 'tippy-path'

interface RightAction extends BytemdAction {
  active?: boolean
  hidden?: boolean
}

@customElement('bytemd-toolbar')
export class Toolbar extends LitElement {
  @property() activeTab: 'icon' | 'write' | 'preview' = 'icon'
  @property() fullscreen = false
  @property() sidebar: false | 'help' | 'toc' = false
  @property() locale: Partial<BytemdLocale> = {}
  @property() actions: BytemdAction[] = []
  @property() rightAfferentActions: BytemdAction[] = []
  @property() context: BytemdEditorContext | undefined

  private delegateInstance: DelegateInstance | null = null

  get rightActions() {
    const {
      activeTab,
      fullscreen,
      sidebar,
      locale,
      actions,
      rightAfferentActions,
      dispatch,
    } = this

    const split = activeTab === 'icon'
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

    return rightActions
  }

  protected firstUpdated(): void {
    this.init()
  }

  init() {
    this.delegateInstance = delegate(this, {
      target: `.${tippyClass}`,
      onCreate: ({ setProps, reference }) => {
        const payload = this.getPayloadFromElement(reference)
        if (!payload) return
        const { item, paths } = payload
        const { handler } = item
        if (!handler) return

        if (handler.type === 'action') {
          setProps({
            content: item.title,
            onHidden(ins) {
              ins.destroy()
            },
          })
        } else if (handler.type === 'dropdown') {
          // dropdown
          const dropdown = document.createElement('div')
          dropdown.classList.add('bytemd-dropdown')

          if (item.title) {
            const dropdownTitle = document.createElement('div')
            dropdownTitle.classList.add('bytemd-dropdown-title')
            dropdownTitle.appendChild(document.createTextNode(item.title))
            dropdown.appendChild(dropdownTitle)
          }

          handler.actions.forEach((subAction, i) => {
            const dropdownItem = document.createElement('div')
            dropdownItem.classList.add('bytemd-dropdown-item')
            dropdownItem.setAttribute(tippyPathKey, [...paths, i].join('-'))
            if (subAction.handler?.type === 'dropdown') {
              dropdownItem.classList.add(tippyClass)
            }
            if (reference.classList.contains(tippyClassRight)) {
              dropdownItem.classList.add(tippyClassRight)
            }
            // div.setAttribute('data-tippy-placement', 'right');
            dropdownItem.innerHTML = `${
              subAction.icon
                ? `<div class="bytemd-dropdown-item-icon">${subAction.icon}</div>`
                : ''
            }<div class="bytemd-dropdown-item-title">${subAction.title}</div>`
            dropdown.appendChild(dropdownItem)
          })

          setProps({
            allowHTML: true,
            showOnCreate: true,
            theme: 'light-border',
            placement: 'bottom-start',
            interactive: true,
            interactiveDebounce: 50,
            arrow: false,
            offset: [0, 4],
            content: dropdown.outerHTML,
            onHidden: (ins) => {
              ins.destroy()
            },
            onCreate: (ins) => {
              ;[
                ...ins.popper.querySelectorAll('.bytemd-dropdown-item'),
              ].forEach((el, i) => {
                const actionHandler = handler.actions[i]?.handler
                if (actionHandler?.type === 'action') {
                  const { mouseenter, mouseleave } = actionHandler
                  if (mouseenter) {
                    el.addEventListener('mouseenter', () => {
                      mouseenter(this.context!)
                    })
                  }
                  if (mouseleave) {
                    el.addEventListener('mouseleave', () => {
                      mouseleave(this.context!)
                    })
                  }
                }
              })
            },
          })
        }
      },
    })
  }

  dispatch(key: string, detail: string) {
    this.dispatchEvent(new CustomEvent(key, { detail }))
  }

  getPayloadFromElement(e: Element) {
    const paths = e
      .getAttribute(tippyPathKey)
      ?.split('-')
      ?.map((x) => parseInt(x, 10))
    if (!paths) return
    // if (!paths) {
    //   return {
    //     paths: [],
    //     item: {
    //       title: 'test',
    //       handler: actions,
    //     },
    //   };
    // }

    let item: BytemdAction = {
      title: '',
      handler: {
        type: 'dropdown',
        actions: e.classList.contains(tippyClassRight)
          ? this.rightActions
          : this.actions,
      },
    }
    paths?.forEach((index) => {
      if (item.handler?.type === 'dropdown') {
        item = item.handler.actions[index]
      }
    })

    return { paths, item }
  }

  render() {
    const {
      activeTab,
      fullscreen,
      sidebar,
      locale,
      actions,
      rightAfferentActions,
      dispatch,

      rightActions,

      delegateInstance,
      init,
    } = this

    const split = activeTab === 'icon'

    return html`${split
        ? actions.map(
            (item, index) =>
              item.handler &&
              html`<div
                class=${classMap({ icon: true, [tippyClass]: true })}
                tippy-path=${index}
                @click=${(e: MouseEvent | KeyboardEvent) => {
                  const target = (e.target as Element).closest(
                    `[${tippyPathKey}]`,
                  )
                  if (!target) return
                  const handler =
                    this.getPayloadFromElement(target)?.item?.handler
                  if (handler?.type === 'action') {
                    handler.click(this.context!)
                  }
                  delegateInstance?.destroy()
                  init()
                }}
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
      )}`
  }

  static styles = css`
    * {
      box-sizing: border-box;
    }

    :host {
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
