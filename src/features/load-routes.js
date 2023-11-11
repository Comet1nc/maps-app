import { cities, getCityElement, renderMap } from "./map.js";
import { alert } from "./alerts.js";

const loadBtn = document.querySelector(".btn-load-route");

loadBtn.addEventListener("click", () => {
  loadBtn.disabled = true;
  showListOfRoutes();
});

function createRoutesList(routes) {
  let overlay = document.createElement("div");
  overlay.classList.add("routes-list-overlay");
  let container = document.createElement("div");
  container.classList.add("routes-list-container");
  let list = document.createElement("ul");
  list.classList.add("routes-list");
  let closeBtn = document.createElement("button");
  closeBtn.innerText = "X";
  closeBtn.addEventListener("click", () => {
    overlay.remove();
    loadBtn.disabled = false;
  });
  container.append(closeBtn);
  if (routes) {
    for (let route of Object.values(routes)) {
      let droute = createDomRoute(route);
      list.append(droute);
    }
  } else {
    let info = document.createElement("p");
    info.innerText = "NO ROUTES SAVED";
    list.append(info);
  }
  container.append(list);
  overlay.append(container);
  document.body.append(overlay);
}

function createDomRoute(route) {
  let routeLi = document.createElement("li");
  let routeName = document.createElement("p");
  routeName.innerText = route.name;
  let routeLoadBtn = document.createElement("button");
  routeLoadBtn.innerText = "LOAD";
  routeLoadBtn.addEventListener("click", () => {
    loadRoute(route);
  });
  let routeDeleteBtn = document.createElement("button");
  routeDeleteBtn.addEventListener("click", () => {
    deleteRoute(route);
  });
  routeDeleteBtn.innerText = "DELETE";
  routeLi.append(routeName, routeLoadBtn, routeDeleteBtn);

  return routeLi;
}

function showListOfRoutes() {
  fetchRoutes().then((routes) => {
    createRoutesList(routes);
  });
}

function fetchRoutes() {
  return fetch(
    "https://maps-app-f38f1-default-rtdb.europe-west1.firebasedatabase.app/routes.json"
  ).then((response) => {
    return response.json();
  });
}

function loadRoute(route) {
  cities.splice(0, cities.length, ...route.cities);

  let dcities = [];
  for (let city of cities) {
    let li = getCityElement(city);
    dcities.push(li);
  }
  document.querySelector(".selected-cities").replaceChildren(...dcities);

  renderMap();
}

function deleteRoute(route) {
  fetchRoutes().then((routes) => {
    let arr = Object.values(routes);
    const i = arr.findIndex((r) => r.name === route.name);
    arr.splice(i, 1);

    fetch(
      "https://maps-app-f38f1-default-rtdb.europe-west1.firebasedatabase.app/routes.json",
      {
        method: "PUT",
        body: JSON.stringify(arr),
      }
    )
      .then(() => {
        alert("Succesfully deleted route!", 5000);
        updateRoutesList(arr);
      })
      .catch(() => {
        console.error("PUT ERROR");
      });
  });
}

function updateRoutesList(routes) {
  let list = document.querySelector(".routes-list");

  if (routes.length) {
    let droutes = [];
    for (let route of routes) {
      let droute = createDomRoute(route);
      droutes.push(droute);
    }
    list.replaceChildren(...droutes);
  } else {
    console.log("create info");
    let info = document.createElement("p");
    info.innerText = "NO SAVED ROUTES";
    list.replaceChildren(info);
  }
}
