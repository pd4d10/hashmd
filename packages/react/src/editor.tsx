import React, { useEffect, useRef } from 'react'
import * as bytemd from 'bytemd'

export interface EditorProps extends bytemd.EditorProps {
  onChange?(value: string): void
}

export const Editor: React.FC<EditorProps> = ({
  children,
  onChange,
  ...props
}) => {
  const ed = useRef<bytemd.Editor>()
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!el.current) return
    const editor = new bytemd.Editor({
      target: el.current,
      props,
    })
    ed.current = editor

    return () => {
      editor?.$destroy()
    }
  }, [])

  useEffect(() => {
    ed.current.$on('change', (e) => {
      onChange == null ? void 0 : onChange(e.detail.value)
    })
  }, [onChange])

  useEffect(() => {
    // TODO: performance
    ed.current?.$set(props)
  }, [props])

  return <div ref={el}></div>
}
