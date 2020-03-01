export const getActualDom = (el: string | Element): Element => {
  const $ = typeof el === 'string' ? document.querySelector(el) : el;
  if (!$) throw new Error('');
  return $;
};
