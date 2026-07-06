function initNavbar() {
    const toggle = document.getElementById('toggle');
    const drawer = document.getElementById('drawer');
    if (toggle && drawer) {
        // Remove existing listener if any to avoid double triggers
        toggle.replaceWith(toggle.cloneNode(true));
        const newToggle = document.getElementById('toggle');
        
        newToggle.addEventListener('click', () => {
            newToggle.classList.toggle('open');
            drawer.classList.toggle('open');
        });
    }
}