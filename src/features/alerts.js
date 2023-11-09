let container = document.querySelector(".alerts-container");

const alerts = [];

export function alert(text, ms) {
  let alert = document.createElement("div");

  renderAlert(alert, text);

  setTimeout(() => {
    alert.remove();
  }, ms);

  alerts.push(alert);

  if (alerts.length > 3) {
    let el = alerts.shift();
    el.remove();
  }
}

function renderAlert(alert, text) {
  alert.classList.add("alert");
  let p = document.createElement("p");
  p.innerText = text;
  let btn = document.createElement("button");
  btn.innerText = "X";
  btn.addEventListener("click", () => alert.remove());
  alert.append(p, btn);
  container.append(alert);
}
