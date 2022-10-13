import './App.css'
import pluginGfm from '@bytemd/plugin-gfm'
import { Editor } from '@bytemd/react'
import 'bytemd/dist/index.css'
import React, { useMemo, useState } from 'react'

function App() {
  const [value, setValue] = useState('')
  const plugins = useMemo(() => [pluginGfm()], [])

  return (
    <div className="App">
      <Editor
        value={value}
        plugins={plugins}
        uploadImages={async (files) => {
          // upload images here
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
