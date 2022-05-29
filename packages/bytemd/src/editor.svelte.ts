import { SvelteComponentTyped } from 'svelte'
import type { BytemdPlugin, EditorProps as EditorProps2 } from './helpers'
declare const __propDef: {
  props: {
    value?: string | undefined
    plugins?: BytemdPlugin[] | undefined
    sanitize?: EditorProps2['sanitize']
    mode?: 'split' | 'tab' | 'auto' | undefined
    previewDebounce?: number | undefined
    placeholder?: EditorProps2['placeholder']
    editorConfig?: EditorProps2['editorConfig']
    locale?: EditorProps2['locale']
    uploadImages?: EditorProps2['uploadImages']
    overridePreview?: EditorProps2['overridePreview']
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
