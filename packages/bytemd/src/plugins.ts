import type { BytemdPlugin } from './types';
import type { Root, Element } from 'hast';
import { throttle } from 'lodash-es';

function findStartIndex(num: number, nums: number[]) {
  let startIndex = nums.length - 2;
  for (let i = 0; i < nums.length; i++) {
    if (num < nums[i]) {
      startIndex = i - 1;
      break;
    }
  }
  startIndex = Math.max(startIndex, 0); // ensure >= 0
  return startIndex;
}

export function scrollSync(): BytemdPlugin {
  let hast: Root;
  let editCalled = false;
  let previewCalled = false;
  let editPs: number[];
  let previewPs: number[];

  return {
    editorEffect({ editor, $el }) {
      const previewEl = $el.querySelector<HTMLElement>('.bytemd-preview');
      if (!previewEl) return;

      const updateBlockPositions = throttle(() => {
        editPs = [];
        previewPs = [];

        const scrollInfo = editor.getScrollInfo();
        const body = previewEl.querySelector<HTMLElement>('.markdown-body')!;

        const leftNodes = hast.children.filter(
          (v) => v.type === 'element'
        ) as Element[];
        const rightNodes = [...body.childNodes].filter(
          (v) => v instanceof HTMLElement
        ) as HTMLElement[];

        for (let i = 0; i < leftNodes.length; i++) {
          const leftNode = leftNodes[i];
          const rightNode = rightNodes[i];

          // if there is no position info, move to the next node
          if (!leftNode.position) {
            continue;
          }

          const left =
            editor.heightAtLine(leftNode.position.start.line - 1, 'local') /
            (scrollInfo.height - scrollInfo.clientHeight);
          const right =
            (rightNode.offsetTop - body.offsetTop) /
            (previewEl.scrollHeight - previewEl.clientHeight);

          if (left >= 1 || right >= 1) {
            break;
          }

          editPs.push(left);
          previewPs.push(right);
        }

        editPs.push(1);
        previewPs.push(1);
        // console.log(editorPs, viewerPs);
      }, 1000);

      const editorScrollHandler = () => {
        if (previewCalled) {
          previewCalled = false;
          return;
        }

        requestAnimationFrame(() => {
          updateBlockPositions();

          const info = editor.getScrollInfo();
          const leftRatio = info.top / (info.height - info.clientHeight);

          const startIndex = findStartIndex(leftRatio, editPs);

          const rightRatio =
            ((leftRatio - editPs[startIndex]) *
              (previewPs[startIndex + 1] - previewPs[startIndex])) /
              (editPs[startIndex + 1] - editPs[startIndex]) +
            previewPs[startIndex];
          // const rightRatio = rightPs[startIndex]; // for testing

          previewEl.scrollTo(
            0,
            rightRatio * (previewEl.scrollHeight - previewEl.clientHeight)
          );
          editCalled = true;
        });
      };

      const previewScrollHandler = () => {
        if (editCalled) {
          editCalled = false;
          return;
        }

        requestAnimationFrame(() => {
          updateBlockPositions();

          const rightRatio =
            previewEl.scrollTop /
            (previewEl.scrollHeight - previewEl.clientHeight);

          const startIndex = findStartIndex(rightRatio, previewPs);

          const leftRatio =
            ((rightRatio - previewPs[startIndex]) *
              (editPs[startIndex + 1] - editPs[startIndex])) /
              (previewPs[startIndex + 1] - previewPs[startIndex]) +
            editPs[startIndex];

          const info = editor.getScrollInfo();
          editor.scrollTo(0, leftRatio * (info.height - info.clientHeight));
          previewCalled = true;
        });
      };

      editor.on('scroll', editorScrollHandler);
      previewEl.addEventListener('scroll', previewScrollHandler, {
        passive: true,
      });
      return () => {
        editor.off('scroll', editorScrollHandler);
        previewEl.removeEventListener('scroll', previewScrollHandler);
      };
    },
    viewerEffect(ctx) {
      hast = ctx.hast;
    },
  };
}
