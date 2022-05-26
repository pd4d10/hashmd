import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import * as bytemd from 'bytemd'

export interface EditorProps extends Omit<bytemd.EditorProps, 'editorLoaded'> {
  onChange?(value: string): void
}

export interface EditorRef {
  codeMirror?: bytemd.CodeMirrorEditor
  container?: HTMLDivElement | null
}

const InternalEditor: React.ForwardRefRenderFunction<EditorRef, EditorProps> = (
  { onChange, ...props },
  ref
) => {
  const ed = useRef<bytemd.Editor>()
  const el = useRef<HTMLDivElement>(null)
  const onChangeRef = useRef<EditorProps['onChange']>()

  const [codeMirror, setCodeMirror] = useState<bytemd.CodeMirrorEditor>()
  useImperativeHandle(ref, () => ({ codeMirror, container: el.current }), [
    codeMirror,
    el.current,
  ])

  useEffect(() => {
    if (!el.current) return

    const editor = new bytemd.Editor({
      target: el.current,
      props: {
        ...props,
        editorLoaded: setCodeMirror,
      },
    })
    editor.$on('change', (e: CustomEvent<{ value: string }>) => {
      onChangeRef.current?.(e.detail.value)
    })
    ed.current = editor

    return () => {
      editor.$destroy()
    }
  }, [])

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    // TODO: performance
    ed.current?.$set(props)
  }, [props])

  return <div ref={el}></div>
}

export const Editor = React.forwardRef(InternalEditor)
