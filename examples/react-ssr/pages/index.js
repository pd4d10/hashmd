import Head from 'next/head'
import { Editor } from '@bytemd/react'
import breaks from '@bytemd/plugin-breaks'
import footnotes from '@bytemd/plugin-footnotes'
import frontmatter from '@bytemd/plugin-frontmatter'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight'
import math from '@bytemd/plugin-math'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import mermaid from '@bytemd/plugin-mermaid'
import gemoji from '@bytemd/plugin-gemoji'
import { useMemo, useState, Fragment } from 'react'
import { markdownText } from '@bytemd/example-utils'

const pluginNames = [
  'breaks',
  'gfm',
  'footnotes',
  'frontmatter',
  'gemoji',
  'highlight',
  'math',
  'medium-zoom',
  'mermaid',
]
const pluginNamesEnable = pluginNames.reduce(
  (acc, p) => ((acc[p] = true), acc),
  {}
)

export default function Home() {
  const [value, setValue] = useState(markdownText)
  const [enabled, setEnabled] = useState(pluginNamesEnable)

  const plugins = useMemo(
    () =>
      [
        enabled.breaks && breaks(),
        enabled.footnotes && footnotes(),
        enabled.frontmatter && frontmatter(),
        enabled.gemoji && gemoji(),
        enabled.gfm && gfm(),
        enabled.highlight && highlight(),
        enabled.math && math(),
        // enabled.mdx && mdx(),
        enabled['medium-zoom'] && mediumZoom(),
        enabled.mermaid && mermaid(),
      ].filter((x) => x),
    [enabled]
  )

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ padding: '10px 0' }}>
        Plugins:
        {pluginNames.map((p) => (
          <Fragment key={p}>
            {' '}
            <label>
              <input
                type="checkbox"
                checked={enabled[p]}
                onChange={(e) => {
                  const { checked } = e.target
                  setEnabled((v) => ({
                    ...v,
                    [p]: checked,
                  }))
                }}
              />
              {p}
            </label>
          </Fragment>
        ))}
      </div>
      <Editor
        value={value}
        plugins={plugins}
        onChange={(v) => {
          setValue(v)
        }}
      />

      <style jsx global>{`
        body {
          margin: 0 10px;
        }
        .bytemd {
          height: 90vh !important;
        }
      `}</style>
    </div>
  )
}
