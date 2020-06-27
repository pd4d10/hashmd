import React, { useMemo, useEffect, useRef } from 'react';
import * as bytemd from 'bytemd';

export interface ViewerProps extends bytemd.ViewerProps {}

export const Viewer: React.FC<ViewerProps> = ({
  value,
  markdownOptions,
  plugins,
}) => {
  const el = useRef<HTMLDivElement>(null);
  const html = useMemo(
    () => bytemd.processMarkdown({ value, markdownOptions, plugins }),
    [value, markdownOptions, plugins]
  );

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
