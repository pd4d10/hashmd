// https://github.com/jsdom/jsdom/issues/3002#issuecomment-655752934
document.createRange = () => {
  const range = new Range()

  range.getBoundingClientRect = jest.fn()

  range.getClientRects = () => {
    return {
      item: () => null,
      length: 0,
      [Symbol.iterator]: jest.fn(),
    }
  }

  return range
}

// https://github.com/facebook/jest/issues/9983#issuecomment-626489847
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder
}

// https://stackoverflow.com/a/65095454
;(global as any).ResizeObserver = class ResizeObserver {
  observe() {
    // do nothing
  }
  unobserve() {
    // do nothing
  }
}
