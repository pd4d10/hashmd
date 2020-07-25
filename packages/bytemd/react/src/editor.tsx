import React, { useEffect, useRef, HTMLAttributes } from 'react';
import * as bytemd from 'bytemd';

export interface EditorProps extends bytemd.EditorProps {
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
  onChange?(value: string): void;
}

export const Editor: React.FC<EditorProps> = ({
  children,
  wrapperProps,
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
    // @ts-ignore
    editor.$on('change', (e) => {
      if (onChange) onChange(e.detail.value);
    });
    ed.current = editor;
  }, [el.current]);

  useEffect(() => {
    // TODO: performance
    ed.current?.$set(props);
  }, [props]);

  return <div {...wrapperProps} ref={el}></div>;
};
