const jokeEl = document.getElementById('joke');
const jokeBtn = document.getElementById('jokeBtn');

// Load a joke on page load
generateJoke();

// Load a new joke on button click
jokeBtn.addEventListener('click', generateJoke);

function generateJoke() {
    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };

    // Set button to loading state
    jokeBtn.innerText = 'Loading...';
    jokeBtn.disabled = true;

    // Fade out current joke
    jokeEl.style.opacity = 0;

    fetch('https://icanhazdadjoke.com/', config)
        .then(res => res.json())
        .then(data => {
            setTimeout(() => {
                jokeEl.innerText = data.joke; // Show the joke
                jokeEl.style.opacity = 1;     // Fade in
                jokeBtn.innerText = 'Get Another Joke'; // Reset button
                jokeBtn.disabled = false;
            }, 300); // fade transition delay
        })
        .catch(err => {
            jokeEl.innerText = 'Oops! Something went wrong 😅';
            console.error(err);
            jokeBtn.innerText = 'Get Another Joke';
            jokeBtn.disabled = false;
        });
}
