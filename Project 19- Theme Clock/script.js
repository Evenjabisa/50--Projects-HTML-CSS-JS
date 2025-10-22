const hourEl = document.querySelector('.needle.hour');
const minuteEl = document.querySelector('.needle.minute');
const secondEl = document.querySelector('.needle.second');
const timeEl = document.querySelector('.time');
const dateEl = document.querySelector('.date');
const toggle = document.querySelector('.toggle');

const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// Dark / Light Mode Toggle
toggle.addEventListener('click', (e) => {
    const html = document.querySelector('html');
    if(html.classList.contains('dark')){
        html.classList.remove('dark');
        e.target.innerHTML ='Dark Mode';
    } else {
        html.classList.add('dark');
        e.target.innerHTML ='Light Mode';
    }
});

// Map number from one range to another
function scale(num, in_min, in_max, out_min, out_max){
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// Set Clock Time
function setTime(){
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDay();
    const date = now.getDate();
    const hours = now.getHours();
    const hoursForClock = hours % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Rotate Hands
    hourEl.style.transform = `rotate(${scale(hoursForClock + minutes/60, 0, 12, 0, 360)}deg)`;
    minuteEl.style.transform = `rotate(${scale(minutes + seconds/60, 0, 60, 0, 360)}deg)`;
    secondEl.style.transform = `rotate(${scale(seconds, 0, 60, 0, 360)}deg)`;

    // Update digital time
    timeEl.innerHTML = `${hours < 10 ? '0'+hours : hours}:${minutes < 10 ? '0'+minutes : minutes}`;

    // Update date
    dateEl.innerHTML = `${days[day]}, ${months[month]} <span class="circle">${date}</span>`;
}

// Run every second
setInterval(setTime, 1000);
setTime();
