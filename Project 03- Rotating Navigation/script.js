const open = document.getElementById('open');
const close = document.getElementById('close');
const container = document.querySelector('.container');

// Add class when open button is clicked
open.addEventListener('click', () => container.classList.add('show-nav'));

// Remove class when close button is clicked
close.addEventListener('click', () => container.classList.remove('show-nav'));
