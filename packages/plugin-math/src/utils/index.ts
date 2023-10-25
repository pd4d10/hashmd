import { icons } from "./icons";
import { wrapText, appendBlock, ToolbarItem } from "hashmd";

export type MathLocale = {
  inline: string;
  inlineText: string;
  block: string;
  blockText: string;
};

export function getToolbarItems(locale: MathLocale): ToolbarItem[] {
  return [
    {
      type: "multiple",
      icon: icons.formula,
      title: "Math",
      actions: [
        {
          title: locale.inline,
          cheatsheet: `$${locale.inlineText}$`,
          click({ detail: { editor } }) {
            wrapText(editor, "$");
          },
        },
        {
          title: locale.block,
          cheatsheet: `$$↵${locale.blockText}↵$$`,
          click({ detail: { editor } }) {
            appendBlock(editor, "\\TeX", {
              prefix: "$$\n",
              suffix: "\n$$",
            });
          },
        },
      ],
    },
  ];
}
