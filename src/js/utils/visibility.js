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

const timeout = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const replaceScreen = async (prev, curr) => {
  const previous =
    typeof prev === "string" ? document.querySelector(prev) : prev;
  const current =
    typeof curr === "string" ? document.querySelector(curr) : curr;

  previous.classList.add("bounce");

  await timeout(300);
  hide(previous);
  show(current);

  previous.classList.remove("bounce");
  current.classList.add("slide-up");

  await timeout(300);
  current.classList.remove("slide-up");
};

export { show, hide, replaceScreen };
