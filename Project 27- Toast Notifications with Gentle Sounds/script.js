function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');

  // Play gentle sound based on type
  const sounds = {
    success: document.getElementById('sound-success'),
    error: document.getElementById('sound-error'),
    info: document.getElementById('sound-info')
  };

  if (sounds[type]) {
    sounds[type].currentTime = 0; // restart sound
    sounds[type].play();
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.classList.add('toast', type);
  toast.innerHTML = `
    <span>${message}</span>
    <span class="close-btn">&times;</span>
  `;

  // Close button
  toast.querySelector('.close-btn').addEventListener('click', () => {
    hideToast(toast);
  });

  // Append toast
  container.appendChild(toast);

  // Auto remove
  setTimeout(() => {
    hideToast(toast);
  }, duration);
}

function hideToast(toast) {
  toast.style.animation = 'slideOut 0.5s forwards';
  toast.addEventListener('animationend', () => toast.remove());
}
