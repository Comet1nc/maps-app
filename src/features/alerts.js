const alerts = [];

let counter = 0;

let container = document.querySelector(".alerts-container");

container.addEventListener("click", (e) => {
  if (e.target.localName === "button") {
    const id = e.target.parentNode.id;
    const i = alerts.findIndex((e) => e.id === id);
    const alert = alerts.splice(i, 1);
    alert[0].remove();
  }
});

export function alert(text, ms) {
  let alert = document.createElement("div");
  alert.id = counter++;
  alert.classList.add("alert");

  alert.innerHTML = `
  <p>${text}</p>
  <button>X</button>
  `;

  container.append(alert);

  setTimeout(() => {
    alerts.shift();
    alert.remove();
  }, ms);

  alerts.push(alert);

  if (alerts.length > 3) {
    let el = alerts.shift();
    el.remove();
  }
}
