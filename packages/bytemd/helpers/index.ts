import { Node } from 'unist';

export interface HastNode extends Node {
  tagName: string;
  properties: {
    className?: string[];
    [key: string]: unknown;
  };
  children: HastNode[];
}

export function getCodeBlockMeta(
  node: HastNode,
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
