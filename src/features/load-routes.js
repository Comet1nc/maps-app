import { cities, getCityElement, renderMap, selectedCities } from "./map.js";
import { alert } from "./alerts.js";

const loadBtn = document.querySelector(".btn-load-route");
const routesList = document.querySelector(".routes-list-container");

let routes;

routesList.addEventListener("click", (e) => {
  if (e.target.classList.contains("close-btn")) {
    closeRoutesTab();
  } else if (e.target.classList.contains("load-btn")) {
    const name = getRouteName(e);
    if (name) loadRoute(name);
  } else if (e.target.classList.contains("delete-btn")) {
    const name = getRouteName(e);
    if (name) deleteRoute(name);
  }
});

loadBtn.addEventListener("click", () => {
  loadBtn.disabled = true;
  showListOfRoutes();
});

function closeRoutesTab() {
  loadBtn.disabled = false;
  while (routesList.firstChild) {
    routesList.removeChild(routesList.lastChild);
  }
}

function getRouteName(e) {
  let item = e.target.closest("[route-name]");
  if (item) {
    let name = item.getAttribute("route-name");
    return name;
  }
}

function createRoutesList() {
  let ulhtml = ``;
  if (routes) {
    for (let route of routes) {
      let droute = createDomRoute(route);
      ulhtml += droute;
    }
  } else {
    ulhtml = `
      <p>NO ROUTES SAVED</p>
    `;
  }

  let html = `
  <div class="routes-list-overlay">
    <div class="routes-list"> 
      <button class="close-btn">X</button>
      <ul>
        ${ulhtml}
      </ul>
    </div>
  </div> 
  `;

  routesList.innerHTML = html;
}

function createDomRoute(route) {
  let routeLi = `
    <li route-name="${route.name}">
      <p>${route.name}</p>
      <button class="load-btn">LOAD</button>
      <button class="delete-btn">DELETE</button>
    </li>
  `;

  return routeLi;
}

function showListOfRoutes() {
  fetchRoutes().then((r) => {
    routes = Object.values(r);

    createRoutesList();
  });
}

function fetchRoutes() {
  return fetch(
    "https://maps-app-f38f1-default-rtdb.europe-west1.firebasedatabase.app/routes.json"
  ).then((response) => {
    return response.json();
  });
}

function loadRoute(routeName) {
  let route = routes.find((v) => v.name === routeName);
  cities.splice(0, cities.length, ...route.cities);

  let lihtml = ``;
  for (let city of cities) {
    lihtml += getCityElement(city);
  }
  selectedCities.innerHTML = lihtml;

  renderMap();
}

function deleteRoute(routeName) {
  const i = routes.findIndex((r) => r.name === routeName);
  routes.splice(i, 1);

  fetch(
    "https://maps-app-f38f1-default-rtdb.europe-west1.firebasedatabase.app/routes.json",
    {
      method: "PUT",
      body: JSON.stringify(routes),
    }
  )
    .then(() => {
      alert("Succesfully deleted route!", 5000);
      updateRoutesList();
    })
    .catch(() => {
      console.error("PUT ERROR");
    });
}

function updateRoutesList() {
  let list = document.querySelector(".routes-list > ul");

  let ulhtml = ``;

  if (routes.length) {
    for (let route of routes) {
      ulhtml += createDomRoute(route);
    }
  } else {
    ulhtml = `<p>NO SAVED ROUTES</p>`;
  }

  list.innerHTML = ulhtml;
}
