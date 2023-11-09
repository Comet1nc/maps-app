import { alert } from "./alerts.js";
import { cities } from "./map.js";

document.querySelector(".save-route").addEventListener("click", () => {
  if (cities.length < 2)
    alert("You need at least 2 points to save route", 500000);
});
