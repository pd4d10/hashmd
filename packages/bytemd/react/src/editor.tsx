import React, { useEffect, useRef } from 'react';
import * as bytemd from 'bytemd';

export interface EditorProps extends bytemd.EditorProps {
  onChange?(value: string): void;
}

export const Editor: React.FC<EditorProps> = ({
  children,
  onChange,
  ...props
}) => {
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
      if (onChange) onChange(e.detail.value);
    });
    ed.current = editor;
  }, [el.current]);

  useEffect(() => {
    // TODO: performance
    ed.current?.$set(props);
  }, [props]);

  return <div ref={el}></div>;
};
