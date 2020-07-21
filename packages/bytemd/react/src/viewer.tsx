import React, { useMemo, useEffect, useRef, FC } from 'react';
import * as bytemd from 'bytemd';

export interface ViewerProps extends bytemd.ViewerProps {}

export const Viewer: FC<ViewerProps> = ({ value, sanitize, plugins }) => {
  const el = useRef<HTMLDivElement>(null);
  const html = useMemo(
    () => bytemd.processMarkdown({ value, sanitize, plugins }),
    [value, sanitize, plugins]
  );

  useEffect(() => {
    const $ = el.current;
    if (!$) return;

    const cbs = plugins?.map(
      ({ viewerEffect }) => viewerEffect && viewerEffect($)
    );
    return () => {
      cbs?.forEach((cb) => cb && cb());
    };
  }, [html, plugins]);

  return (
    <div
      ref={el}
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
};
