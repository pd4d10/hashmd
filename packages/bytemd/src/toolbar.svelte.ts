import { SvelteComponentTyped } from 'svelte'
import type { BytemdEditorContext, BytemdAction, BytemdLocale } from './helpers'
declare const __propDef: {
  props: {
    context: BytemdEditorContext
    split: boolean
    activeTab: false | 'write' | 'preview'
    fullscreen: boolean
    sidebar: false | 'help' | 'toc'
    locale: BytemdLocale
    actions: BytemdAction[]
  }
  events: {
    tab: CustomEvent<any>
    click: CustomEvent<any>
  } & {
    [evt: string]: CustomEvent<any>
  }
  slots: {}
}
export declare type ToolbarProps = typeof __propDef.props
export declare type ToolbarEvents = typeof __propDef.events
export declare type ToolbarSlots = typeof __propDef.slots
export default class Toolbar extends SvelteComponentTyped<
  ToolbarProps,
  ToolbarEvents,
  ToolbarSlots
> {}
export {}
