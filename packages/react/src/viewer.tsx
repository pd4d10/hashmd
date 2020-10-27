import React, { useMemo, useEffect, useRef, FC } from 'react';
import * as bytemd from 'bytemd';

export interface ViewerProps extends bytemd.ViewerProps {}

export const Viewer: FC<ViewerProps> = ({ value, sanitize, plugins }) => {
  const elRef = useRef<HTMLDivElement>(null);
  const result = useMemo(() => {
    try {
      return bytemd.getProcessor({ sanitize, plugins }).processSync(value);
    } catch (err) {
      console.error(err);
    }
  }, [value, sanitize, plugins]);

  useEffect(() => {
    const $el = elRef.current;
    if (!$el || !result) return;

    const cbs = plugins?.map(
      ({ viewerEffect }) => viewerEffect && viewerEffect({ $el, result })
    );
    return () => {
      cbs?.forEach((cb) => cb && cb());
    };
  }, [result, plugins]);

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
      dangerouslySetInnerHTML={{ __html: result?.toString() ?? '' }}
    ></div>
  );
};
