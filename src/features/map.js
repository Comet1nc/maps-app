import { directionsManager, map } from "../main.js";

export let cities = [];

export const selectedCities = document.querySelector(".selected-cities");

selectedCities.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-city")) {
    deleteCity(e);
  }
});

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
  selectedCities.innerHTML += getCityElement(city);
}

export function getCityElement(city) {
  return `
    <li city-name="${city.name}">
      <p>${city.name || ""}</p>
      <button class="delete-city">X</button>
    </li>
  `;
}

function deleteCity(e) {
  let item = e.target.closest("[city-name]");
  item.remove();
  let name = item.getAttribute("city-name");
  let i = cities.findIndex((city) => city.name === name);
  removeCityFromMap(i);
  cities.splice(i, 1);
}
