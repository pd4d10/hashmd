/// <reference types="vitest/globals" />
import { Viewer } from '../src'
import '@testing-library/jest-dom'
import { render, act } from '@testing-library/svelte'

function stripComment(str: string) {
  return str.replace(/<\!--.*?-->/g, '')
}

test('value', async () => {
  const $ = render(Viewer, { value: '# title' })
  expect(
    stripComment($.container.querySelector('.markdown-body')?.innerHTML)
  ).toEqual('<h1>title</h1>')
  $.component.$destroy()
})

test('plugin', async () => {
  const $ = render(Viewer)
  const off = vi.fn()
  const viewerEffect = vi.fn(() => off)

  $.component.$set({ plugins: [{ viewerEffect }] })
  await act()
  expect(viewerEffect).toBeCalled()
  expect(viewerEffect).toBeCalledTimes(1)

  // FIXME:
  // expect(viewerEffect).toBeCalledWith<any>(
  //   expect.objectContaining({
  //     markdownBody: $.container.querySelector('.markdown-body'),
  //     file: expect.objectContaining({
  //       contents: '',
  //       data: {},
  //     }),
  //   })
  // )

  $.component.$set({ plugins: [{ viewerEffect }] })
  await act()
  expect(off).toBeCalled()
  expect(off).toBeCalledTimes(1)
})
