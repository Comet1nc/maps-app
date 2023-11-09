import { displayCities } from "./features/map.js";
import * as routes from "./features/routes.js";

export let map;
export let directionsManager;

window.onload = () => {
  useMicrosoftMaps();
};

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
      selectedSuggestion
    );
  });

  Microsoft.Maps.loadModule("Microsoft.Maps.Directions", () => {
    directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);

    directionsManager.setRenderOptions({
      itineraryContainer: "#directionsItinerary",
    });

    // TEST
    // rerenderMap();
  });
}

function selectedSuggestion(result) {
  displayCities({
    name: result.address.locality,
    location: result.location,
  });
}
