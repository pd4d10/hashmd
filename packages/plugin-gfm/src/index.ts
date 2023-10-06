import { icons } from "./icons";
import en from "./locales/en.json";
import { appendBlock, replaceLines, type HashmdPlugin, wrapText } from "hashmd";
import remarkGfm, { Options } from "remark-gfm";

type Locale = {
  strike: string;
  strikeText: string;
  task: string;
  taskText: string;
  table: string;
  tableHeading: string;
};

export interface HashmdPluginGfmOptions extends Options {
  locale?: Partial<Locale>;
}

export default function gfm({
  locale: _locale,
  ...remarkGfmOptions
}: HashmdPluginGfmOptions = {}): HashmdPlugin {
  const locale = { ...en, ..._locale } as Locale;

  return {
    remark: (processor) => processor.use(remarkGfm, remarkGfmOptions),
    toolbar: [
      {
        type: "single",
        title: locale.strike,
        icon: icons.strike,
        cheatsheet: `~~${locale.strikeText}~~`,
        click({ editor }) {
          wrapText(editor, "~~");
        },
      },
      {
        type: "single",
        title: locale.task,
        icon: icons.task,
        cheatsheet: `- [ ] ${locale.taskText}`,
        click({ editor }) {
          replaceLines(editor, (line) => "- [ ] " + line);
        },
      },
      {
        type: "single",
        title: locale.table,
        icon: icons.table,
        click({ editor }) {
          appendBlock(editor, locale.tableHeading, {
            prefix: "| ",
            suffix: ` |  |
| --- | --- |
|  |  |`,
          });
        },
      },
    ],
  };
}
