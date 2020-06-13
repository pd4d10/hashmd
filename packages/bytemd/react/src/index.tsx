import React, { useMemo, useEffect, useRef } from 'react';
import * as bytemd from 'bytemd';

export interface EditorProps extends bytemd.EditorProps {
  onChange?(value: string): void;
}

export const Editor: React.FC<EditorProps> = (props) => {
  const ed = useRef<bytemd.Editor>();
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!el.current) return;
    if (ed.current) ed.current.$destroy();

    const editor = new bytemd.Editor({
      target: el.current,
      props,
    });
    editor.$on('change', (e) => {
      if (props.onChange) {
        props.onChange(e.detail.value);
      }
    });
    ed.current = editor;
  }, [el.current]);

  return <div ref={el}></div>;
};

export interface ViewerProps extends bytemd.ViewerProps {}

export const Viewer: React.FC<ViewerProps> = ({ value, plugins }) => {
  const el = useRef<HTMLDivElement>(null);
  const html = useMemo(() => bytemd.processMarkdown(value, plugins), [
    value,
    plugins,
  ]);

  useEffect(() => {
    plugins?.forEach(({ onMount }) => {
      if (onMount && el.current) onMount(el.current);
    });
  }, [html]);

  return (
    <div
      ref={el}
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
};
