import type { BytemdPlugin } from 'bytemd'
import type * as M from 'medium-zoom'

export interface BytemdPluginMediumZoomOptions extends M.ZoomOptions {
  filter?: (img: HTMLDivElement) => void
}

export default function mediumZoom(
  options?: BytemdPluginMediumZoomOptions
): BytemdPlugin {
  let m: typeof M

  return {
    viewerEffect({ markdownBody }) {
      const imgs = [...markdownBody.querySelectorAll('img')].filter((e) => {
        return (options?.filter?.(e) ?? true) && !e.closest('a')
      })
      if (imgs.length === 0) return
      ;(async () => {
        if (!m) {
          m = await import('medium-zoom')
        }
        m.default(imgs, options)
      })()
    },
  }
}
