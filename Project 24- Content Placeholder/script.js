// Select the card elements
const header = document.getElementById('header');
const title = document.getElementById('title');
const excerpt = document.getElementById('excerpt');
const profile_img = document.getElementById('profile_img');
const name = document.getElementById('name');
const date = document.getElementById('date');

// After 2 seconds, replace the skeleton with real space content
setTimeout(() => {
  // Change the header image to a space photo
  header.innerHTML = '<img src="https://plus.unsplash.com/premium_photo-1669839137069-4166d6ea11f4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774" alt="Space Image">';

  // Update the card title
  title.textContent = "Journey to the Stars";

  // Update the card excerpt
  excerpt.innerHTML = "Explore the vast universe and witness the beauty of galaxies, nebulae, and distant planets.";

  // Change the profile image
  profile_img.innerHTML = '<img src="https://images.unsplash.com/photo-1669287731413-bfd7ce1fcc9e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387" alt="Astronaut Profile">';

  // Update the author name and date
  name.textContent = "Neil Armstrong";
  date.textContent = "Oct, 24, 2025";

  // Remove the loading animation classes
  const animatedBgs = document.querySelectorAll('.animated-bg');
  const animatedTexts = document.querySelectorAll('.animated-bg-text');

  animatedBgs.forEach(bg => bg.classList.remove('animated-bg'));
  animatedTexts.forEach(bg => bg.classList.remove('animated-bg-text'));
}, 2000);
