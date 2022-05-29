import { SvelteComponentTyped } from 'svelte'
import type { BytemdAction, BytemdLocale } from './helpers'
declare const __propDef: {
  props: {
    actions: BytemdAction[]
    locale: BytemdLocale
    visible: boolean
  }
  events: {
    [evt: string]: CustomEvent<any>
  }
  slots: {}
}
export declare type HelpProps = typeof __propDef.props
export declare type HelpEvents = typeof __propDef.events
export declare type HelpSlots = typeof __propDef.slots
export default class Help extends SvelteComponentTyped<
  HelpProps,
  HelpEvents,
  HelpSlots
> {}
export {}
