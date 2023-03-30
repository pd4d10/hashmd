import * as bytemd from 'bytemd'
import React, { useEffect, useRef } from 'react'

export interface EditorProps extends bytemd.EditorProps {
  className?: string | undefined
  onChange?(value: string): void
}

export const Editor: React.FC<EditorProps> = ({ onChange, ...props }) => {
  const ed = useRef<bytemd.Editor>()
  const el = useRef<HTMLDivElement>(null)
  const onChangeRef = useRef<EditorProps['onChange']>()

  useEffect(() => {
    if (!el.current) return

    const editor = new bytemd.Editor({
      target: el.current,
      props,
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

  return <div className={props.className} ref={el}></div>
}
