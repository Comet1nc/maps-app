import { alert } from "./alerts.js";
import { cities } from "./map.js";

const minAmountOfCitiesToBuildRoute = 2;

const openFormBtn = document.querySelector(".btn-save-route");
const container = document.querySelector(".form-container");

container.addEventListener("click", (e) => {
  if (e.target.classList.contains("save-route-btn")) {
    saveRoute(e.target.previousElementSibling.value);
  } else if (e.target.classList.contains("close-form-btn")) {
    closeForm();
  }
});

openFormBtn.addEventListener("click", () => {
  if (cities.length >= minAmountOfCitiesToBuildRoute) {
    openFormBtn.disabled = true;
    showForm();
  } else {
    alert("You need at least 2 points to save route", 5000);
  }
});

function saveRoute(name) {
  fetch(
    "https://maps-app-f38f1-default-rtdb.europe-west1.firebasedatabase.app/routes.json",
    {
      method: "POST",
      body: JSON.stringify({ name, cities }),
    }
  )
    .then((r) => {
      alert("Succesfully saved route!", 5000);
    })
    .catch(() => {
      console.error("POST ERROR");
    })
    .finally(() => {
      container.innerHTML = "";
      openFormBtn.disabled = false;
    });
}

function showForm() {
  container.innerHTML = createSaveForm();
}

function createSaveForm() {
  return `
    <div class="form-overlay">
      <form class="form">
        <input placeholder="Enter route name" type="text">
        <button type="button" class="save-route-btn">SAVE</button>
        <button type="button" class="close-form-btn">CANCEL</button>
      </form>
    </div>
  `;
}

function closeForm() {
  container.innerHTML = "";
  openFormBtn.disabled = false;
}
