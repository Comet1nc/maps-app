import { directionsManager, map } from "../main.js";

export let cities = [
  // {
  //   name: "Radom",
  //   location: {
  //     latitude: 51.4067,
  //     longitude: 21.1254,
  //     altitude: 0,
  //     altitudeReference: -1,
  //   },
  // },
  // {
  //   name: "Warszawa",
  //   location: {
  //     latitude: 52.235,
  //     longitude: 21.0085,
  //     altitude: 0,
  //     altitudeReference: -1,
  //   },
  // },
];

export function displayCities(city) {
  cities.push(city);

  renderListWithNewCity(city);

  recalculatePath();

  togglePushpinForSingleCity();

  rerenderMap();

  console.log(cities);
}

function recalculatePath() {
  if (cities.length < 2) return;
  cities.sort((cityA, cityB) => {
    if (cityA.location.latitude !== cityB.location.latitude) {
      return cityA.location.latitude - cityB.location.latitude;
    }
    return cityA.location.longitude - cityB.location.longitude;
  });
}

export function rerenderMap() {
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
    // cities[i] = {};
  });

  document.querySelector(".selected-cities").appendChild(li);
}
