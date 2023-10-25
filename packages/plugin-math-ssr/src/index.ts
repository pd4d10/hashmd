import en from "./locales/en.json";
import { MathLocale, getToolbarItems } from "./utils";
import type { Plugin } from "hashmd";
import rehypeKatex, { Options } from "rehype-katex";
import remarkMath from "remark-math";

export interface HashmdPluginMathSsrOptions {
  locale?: Partial<MathLocale>;
  katexOptions?: Omit<Options, "displayMode">;
}

export default function mathSsr({
  locale: _locale,
  katexOptions,
}: HashmdPluginMathSsrOptions = {}): Plugin {
  const locale = { ...en, ..._locale };
  return {
    remark: (processor) => processor.use(remarkMath),
    rehype: (processor) => processor.use<any, any>(rehypeKatex, katexOptions),
    toolbar: getToolbarItems(locale),
  };
}
