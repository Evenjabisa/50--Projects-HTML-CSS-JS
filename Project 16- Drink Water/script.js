/* ======================================================
   Drink Water App - Interactive Water Tracker
   Adds smooth animations, glowing display, and local cache 💾
   Author: Córdoba Innovation 🌙
====================================================== */

/* === SELECT ELEMENTS === */
const smallCups = document.querySelectorAll('.cup-small'); // All small cups
const liters = document.getElementById('liters');          // Remaining liters text
const percentage = document.getElementById('percentage');  // Big cup fill percentage
const remained = document.getElementById('remained');      // Remaining section

/* === INITIALIZATION === */
// Restore saved state from localStorage
restoreCupsFromCache();

// Update big cup when the page loads
updateBigCup();

/* === EVENT LISTENERS === */
// Loop through each small cup and add a click event
smallCups.forEach((cup, idx) => {
  cup.addEventListener('click', () => {
    highlightCups(idx);
    saveCupsToCache(); // Save to cache every time user clicks
  });
});

/* ======================================================
   highlightCups()
   Handles user clicks on small cups
   Fills/unfills cups based on the clicked one
====================================================== */
function highlightCups(idx) {
  if (
    smallCups[idx].classList.contains('full') &&
    !smallCups[idx].nextElementSibling?.classList.contains('full')
  ) {
    idx--;
  }

  smallCups.forEach((cup, idx2) => {
    if (idx2 <= idx) {
      cup.classList.add('full');
    } else {
      cup.classList.remove('full');
    }
  });

  updateBigCup();
  saveCupsToCache(); // Save state whenever updated
}

/* ======================================================
   updateBigCup()
   Updates:
   - Big cup water height (percentage)
   - Remaining liters
   - Visibility of sections
   Includes smooth height transitions for realism
====================================================== */
function updateBigCup() {
  const fullCups = document.querySelectorAll('.cup-small.full').length;
  const totalCups = smallCups.length;

  // === HANDLE PERCENTAGE FILL ===
  if (fullCups === 0) {
    percentage.style.visibility = 'hidden';
    percentage.style.height = 0;
  } else {
    const fillHeight = (fullCups / totalCups) * 330; // Cup total height = 330px
    percentage.style.visibility = 'visible';
    percentage.style.transition = 'height 0.6s ease-in-out';
    percentage.style.height = `${fillHeight}px`;
    percentage.innerText = `${Math.round((fullCups / totalCups) * 100)}%`;
    percentage.style.textShadow = '0 0 15px rgba(0, 255, 255, 0.6)';
  }

  // === HANDLE REMAINED SECTION ===
  if (fullCups === totalCups) {
    remained.style.visibility = 'hidden';
    remained.style.height = 0;
  } else {
    remained.style.visibility = 'visible';
    remained.style.transition = 'all 0.6s ease';
    liters.innerText = `${(2 - (250 * fullCups) / 1000).toFixed(2)}L`; 
  }
}

/* ======================================================
   🧩 Local Storage Functions
   Save and restore cup states between sessions
====================================================== */
function saveCupsToCache() {
  const fullIndexes = [];
  smallCups.forEach((cup, i) => {
    if (cup.classList.contains('full')) fullIndexes.push(i);
  });
  localStorage.setItem('fullCups', JSON.stringify(fullIndexes));
}

function restoreCupsFromCache() {
  const saved = JSON.parse(localStorage.getItem('fullCups'));
  if (!saved) return;
  saved.forEach(i => {
    if (smallCups[i]) smallCups[i].classList.add('full');
  });
}
