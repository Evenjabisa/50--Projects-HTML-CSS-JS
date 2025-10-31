const range = document.getElementById("range");
const label = document.querySelector("label");

range.addEventListener("input", (e) => {
  const value = + e.target.value;
  const labelWidth = label.offsetWidth;
  const rangeWidth = range.offsetWidth;
  const max = +range.max;
  const min = +range.min;

  const left = value * (rangeWidth / max) - labelWidth / 2 + 10;
  label.style.left = `${left}px`;
  label.innerHTML = value;
});
