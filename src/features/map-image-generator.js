import { cities } from "./map.js";

const container = document.querySelector(".map-img-generator-container");
const getRouteImgBtn = document.querySelector(".btn-get-route-img");

let canvas;

container.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-close")) {
    container.innerHTML = "";
    getRouteImgBtn.disabled = false;
  } else if (e.target.classList.contains("download-img")) {
    downloadImg();
  }
});

getRouteImgBtn.addEventListener("click", () => {
  getRouteImgBtn.disabled = true;
  openTab();
});

function openTab() {
  createCanvas();

  const { overlay, wrapper, btnClose, btnDownload } = createElements();

  wrapper.append(btnClose, canvas, btnDownload);
  overlay.append(wrapper);
  container.append(overlay);

  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  setWhiteBackground(ctx);

  adjustScale(ctx);

  drawPath(ctx);
}

function createCanvas() {
  const newCanvas = document.createElement("canvas");
  newCanvas.classList.add("path-canvas");
  newCanvas.width = "1000";
  newCanvas.height = "600";
  canvas = newCanvas;
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

  return { overlay, wrapper, btnClose, btnDownload };
}

function setWhiteBackground(ctx) {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPath(ctx) {
  if (cities.length < 2) return;

  cities.forEach((city, index) => {
    drawCityPoint(ctx, city);

    const { posX, posY } = calculateTextPosition(city, index);
    drawText(ctx, city.name, posX, posY);
  });

  drawLineBetweenCities(ctx);
}

function drawCityPoint(ctx, city) {
  ctx.beginPath();
  ctx.arc(
    city.location.longitude,
    city.location.latitude * -1,
    0.3,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}

function drawLineBetweenCities(ctx) {
  ctx.beginPath();
  ctx.moveTo(cities[0].location.longitude, cities[0].location.latitude * -1);
  cities.forEach((city) => {
    ctx.lineTo(city.location.longitude, city.location.latitude * -1);
  });
  ctx.strokeStyle = "black";
  ctx.lineWidth = 0.05;
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

function adjustScale(ctx) {
  ctx.save();

  const { minX, minY, maxX, maxY } = calculateBoundingBox(cities);

  // Calculate scaling factors
  const scaleX = canvas.width / (maxX - minX);
  const scaleY = canvas.height / (maxY - minY);
  const scale = Math.min(scaleX, scaleY);

  // Calculate translation factors
  const offsetX = -minX * scale;
  const offsetY = -minY * scale;

  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);
}

function calculateBoundingBox(cities) {
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

  let padding = 2.8;
  minX -= padding;
  minY -= padding;
  maxX += padding;
  maxY += padding;

  return { minX, minY, maxX, maxY };
}

function downloadImg(fileType = ".png") {
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
