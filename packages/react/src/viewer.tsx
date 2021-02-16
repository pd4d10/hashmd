import React, { useMemo, useEffect, useRef, FC } from 'react';
import * as bytemd from 'bytemd';

export interface ViewerProps extends bytemd.ViewerProps {}

export const Viewer: FC<ViewerProps> = ({ value, sanitize, plugins }) => {
  const elRef = useRef<HTMLDivElement>(null);
  const file = useMemo(() => {
    try {
      return bytemd.getProcessor({ sanitize, plugins }).processSync(value);
    } catch (err) {
      console.error(err);
    }
  }, [value, sanitize, plugins]);

  useEffect(() => {
    const markdownBody = elRef.current;
    if (!markdownBody || !file) return;

    const cbs = plugins?.map(({ viewerEffect }) =>
      viewerEffect?.({ markdownBody, file })
    );
    return () => {
      cbs?.forEach((cb) => cb && cb());
    };
  }, [file, plugins]);

  return (
    <div
      onClick={(e) => {
        const $ = e.target as HTMLElement;
        if ($.tagName !== 'A') return;

        const href = $.getAttribute('href');
        if (!href?.startsWith('#')) return;

        elRef.current
          ?.querySelector('#user-content-' + href.slice(1))
          ?.scrollIntoView();
      }}
      ref={elRef}
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: file?.toString() ?? '' }}
    ></div>
  );
};
