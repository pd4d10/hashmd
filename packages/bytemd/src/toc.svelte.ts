import { SvelteComponentTyped } from 'svelte'
import type { Root, BytemdLocale } from './helpers'
declare const __propDef: {
  props: {
    hast: Root
    currentBlockIndex: number
    locale: BytemdLocale
    visible: boolean
  }
  events: {
    click: CustomEvent<any>
  } & {
    [evt: string]: CustomEvent<any>
  }
  slots: {}
}
export declare type TocProps = typeof __propDef.props
export declare type TocEvents = typeof __propDef.events
export declare type TocSlots = typeof __propDef.slots
export default class Toc extends SvelteComponentTyped<
  TocProps,
  TocEvents,
  TocSlots
> {}
export {}
