import { alert } from "./alerts.js";
import { cities } from "./map.js";

const formSave = createSaveForm();

const minAmountOfCitiesToBuildRoute = 2;

const saveBtn = document.querySelector(".btn-save-route");

saveBtn.addEventListener("click", () => {
  if (cities.length >= minAmountOfCitiesToBuildRoute) {
    saveBtn.disabled = true;
    showSaveForm();
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
    .then(() => {
      alert("Succesfully saved route!", 5000);
    })
    .catch(() => {
      console.error("POST ERROR");
    })
    .finally(() => {
      formSave.remove();
      saveBtn.disabled = false;
    });
}

function showSaveForm() {
  document.body.append(formSave);
}

function createSaveForm() {
  let overlay = document.createElement("div");
  overlay.classList.add("form-overlay");
  let container = document.createElement("div");
  container.classList.add("form-container");
  let input = document.createElement("input");
  input.placeholder = "Enter route name";
  let btnSave = document.createElement("button");
  btnSave.innerText = "SAVE";
  btnSave.addEventListener("click", () => {
    saveRoute(input.value);
  });
  let btnCancel = document.createElement("button");
  btnCancel.innerText = "CANCEL";
  btnCancel.addEventListener("click", closeForm);
  container.append(input, btnSave, btnCancel);
  overlay.append(container);
  return overlay;
}

function closeForm(e) {
  formSave.remove();
  saveBtn.disabled = false;
}
