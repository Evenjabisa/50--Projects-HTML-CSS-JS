const toggles = document.querySelectorAll('.faq-toggle')


toggles.forEach(toggle => {
        toggle.addEventListener('click', (_ => {
            toggle.parentNode.classList.toggle('active')
        })
    )
    })