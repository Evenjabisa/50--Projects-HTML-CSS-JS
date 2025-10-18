const progress = document.getElementById('progress');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const circles = document.querySelectorAll('.circle');
const progressContainer = document.getElementById('progressContainer');
const message = document.getElementById('message');

let currentActive = 1;

// Next button click
next.addEventListener('click', () => {
  currentActive++;

  if (currentActive > circles.length) {
    currentActive = circles.length;
  }

  update();
});

// Previous button click
prev.addEventListener('click', () => {
  currentActive--;

  if (currentActive < 1) {
    currentActive = 1;
  }

  update();
});

// Update UI
function update() {
  circles.forEach((circle, idx) => {
    if (idx < currentActive) {
      circle.classList.add('active');
    } else {
      circle.classList.remove('active');
    }
  });

  const actives = document.querySelectorAll('.active');
  progress.style.width =
    ((actives.length - 1) / (circles.length - 1)) * 100 + '%';

  // Disable buttons when needed
  prev.disabled = currentActive === 1;
  next.disabled = currentActive === circles.length;

  // When user finishes all steps
  if (currentActive === circles.length) {
    setTimeout(() => {
      progressContainer.style.display = 'none';
      prev.style.display = 'none';
      next.style.display = 'none';
      message.style.display = 'block';
    }, 400);
  }
}
