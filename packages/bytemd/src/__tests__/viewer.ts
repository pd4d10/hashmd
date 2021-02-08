import { Viewer } from '../..';
import { render, fireEvent, act } from '@testing-library/svelte';

function sleep(ms: number = 0) {
  return new Promise((r) => setTimeout(r, ms));
}
function stripComment(str: string) {
  return str.replace(/<\!--.*?-->/g, '');
}

test('value', async () => {
  const $ = render(Viewer, { value: '# title' });
  expect(
    stripComment($.container.querySelector('.markdown-body')?.innerHTML)
  ).toEqual('<h1>title</h1>');
  $.component.$destroy();
});

test('plugin', async () => {
  const $ = render(Viewer);
  const off = jest.fn();
  const effect = jest.fn(() => off);

  $.component.$set({ plugins: [{ effect }] });
  await sleep();
  expect(effect).toBeCalled();
  expect(effect).toBeCalledTimes(1);
  expect(effect).toBeCalledWith<any>(
    expect.objectContaining({
      // $el: $.container.querySelector('.markdown-body'),
      result: expect.objectContaining({
        contents: '',
        data: {},
      }),
    })
  );

  $.component.$set({ plugins: [{ effect }] });
  await sleep();
  expect(off).toBeCalled();
  expect(off).toBeCalledTimes(1);
});
