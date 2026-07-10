const toggle = document.getElementById('toggle');
const drawer = document.getElementById('drawer');
toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    drawer.classList.toggle('open');
});