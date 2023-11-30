import { alert } from "./alerts.js";
import { debouncedRefresh } from "./debounce.js";
import { createUpdatedMapCanvas, downloadImg, mapOptions } from "./map-image-configure.js";
import { cities } from "./map.js";

const container = document.querySelector(".map-img-generator-container");
const getRouteImgBtn = document.querySelector(".btn-get-route-img");

export let canvas;

container.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-close")) {
    container.innerHTML = "";
    getRouteImgBtn.disabled = false;
  } else if (e.target.classList.contains("download-img")) {
    downloadImg();
  }
});

getRouteImgBtn.addEventListener("click", () => {
  if (cities.length < 2) {
    alert("You need at least 2 points to save route", 5000);
    return;
  }
  getRouteImgBtn.disabled = true;
  openTab();
});

function openTab() {
  canvas = createCanvas();

  const el = createElements();

  appendElements(el);

  const context = canvas.getContext("2d", { willReadFrequently: true });

  setWhiteBackground(context);

  adjustScale(context);

  drawPath(context);
}

function appendElements({ overlay, wrapper, btnClose, btnDownload, configEl }) {
  let canvasContainer = document.createElement("div");
  canvasContainer.append(canvas);
  canvasContainer.classList.add("canvas-container");
  wrapper.append(btnClose, canvasContainer, configEl, btnDownload);
  overlay.append(wrapper);
  container.append(overlay);
}

export function createCanvas() {
  const newCanvas = document.createElement("canvas");
  newCanvas.classList.add("path-canvas");
  newCanvas.width = "800";
  newCanvas.height = "400";
  return newCanvas;
}

function createElements() {
  let overlay = document.createElement("div");
  overlay.classList.add("map-img-generator__overlay");

  let wrapper = document.createElement("div");
  wrapper.classList.add("map-img-generator__wrapper");

  let btnClose = document.createElement("button");
  btnClose.classList.add("btn-close");
  btnClose.textContent = "X";

  let btnDownload = document.createElement("button");
  btnDownload.classList.add("download-img");
  btnDownload.textContent = "Download";

  let configEl = createStylesConfigElements();

  return { overlay, wrapper, btnClose, btnDownload, configEl };
}

export function updateCanvasStyles() {
  canvas.remove();
  const newCanvas = createUpdatedMapCanvas(mapOptions);
  canvas = newCanvas;
  document.querySelector(".canvas-container").append(canvas);
}

function createStylesConfigElements() {
  const sizeConfigElements = createSizeConfigElements();
  const lineConfigElements = createLineConfigElements();
  const pointsConfigElements = createPointsConfigElements();

  let container = document.createElement("div");
  container.addEventListener("input", (e) => {
    debouncedRefresh();
  });
  container.classList.add("img-styles-configuration");
  container.append(sizeConfigElements, lineConfigElements, pointsConfigElements);

  return container;
}

function createPointsConfigElements() {
  let pointColorTitle = document.createElement("p");
  pointColorTitle.textContent = "kolor punktów -";
  let pointColor = document.createElement("input");
  pointColor.type = "color";
  pointColor.classList.add("point-color");

  let pointBorderColorTitle = document.createElement("p");
  pointBorderColorTitle.textContent = "kolor obramowania -";
  let pointBorderColor = document.createElement("input");
  pointBorderColor.type = "color";
  pointBorderColor.classList.add("point-border-color");

  let pointBorderWidthTitle = document.createElement("p");
  pointBorderWidthTitle.textContent = "szerokość obramowania -";
  let pointBorderWidth = document.createElement("input");
  pointBorderWidth.type = "range";
  pointBorderWidth.step = 0.01;
  pointBorderWidth.value = 0.35;
  pointBorderWidth.min = 0.3;
  pointBorderWidth.max = 0.6;

  let container = document.createElement("div");
  container.innerText = "Styl punktów: ";
  container.classList.add("styles-config-container", "point-styles-container");
  container.addEventListener("input", (e) => {
    if (e.target.type === "color") {
      if (e.target.classList.contains("point-color")) {
        mapOptions.pointColor = e.target.value;
      } else if (e.target.classList.contains("point-border-color")) {
        mapOptions.pointBorder = e.target.value;
      }
    } else if (e.target.type === "range") {
      mapOptions.pointBorderWidth = e.target.value;
    }
  });
  container.append(
    pointColorTitle,
    pointColor,
    pointBorderColorTitle,
    pointBorderColor,
    pointBorderWidthTitle,
    pointBorderWidth
  );
  return container;
}

function createLineConfigElements() {
  let lineWidthTitle = document.createElement("p");
  lineWidthTitle.textContent = "szerokość -";
  let lineWidth = document.createElement("input");
  lineWidth.type = "range";
  lineWidth.step = 0.01;
  lineWidth.value = 0.05;
  lineWidth.min = 0.03;
  lineWidth.max = 0.15;

  let lineColorTitle = document.createElement("p");
  lineColorTitle.textContent = "kolor linii -";
  let lineColor = document.createElement("input");
  lineColor.type = "color";

  let lineStylesContainer = document.createElement("div");
  lineStylesContainer.classList.add("styles-config-container", "line-styles-container");
  lineStylesContainer.innerText = "Styl linii: ";
  lineStylesContainer.addEventListener("input", (e) => {
    if (e.target.type === "range") {
      mapOptions.lineWidth = e.target.value;
    } else if (e.target.type === "color") {
      mapOptions.lineColor = e.target.value;
    }
  });

  lineStylesContainer.append(lineWidthTitle, lineWidth, lineColorTitle, lineColor);

  return lineStylesContainer;
}

function createSizeConfigElements() {
  let small = document.createElement("input");
  small.type = "radio";
  small.name = "size";
  small.setAttribute("img-size", "small");
  let medium = document.createElement("input");
  medium.type = "radio";
  medium.name = "size";
  medium.setAttribute("img-size", "medium");
  medium.checked = true;
  let large = document.createElement("input");
  large.type = "radio";
  large.name = "size";
  large.setAttribute("img-size", "large");

  let textSmall = document.createElement("p");
  textSmall.textContent = "Small";
  let textMedium = document.createElement("p");
  textMedium.textContent = "Medium";
  let textLarge = document.createElement("p");
  textLarge.textContent = "Large";

  let sizeInputContainer = document.createElement("div");
  sizeInputContainer.addEventListener("input", (e) => {
    const item = e.target.closest("[img-size]");
    const imgSize = item.getAttribute("img-size");
    console.log(imgSize);
    mapOptions.size = imgSize;
  });
  sizeInputContainer.classList.add("styles-config-container", "size-input-container");
  sizeInputContainer.innerText = "Rozmiar obrazu: ";
  sizeInputContainer.append(textSmall, small, textMedium, medium, textLarge, large);

  return sizeInputContainer;
}

export function setWhiteBackground(ctx) {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function drawPath(
  ctx,
  pathOptions = {
    lineWidth: 0.05,
    lineColor: "black",
    pointColor: "black",
    pointBorder: "black",
    pointBorderWidth: 0,
  }
) {
  if (cities.length < 2) return;

  cities.forEach((city, index) => {
    drawCityPoint(
      ctx,
      city,
      pathOptions.pointColor,
      pathOptions.pointBorder,
      pathOptions.pointBorderWidth
    );

    const { posX, posY } = calculateTextPosition(city, index);
    drawText(ctx, city.name, posX, posY);
  });

  drawLineBetweenCities(ctx, pathOptions.lineWidth, pathOptions.lineColor);
}

function drawCityPoint(ctx, city, pointColor, borderColor, borderWidth) {
  drawBorder(ctx, city, borderColor, borderWidth);

  ctx.beginPath();
  ctx.arc(city.location.longitude, city.location.latitude * -1, 0.3, 0, 2 * Math.PI);
  ctx.fillStyle = pointColor;
  ctx.fill();
  ctx.closePath();
}

function drawBorder(ctx, city, borderColor = "red", borderWidth = 0.35) {
  ctx.beginPath();
  ctx.arc(city.location.longitude, city.location.latitude * -1, borderWidth, 0, 2 * Math.PI);
  ctx.fillStyle = borderColor;
  ctx.fill();
  ctx.closePath();
}

function drawLineBetweenCities(ctx, lineWidth, lineColor) {
  ctx.beginPath();
  ctx.moveTo(cities[0].location.longitude, cities[0].location.latitude * -1);
  cities.forEach((city) => {
    ctx.lineTo(city.location.longitude, city.location.latitude * -1);
  });
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash([0.2, 0.2]);
  ctx.lineDashOffset = 0;

  ctx.stroke();
  ctx.closePath();
}

function drawText(ctx, text, posX, posY) {
  ctx.font = "0.6px serif";
  ctx.fillStyle = "black";
  ctx.fillText(text, posX, posY);
}

function calculateTextPosition(
  city,
  index,
  scaleXfirstCity = 0.95,
  scaleYfirstCity = 0.98,
  scaleX = 0.4,
  scaleY = 0.9
) {
  let posX, posY;
  if (index > 0) {
    const prevCity = cities[index - 1];

    const angle = Math.atan2(
      city.location.latitude * -1 - prevCity.location.latitude * -1,
      city.location.longitude - prevCity.location.longitude
    );

    posX = city.location.longitude + Math.cos(angle) * scaleX;
    posY = city.location.latitude * -1 + Math.sin(angle) * scaleY;
  } else {
    posX = city.location.longitude * scaleXfirstCity;
    posY = city.location.latitude * -1 * scaleYfirstCity;
  }
  return { posX, posY };
}

export function adjustScale(ctx, addScale = 1, padding = 2.8) {
  ctx.save();

  const { minX, minY, maxX, maxY } = calculateBoundingBox(cities, padding);

  // Calculate scaling factors
  const scaleX = ctx.canvas.width / (maxX - minX);
  const scaleY = ctx.canvas.height / (maxY - minY);
  const scale = Math.min(scaleX, scaleY) * addScale;

  // Calculate translation factors
  const offsetX = -minX * scale;
  const offsetY = -minY * scale;

  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);
}

function calculateBoundingBox(cities, padding) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const city of cities) {
    minX = Math.min(minX, city.location.longitude);
    minY = Math.min(minY, city.location.latitude * -1);
    maxX = Math.max(maxX, city.location.longitude);
    maxY = Math.max(maxY, city.location.latitude * -1);
  }

  minX -= padding;
  minY -= padding;
  maxX += padding;
  maxY += padding;

  return { minX, minY, maxX, maxY };
}
