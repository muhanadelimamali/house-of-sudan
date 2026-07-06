// Nav toggle
const toggle = document.getElementById('toggle');
const drawer = document.getElementById('drawer');
toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    drawer.classList.toggle('open');
});

// File label update
document.getElementById('flyerInput').addEventListener('change', function() {
const label = document.getElementById('flyerLabel');
if (this.files && this.files[0]) {
    label.textContent = this.files[0].name;
    label.classList.add('has-file');
} else {
    label.textContent = 'Application Flyer';
    label.classList.remove('has-file');
}
});

// Form submission
const FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSfjQn0gJ984xynCVE46me8RarXDnYPiYKy2x8sRS5sM3yYr6w/formResponse';

document.getElementById('employerForm').addEventListener('submit', function(e) {
e.preventDefault();

this.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

let valid = true;
const org   = this.querySelector('#orgName');
const name  = this.querySelector('#contactPerson');
const email = this.querySelector('#contactEmail');

if (!org.value.trim())  { org.classList.add('error');  org.focus();  valid = false; }
if (!name.value.trim()) { name.classList.add('error'); if (valid) name.focus(); valid = false; }
if (!email.value.trim() || !email.validity.valid) {
    email.classList.add('error');
    if (valid) email.focus();
    valid = false;
}

if (!valid) return;

const btn = document.getElementById('submitBtn');
btn.disabled = true;
btn.textContent = 'Submitting…';

fetch(FORM_ACTION, {
    method: 'POST',
    mode: 'no-cors',
    body: new FormData(this)
}).finally(() => {
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('success').style.display = 'flex';
});
});