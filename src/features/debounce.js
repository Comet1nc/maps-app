import { updateCanvasStyles } from "./map-image-generator.js";

function debounce(func, msDelay) {
  let timeoutId;

  return function () {
    const context = this;
    const args = arguments;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, msDelay);
  };
}

export const debouncedRefresh = debounce(updateCanvasStyles, 100);
