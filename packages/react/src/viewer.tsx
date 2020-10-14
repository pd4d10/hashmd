import React, { useMemo, useEffect, useRef, FC } from 'react';
import * as bytemd from 'bytemd';

export interface ViewerProps extends bytemd.ViewerProps {}

export const Viewer: FC<ViewerProps> = ({ value, sanitize, plugins }) => {
  const elRef = useRef<HTMLDivElement>(null);
  const result = useMemo(
    () => bytemd.processMarkdown({ value, sanitize, plugins }),
    [value, sanitize, plugins]
  );

  useEffect(() => {
    const $el = elRef.current;
    if (!$el) return;

    const cbs = plugins?.map(
      ({ viewerEffect }) => viewerEffect && viewerEffect({ $el, result })
    );
    return () => {
      cbs?.forEach((cb) => cb && cb());
    };
  }, [result, plugins]);

  return (
    <div
      ref={elRef}
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: result.toString() }}
    ></div>
  );
};
