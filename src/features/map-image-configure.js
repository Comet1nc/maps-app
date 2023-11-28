import { cities } from "./map.js";
import { adjustScale, createCanvas, drawPath, setWhiteBackground } from "./map-image-generator.js";

export let mapOptions = {
  size: "medium",
  lineWidth: 0.05,
  lineColor: "black",
  pointColor: "black",
  pointBorder: "black",
  pointBorderWidth: 0,
};

export function downloadImg(fileType = ".png") {
  console.log(mapOptions);
  const canvas = createUpdatedMapCanvas(mapOptions);
  const dataURL = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataURL;

  let fileName = "Mapa-";
  cities.forEach((city) => {
    fileName = fileName + city.name + "_";
  });
  a.download = fileName + fileType;
  a.click();
}

export function createUpdatedMapCanvas(opt) {
  const canvas = createCanvas();

  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  setWhiteBackground(ctx);

  const size = getScale();

  adjustScale(ctx, size.scale, size.padding);

  drawPath(ctx, mapOptions);

  return canvas;
}

function getScale() {
  if (mapOptions.size === "small") {
    return { scale: 1.1, padding: 2 };
  } else if (mapOptions.size === "medium") {
    return { scale: 1, padding: 2.8 };
  } else if (mapOptions.size === "large") {
    return { scale: 0.7, padding: 4 };
  }
}
