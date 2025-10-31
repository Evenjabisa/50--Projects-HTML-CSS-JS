const ratings = document.querySelectorAll(".rating");
const sendBtn = document.querySelector("#send");
const panel = document.querySelector("#panel");
let selectedRating = "";

panel.addEventListener("click", (e) => {
  const rating = e.target.closest(".rating");
  if (rating) {
    removeActive();
    rating.classList.add("active");
    selectedRating = rating.querySelector("small").innerText;
  }
});

sendBtn.addEventListener("click", () => {
  panel.innerHTML = `
    <i class='fas fa-heart'></i>
    <strong>Thank You!</strong>
    <br>
    <strong>Feedback: ${selectedRating}</strong>    
    <p style="text-align: center;">
  We'll use your feedback to improve our customer support.
</p>
  `;
});

function removeActive() {
  ratings.forEach((r) => r.classList.remove("active"));
}
