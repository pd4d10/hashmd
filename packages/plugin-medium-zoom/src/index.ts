import type { BytemdPlugin } from 'bytemd'
import type * as M from 'medium-zoom'

export default function mediumZoom(options?: M.ZoomOptions): BytemdPlugin {
  let m: typeof M

  return {
    viewerEffect({ markdownBody }) {
      const imgs = [...markdownBody.querySelectorAll('img')].filter((e) => {
        return !e.closest('a')
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
