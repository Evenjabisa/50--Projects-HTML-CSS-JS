window.addEventListener('keydown', (event) => {
   insert.innerHTML = `
          <div class="key">
            ${event.key === ' ' ? 'Space' : event.key}
            <small>event.key</small>
        </div>

        <div class="key">
            ${event.keyCode === 32 ? '32' : event.keyCode}
            <small>event.keyCode</small>
        </div>

        <div class="key">
            ${event.code === 'Space' ? 'Space' : event.code} 
            <small>event.code</small>
        </div>
   `;
})