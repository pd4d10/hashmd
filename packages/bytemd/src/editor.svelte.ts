import { SvelteComponentTyped } from 'svelte'
import type { BytemdPlugin, EditorProps as Props } from './helpers'
declare const __propDef: {
  props: {
    value?: string | undefined
    plugins?: BytemdPlugin[] | undefined
    sanitize?: Props['sanitize']
    mode?: 'split' | 'tab' | 'auto' | undefined
    previewDebounce?: number | undefined
    placeholder?: Props['placeholder']
    editorConfig?: Props['editorConfig']
    locale?: Props['locale']
    uploadImages?: Props['uploadImages']
    overridePreview?: Props['overridePreview']
    maxLength?: number | undefined
  }
  events: {
    change: CustomEvent<{
      value: string
    }>
  } & {
    [evt: string]: CustomEvent<any>
  }
  slots: {}
}
export declare type EditorProps = typeof __propDef.props
export declare type EditorEvents = typeof __propDef.events
export declare type EditorSlots = typeof __propDef.slots
export default class Editor extends SvelteComponentTyped<
  EditorProps,
  EditorEvents,
  EditorSlots
> {}
export {}
