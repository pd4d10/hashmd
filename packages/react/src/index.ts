import { createComponent } from '@lit-labs/react'
import * as bytemd from 'bytemd'
import React from 'react'

export const Editor = createComponent({
  tagName: 'bytemd-editor',
  elementClass: bytemd.Editor,
  react: React,
  events: {
    onChange: 'change',
  },
})

export const Viewer = createComponent({
  tagName: 'bytemd-viewer',
  elementClass: bytemd.Viewer,
  react: React,
  events: {
    onMeta: 'meta',
  },
})
