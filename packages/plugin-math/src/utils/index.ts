import { icons } from "./icons";
import { wrapText, type HashmdAction, appendBlock } from "hashmd";

export type MathLocale = {
  inline: string;
  inlineText: string;
  block: string;
  blockText: string;
};

export function getMathActions(locale: MathLocale): HashmdAction[] {
  return [
    {
      icon: icons.formula,
      title: "Math",
      handler: {
        type: "dropdown",
        actions: [
          {
            title: locale.inline,
            icon: icons.inline,
            cheatsheet: `$${locale.inlineText}$`,
            handler: {
              type: "action",
              click({ editor }) {
                wrapText(editor, "$");
              },
            },
          },
          {
            title: locale.block,
            icon: icons.block,
            cheatsheet: `$$↵${locale.blockText}↵$$`,
            handler: {
              type: "action",
              click({ editor }) {
                appendBlock(editor, "\\TeX", {
                  prefix: "$$\n",
                  suffix: "\n$$",
                });
              },
            },
          },
        ],
      },
    },
  ];
}
