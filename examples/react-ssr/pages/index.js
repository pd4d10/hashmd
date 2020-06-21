import Head from 'next/head';
import { Editor } from 'bytemd/react';
import highlight from '@bytemd/plugin-highlight';
import math from '@bytemd/plugin-math';
// import mermaid from '@bytemd/plugin-mermaid';
import { useMemo, useState, useEffect, Fragment } from 'react';

export default function Home() {
  const [value, setValue] = useState('');
  const [enabled, setEnabled] = useState({
    mermaid: true,
    highlight: true,
    math: true,
  });

  useEffect(() => {
    const init = async () => {
      const res = await fetch(
        'https://raw.githubusercontent.com/bytedance/bytemd/master/assets/demo.md'
      );
      const text = await res.text();
      setValue(text);
    };

    init();
  }, []);

  const plugins = useMemo(
    () =>
      [
        // enabled.mermaid && mermaid(), // TODO: https://github.com/vercel/next.js/issues/706
        enabled.highlight && highlight(),
        enabled.math && math(),
      ].filter((x) => x),
    [enabled]
  );

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ padding: '10px 0' }}>
        Plugins:
        {['math', 'highlight', 'mermaid'].map((p) => (
          <Fragment key={p}>
            {' '}
            <label>
              <input
                type="checkbox"
                checked={enabled[p]}
                onChange={(e) => {
                  const { checked } = e.target;
                  setEnabled((v) => ({
                    ...v,
                    [p]: checked,
                  }));
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
          setValue(v);
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
  );
}
