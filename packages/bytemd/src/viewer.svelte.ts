import { SvelteComponentTyped } from 'svelte'
import type {
  VFile,
  Root,
  BytemdPlugin,
  ViewerProps as ViewerProps2,
} from './helpers'
declare const __propDef: {
  props: {
    value?: string | undefined
    plugins?: BytemdPlugin[] | undefined
    sanitize?: ViewerProps2['sanitize']
  }
  events: {
    hast: CustomEvent<{
      hast: Root
      file: VFile
    }>
  } & {
    [evt: string]: CustomEvent<any>
  }
  slots: {}
}
export declare type ViewerProps = typeof __propDef.props
export declare type ViewerEvents = typeof __propDef.events
export declare type ViewerSlots = typeof __propDef.slots
export default class Viewer extends SvelteComponentTyped<
  ViewerProps,
  ViewerEvents,
  ViewerSlots
> {}
export {}
