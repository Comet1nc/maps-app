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

  const ctx = canvas.getContext("2d");

  adjustScale(ctx);

  drawPath(ctx);
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

function createCanvas() {
  const newCanvas = document.createElement("canvas");
  newCanvas.classList.add("path-canvas");
  newCanvas.width = "500";
  newCanvas.height = "300";
  canvas = newCanvas;
}

function drawPath(ctx) {
  if (cities.length < 2) return;

  cities.forEach((city, index) => {
    ctx.beginPath();
    ctx.arc(
      city.location.longitude,
      city.location.latitude,
      0.3,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();

    let posX;
    let posY;

    if (index > 0) {
      const prevCity = cities[index - 1];

      const angle = Math.atan2(
        city.location.latitude - prevCity.location.latitude,
        city.location.longitude - prevCity.location.longitude
      );

      const scaleX = 0.4;
      const scaleY = 0.9;

      posX = city.location.longitude + Math.cos(angle) * scaleX;
      posY = city.location.latitude + Math.sin(angle) * scaleY;
    } else {
      posX = city.location.longitude * 0.95;
      posY = city.location.latitude * 0.99;
    }

    ctx.font = "0.6px serif";
    ctx.fillStyle = "black";
    ctx.fillText(city.name, posX, posY);
  });

  ctx.beginPath();
  ctx.moveTo(cities[0].location.longitude, cities[0].location.latitude);
  cities.forEach((city) => {
    ctx.lineTo(city.location.longitude, city.location.latitude);
  });
  ctx.strokeStyle = "black";
  ctx.lineWidth = 0.05;
  ctx.setLineDash([0.2, 0.2]);
  ctx.lineDashOffset = 0;

  ctx.stroke();
  ctx.closePath();
  // ctx.save();
}

function calculateBoundingBox(cities) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const city of cities) {
    minX = Math.min(minX, city.location.longitude);
    minY = Math.min(minY, city.location.latitude);
    maxX = Math.max(maxX, city.location.longitude);
    maxY = Math.max(maxY, city.location.latitude);
  }

  let gap = 2.8;
  minX -= gap;
  minY -= gap;
  maxX += gap;
  maxY += gap;

  return { minX, minY, maxX, maxY };
}

function adjustScale(ctx) {
  ctx.save(); // Save the current state of the context

  // Calculate the bounding box
  const { minX, minY, maxX, maxY } = calculateBoundingBox(cities);

  // Calculate scaling factors
  const scaleX = canvas.width / (maxX - minX);
  const scaleY = canvas.height / (maxY - minY);
  const scale = Math.min(scaleX, scaleY);

  // Calculate translation factors
  const offsetX = -minX * scale;
  const offsetY = -minY * scale;

  // Apply scaling and translation
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);
}

function downloadImg() {
  const dataURL = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = "cities_map.png";
  a.click();
}
