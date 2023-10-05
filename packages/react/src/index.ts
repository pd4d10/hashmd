import { createComponent } from "@lit-labs/react";
import * as hashmd from "hashmd";
import React from "react";

export const Editor = createComponent({
  tagName: "hashmd-editor",
  elementClass: hashmd.Editor,
  react: React,
  events: {
    onChange: "change",
  },
});

export const Viewer = createComponent({
  tagName: "hashmd-viewer",
  elementClass: hashmd.Viewer,
  react: React,
  events: {
    onMeta: "meta",
  },
});
