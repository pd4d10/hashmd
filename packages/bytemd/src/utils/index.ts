export { getParser } from './common';
export { initEditor, dataUrlFileHandler } from './editor';
export { findPlugin, santitizeHref } from './element';
export {
  handleDec,
  handleTag,
  handleBlockquote,
  handleLink,
  handleImage,
  handleTable,
  handleHeading,
  handleOl,
  handleUl,
  handleTask,
  covertToHtml,
} from './toolbar';

import heading from 'icons/heading-16.svg';
import bold from 'icons/bold-16.svg';
import italic from 'icons/italic-16.svg';
import quote from 'icons/quote-16.svg';
import image from 'icons/image-16.svg';
import server from 'icons/server-16.svg';
import link from 'icons/link-16.svg';
import iconOl from 'icons/list-ordered-16.svg';
import iconUl from 'icons/list-unordered-16.svg';
import task from 'icons/tasklist-16.svg';
import html from 'icons/code-review-16.svg';
export {
  heading,
  bold,
  italic,
  quote,
  image,
  server,
  link,
  iconOl,
  iconUl,
  task,
  html,
};
