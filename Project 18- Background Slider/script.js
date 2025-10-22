const body = document.body;
const slides = document.querySelectorAll(".slide");
const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");
const dots = document.querySelectorAll(".dot");

let activeSlide = 0;

setBgToBody();
setActiveSlide();

function setBgToBody() {
  body.style.backgroundImage = slides[activeSlide].style.backgroundImage;
}

function setActiveSlide() {
  slides.forEach(slide => slide.classList.remove("active"));
  slides[activeSlide].classList.add("active");

  dots.forEach((dot, i) => dot.classList.toggle("active", i === activeSlide));
}

leftBtn.addEventListener('click', () => {
  activeSlide = (activeSlide + 1) % slides.length;
  setBgToBody();
  setActiveSlide();
});

rightBtn.addEventListener('click', () => {
  activeSlide = (activeSlide - 1 + slides.length) % slides.length;
  setBgToBody();
  setActiveSlide();
});

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    activeSlide = i;
    setBgToBody();
    setActiveSlide();
  });
});

setInterval(() => {
  activeSlide = (activeSlide + 1) % slides.length;
  setBgToBody();
  setActiveSlide();
}, 5000);
