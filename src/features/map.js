import { directionsManager, map } from "../main.js";

export let cities = [];

export const selectedCities = document.querySelector(".selected-cities");

export function selectCity(city) {
  cities.push(city);

  renderListWithNewCity(city);

  calculatePath();

  togglePushpinForSingleCity();

  renderMap();
}

function calculatePath() {
  if (cities.length < 2) return;
  cities.sort((cityA, cityB) => {
    let diff = cityA.location.latitude - cityB.location.latitude;
    let diff2 = cityA.location.longitude - cityB.location.longitude;

    return diff + diff2;
  });
}

export function renderMap() {
  directionsManager.clearAll();
  for (let city of cities) {
    let point = new Microsoft.Maps.Directions.Waypoint({
      address: city.name,
      location: city.location,
    });
    directionsManager.addWaypoint(point);
  }

  directionsManager.calculateDirections();
}

function addPushpin() {
  var pin = new Microsoft.Maps.Pushpin(cities[0].location, {
    title: cities[0].name,
  });
  map.entities.push(pin);
}

function removeCityFromMap(i) {
  directionsManager.removeWaypoint(i);
  directionsManager.calculateDirections();
  map.entities.removeAt(0);
}

function togglePushpinForSingleCity() {
  if (cities.length === 1) {
    addPushpin();
  } else {
    map.entities.removeAt(0);
  }
}

function renderListWithNewCity(city) {
  let li = getCityElement(city);

  selectedCities.appendChild(li);
}

export function getCityElement(city) {
  let li = document.createElement("li");
  let p = document.createElement("p");
  let btn = document.createElement("button");

  p.innerText = city.name || "";
  btn.innerText = "X";
  li.append(p, btn);

  btn.addEventListener("click", () => {
    li.remove();
    let i = cities.findIndex((city1) => city1.name === city.name);
    removeCityFromMap(i);
    cities.splice(i, 1);
  });

  return li;
}
