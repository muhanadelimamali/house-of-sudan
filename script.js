let current = 'home';

function measureChrome() {
const h = document.getElementById('site-header').offsetHeight;
const f = document.getElementById('site-footer').offsetHeight;
document.documentElement.style.setProperty('--header-h', h + 'px');
document.documentElement.style.setProperty('--footer-h', f + 'px');
}
measureChrome();
window.addEventListener('resize', measureChrome);

function toggleMenu() {
const ov = document.getElementById('mobile-overlay');
const hb = document.getElementById('hamburger');
const open = ov.classList.toggle('open');
hb.classList.toggle('open', open);
hb.setAttribute('aria-expanded', String(open));
}

function closeMenu() {
const ov = document.getElementById('mobile-overlay');
const hb = document.getElementById('hamburger');
ov.classList.remove('open');
hb.classList.remove('open');
hb.setAttribute('aria-expanded', 'false');
}

function showSection(e, id) {
if (e) e.preventDefault();
closeMenu();
if (id === current) return;

const prev = document.getElementById(current);
const next = document.getElementById(id);

// Fade out prev
prev.classList.remove('active');
prev.classList.add('animating-out');

setTimeout(() => {
    prev.classList.remove('animating-out');
    prev.style.display = 'none';
}, 320);

// Fade in next after a brief offset
next.style.display = 'block';
next.classList.add('animating-in');

requestAnimationFrame(() => {
    requestAnimationFrame(() => {
    next.classList.remove('animating-in');
    next.classList.add('active');
    });
});

current = id;

// Update nav active state
document.querySelectorAll('#desktop-menu a').forEach(a => {
    const onclick = a.getAttribute('onclick') || '';
    a.classList.toggle('active', onclick.includes(`'${id}'`));
});

// Scroll to top
document.getElementById('main-content').scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize: hide all non-active sections from layout
document.querySelectorAll('section:not(.active)').forEach(s => {
s.style.display = 'none';
});