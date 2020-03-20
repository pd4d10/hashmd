export const santitizeHref = (href?: string) => {
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
