export const santitizeHref = href => {
  if (
    href &&
    href
      .trim()
      .toLowerCase()
      .startsWith('javascript')
  ) {
    return;
  } else {
    return href;
  }
};
