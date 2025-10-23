const draggables = document.querySelectorAll(".draggable");
const boxes = document.querySelectorAll(".box");

draggables.forEach((draggable) => {
  draggable.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", draggable.id);
    setTimeout(() => (draggable.style.display = "none"), 0);
  });

  draggable.addEventListener("dragend", (e) => {
    draggable.style.display = "flex";
  });
});

boxes.forEach((box) => {
  box.addEventListener("dragover", (e) => {
    e.preventDefault();
    box.classList.add("drag-over");
  });

  box.addEventListener("dragleave", (e) => {
    box.classList.remove("drag-over");
  });

  box.addEventListener("drop", (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const draggable = document.getElementById(id);
    box.appendChild(draggable);
    box.classList.remove("drag-over");
  });
});
