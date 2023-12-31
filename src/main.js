import { selectCity } from "./features/map.js";
import * as saveroutes from "./features/save-routes.js";
import * as loadroutes from "./features/load-routes.js";
import * as generator from "./features/map-image-generator.js";
import * as imgconf from "./features/map-image-configure.js";

export let map;
export let directionsManager;

("use strict");

window.onload = () => {
  useMicrosoftMaps();
};

const m = document.querySelector("#myMap");

resizeMap();
window.addEventListener("resize", (e) => {
  resizeMap();
});

function resizeMap() {
  m.style.width = window.innerWidth * 0.6 + "px";
}

function useMicrosoftMaps() {
  map = new Microsoft.Maps.Map("#myMap", {
    center: new Microsoft.Maps.Location(52.235, 20.0085),
    zoom: 6,
  });

  Microsoft.Maps.loadModule("Microsoft.Maps.AutoSuggest", () => {
    var manager = new Microsoft.Maps.AutosuggestManager({
      map: map,
    });
    manager.attachAutosuggest(
      "#searchBox",
      "#searchBoxContainer",
      selectedSuggestion // Callback reaguje na wybór miejsca w wyszukiwarce.
    );
  });

  Microsoft.Maps.loadModule("Microsoft.Maps.Directions", () => {
    directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);

    directionsManager.setRenderOptions({
      itineraryContainer: "#directionsItinerary",
    });
  });
}

function selectedSuggestion(result) {
  selectCity({
    name: result.address.locality,
    location: result.location,
  });
}
