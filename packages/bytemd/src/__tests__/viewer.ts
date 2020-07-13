import { Viewer } from '../..';
import { render, fireEvent, act } from '@testing-library/svelte';

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
  await act();
  expect(viewerEffect).toBeCalled();
  expect(viewerEffect).toBeCalledTimes(1);
  expect(viewerEffect).toBeCalledWith(
    $.container.querySelector('.markdown-body')
  );

  $.component.$set({ plugins: [{ viewerEffect }] });
  await act();
  expect(off).toBeCalled();
  expect(off).toBeCalledTimes(1);
});
