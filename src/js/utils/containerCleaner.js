export default function cleanContainer(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}
