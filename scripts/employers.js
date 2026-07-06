// Nav toggle
const toggle = document.getElementById('toggle');
const drawer = document.getElementById('drawer');
toggle.addEventListener('click', () => {
toggle.classList.toggle('open');
drawer.classList.toggle('open');
});

// Form submission
const FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSfhwoeASLS-NSSt5NCF1Vf-rZjB2B48VF6KbEO3n-VOQtwewQ/formResponse';

document.getElementById('employerForm').addEventListener('submit', function(e) {
e.preventDefault();

// Clear previous errors
this.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

// Validate required fields
let valid = true;
const orgName = this.querySelector('#orgName');
const contactPerson = this.querySelector('#contactPerson');
const contactEmail = this.querySelector('#contactEmail');

if (!orgName.value.trim()) {
    orgName.classList.add('error');
    orgName.focus();
    valid = false;
}
if (!contactPerson.value.trim()) {
    contactPerson.classList.add('error');
    if (valid) contactPerson.focus();
    valid = false;
}
if (!contactEmail.value.trim() || !contactEmail.validity.valid) {
    contactEmail.classList.add('error');
    if (valid) contactEmail.focus();
    valid = false;
}

if (!valid) return;

const btn = document.getElementById('submitBtn');
btn.disabled = true;
btn.textContent = 'Submitting…';

const data = new URLSearchParams(new FormData(this));

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