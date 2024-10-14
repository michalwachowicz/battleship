const show = (el) => {
  const element = typeof el === "string" ? document.querySelector(el) : el;
  if (element && element instanceof HTMLElement)
    element.classList.remove("hidden");
};

const hide = (el) => {
  const element = typeof el === "string" ? document.querySelector(el) : el;
  if (element && element instanceof HTMLElement)
    element.classList.add("hidden");
};

const replaceScreen = (previous, current) => {
  hide(previous);
  show(current);
};

export { show, hide, replaceScreen };
