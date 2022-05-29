import { SvelteComponentTyped } from 'svelte'
import type { BytemdLocale } from './helpers'
declare const __propDef: {
  props: {
    showSync: boolean
    value: string
    syncEnabled: boolean
    locale: BytemdLocale
    islimited: boolean
  }
  events: {
    sync: CustomEvent<any>
    top: CustomEvent<any>
  } & {
    [evt: string]: CustomEvent<any>
  }
  slots: {}
}
export declare type StatusProps = typeof __propDef.props
export declare type StatusEvents = typeof __propDef.events
export declare type StatusSlots = typeof __propDef.slots
export default class Status extends SvelteComponentTyped<
  StatusProps,
  StatusEvents,
  StatusSlots
> {}
export {}
