import { Editor } from '../..';
import { render, fireEvent } from '@testing-library/svelte';

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

test('value', async () => {
  const $ = render(Editor, { value: '# title' });
  expect(document.querySelector('.markdown-body')?.innerHTML).toEqual(
    '<h1>title</h1>'
  );

  // preview debounce
  $.component.$set({ value: 'abc' });
  expect(document.querySelector('.markdown-body')?.innerHTML).toEqual(
    '<h1>title</h1>'
  );
  await sleep(400);
  expect(document.querySelector('.markdown-body')?.innerHTML).toEqual(
    '<p>abc</p>'
  );
  $.component.$destroy();
});

describe('mode', () => {
  test('split', () => {
    const $ = render(Editor, { mode: 'split' });
    expect(document.querySelector('.bytemd-editor')).toBeVisible();
    expect(document.querySelector('.bytemd-preview')).toBeVisible();
    $.component.$destroy();
  });

  test('tab', async () => {
    const $ = render(Editor, { mode: 'tab' });
    const write = $.getByText('Write');
    const preview = $.getByText('Preview');

    expect(document.querySelector('.bytemd-editor')).toBeVisible();
    expect(write).toHaveClass('active');
    expect(document.querySelector('.bytemd-preview')).not.toBeVisible();
    expect(preview).not.toHaveClass('active');

    await fireEvent.click(preview);
    expect(document.querySelector('.bytemd-editor')).not.toBeVisible();
    expect(write).not.toHaveClass('active');
    expect(document.querySelector('.bytemd-preview')).toBeVisible();
    expect(preview).toHaveClass('active');

    $.component.$destroy();
  });
});
