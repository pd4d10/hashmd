import { Node } from 'unist';
import { BytemdPlugin } from 'bytemd';
import { SvelteComponent } from 'svelte';

export interface HastNode extends Node {
  tagName: string;
  properties: {
    className?: string[];
    [key: string]: unknown;
  };
  children: HastNode[];
}

export interface CodeBlockPluginOptions<P> {
  languages: string[];
  component: SvelteComponent;
  getProps?: (meta: ReturnType<typeof getCodeBlockMeta>) => P;
}

export function createCodeBlockPlugin<P>({
  languages,
  component,
  getProps,
}: CodeBlockPluginOptions<P>): BytemdPlugin {
  return {
    renderNode(node) {
      const meta = getCodeBlockMeta(node);
      if (meta && meta.language && languages.includes(meta.language)) {
        return {
          component,
          props: getProps ? getProps(meta) : meta,
        };
      }
    },
  };
}

export function getCodeBlockMeta(
  node: HastNode
): { language?: string; value: string } | undefined {
  if (node.tagName !== 'pre') return;

  const codeNode = node.children[0];
  if (!codeNode || codeNode.tagName !== 'code') return;

  const textNode = codeNode.children[0];
  if (!textNode || textNode.type !== 'text') return;

  return {
    language:
      codeNode.properties.className &&
      codeNode.properties.className[0].split('-')[1],
    value: textNode.value as string,
  };
}
