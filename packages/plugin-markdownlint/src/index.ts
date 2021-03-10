import type { BytemdPlugin } from 'bytemd';
import type * as M from 'markdownlint';

export type BytemdPluginMarkdownlintOptions = Omit<
  M.Options,
  'files' | 'strings'
>;

export default function markdownlint(
  options: BytemdPluginMarkdownlintOptions = {}
): BytemdPlugin {
  let m: typeof M;
  return {
    async lint(value, ctx) {
      if (!m) {
        m = await import('markdownlint');
      }

      const key = 'bytemd';
      const result = await m.promises.markdownlint({
        ...options,
        strings: { [key]: value },
      });
      // console.log(result[key]);

      const errors = result[key].map((e) => {
        const from = ctx.codemirror.Pos(e.lineNumber - 1, 0);
        const to = ctx.codemirror.Pos(e.lineNumber - 1);
        if (e.errorRange) {
          from.ch = e.errorRange[0];
          to.ch = e.errorRange[0] + e.errorRange[1];
        }
        let message = '';
        if (e.errorDetail) {
          message = e.errorDetail + '\n';
        }
        message += e.ruleNames[0];

        return {
          from,
          to,
          message,
          // severity: 'error',
        };
      });
      // console.log(errors);
      return errors;
    },
  };
}
