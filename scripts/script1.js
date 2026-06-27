function showSection(id) {
document.querySelectorAll('.section').forEach(s => {
    s.classList.remove('active', 'fade-in');
});

const target = document.getElementById(id);
target.classList.add('active');

// trigger reflow for animation
void target.offsetWidth;
target.classList.add('fade-in');

// update nav buttons
document.querySelectorAll('[data-section]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-section') === id);
});

window.scrollTo({ top: 0, behavior: 'smooth' });
}

function submitForm() {
const form = document.getElementById('hosForm');
const required = form.querySelectorAll('[required]');
let valid = true;
required.forEach(f => { if (!f.value.trim()) { f.style.background = '#fff0f0'; valid = false; } else { f.style.background = ''; } });
if (!valid) return;

const data = new FormData(form);
const params = new URLSearchParams(data).toString();

fetch('https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse', {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
}).catch(() => {});

form.style.display = 'none';
document.querySelector('.form-submit-row').style.display = 'none';
document.getElementById('success').style.display = 'block';
}

// hamburger
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
hamburger.classList.toggle('open');
mobileMenu.classList.toggle('open');
});

function closeMobile() {
hamburger.classList.remove('open');
mobileMenu.classList.remove('open');
}
