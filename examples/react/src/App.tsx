import React, { useMemo, useState } from 'react'
import { Editor } from '@bytemd/react'
import pluginGfm from '@bytemd/plugin-gfm'
import 'bytemd/dist/index.css'
import './App.css'

function App() {
  const [value, setValue] = useState('')
  const plugins = useMemo(() => [pluginGfm()], [])

  return (
    <div className="App">
      <Editor
        value={value}
        plugins={plugins}
        uploadImages={async (files) => {
          // TODO: upload images here
          return [
            {
              url: 'https://picsum.photos/200/300',
            },
          ]
        }}
        onChange={(v) => {
          setValue(v)
        }}
      />
    </div>
  )
}

export default App
