// Nav toggle
const toggle = document.getElementById('toggle');
const drawer = document.getElementById('drawer');
toggle.addEventListener('click', () => {
toggle.classList.toggle('open');
drawer.classList.toggle('open');
});

// Form submission
const FORM_ACTION = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';

document.getElementById('hosForm').addEventListener('submit', function(e) {
e.preventDefault();

// Clear previous errors
this.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

// Validate required fields
let valid = true;
const name  = this.querySelector('#fullName');
const email = this.querySelector('#email');

if (!name.value.trim()) {
    name.classList.add('error');
    name.focus();
    valid = false;
}
if (!email.value.trim() || !email.validity.valid) {
    email.classList.add('error');
    if (valid) email.focus();
    valid = false;
}

if (!valid) return;

const btn = document.getElementById('submitBtn');
btn.disabled = true;
btn.textContent = 'Submitting…';

const data = new FormData(this);

fetch(FORM_ACTION, {
    method: 'POST',
    mode: 'no-cors',
    body: data
})
.finally(() => {
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('success').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
});