import { Viewer } from '../..';
import { render, fireEvent } from '@testing-library/svelte';

test('value', async () => {
  const $ = render(Viewer, { value: '# title' });
  expect(document.querySelector('.markdown-body')?.innerHTML).toEqual(
    '<h1>title</h1>'
  );
  $.component.$destroy();
});
