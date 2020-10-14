import { Viewer } from '../..';
import { render, fireEvent, act } from '@testing-library/svelte';

function sleep(ms: number = 0) {
  return new Promise((r) => setTimeout(r, ms));
}

test('value', async () => {
  const $ = render(Viewer, { value: '# title' });
  expect($.container.querySelector('.markdown-body')?.innerHTML).toEqual(
    '<h1>title</h1>'
  );
  $.component.$destroy();
});

test('plugin', async () => {
  const $ = render(Viewer);
  const off = jest.fn();
  const viewerEffect = jest.fn(() => off);

  $.component.$set({ plugins: [{ viewerEffect }] });
  await sleep();
  expect(viewerEffect).toBeCalled();
  expect(viewerEffect).toBeCalledTimes(1);
  expect(viewerEffect).toBeCalledWith(
    $.container.querySelector('.markdown-body'),
    expect.objectContaining({
      contents: '',
      data: {},
    })
  );

  $.component.$set({ plugins: [{ viewerEffect }] });
  await sleep();
  expect(off).toBeCalled();
  expect(off).toBeCalledTimes(1);
});
