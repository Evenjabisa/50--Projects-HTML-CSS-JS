const counters = document.querySelectorAll('.counter');

counters.forEach(counter => {
    counter.innerText = '0';    

    const updateCounter = () => {
        const target = +counter.getAttribute('data-target');
        const c = +counter.innerText.replace(/,/g, ''); // remove commas before converting to number
        const increment = target / 200;

        if (c < target) {
            const newValue = Math.ceil(c + increment);
            counter.innerText = newValue.toLocaleString(); // add comma separators
            setTimeout(updateCounter, 10);
        } else {
            counter.innerText = target.toLocaleString(); // final formatted value
        }
    };

    updateCounter();
});
