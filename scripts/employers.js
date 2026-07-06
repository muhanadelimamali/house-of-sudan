// ── NAVIGATION DRAWER TOGGLE ──
const toggle = document.getElementById('toggle');
const drawer = document.getElementById('drawer');

toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    drawer.classList.toggle('open');
});


// ── CUSTOM FILE UPLOAD UI HANDLER ──
const flyerInput = document.getElementById('flyerInput');
const flyerLabel = document.getElementById('flyerLabel');

flyerInput.addEventListener('change', function() {
    if (this.files && this.files.length > 0) {
        // Update label with the chosen filename and change text color
        flyerLabel.textContent = this.files[0].name;
        flyerLabel.classList.add('has-file');
    } else {
        // Fallback to default state if cleared
        flyerLabel.textContent = 'Application Flyer';
        flyerLabel.classList.remove('has-file');
    }
});


// ── GOOGLE FORM SUBMISSION HANDLER ──
const FORM_ACTION = 'https://docs.google.com/forms/d/e/FAIpQLSfjQn0gJ984xynCVE46me8RarXDnYPiYKy2x8sRS5sM3yYr6w/formResponse';

document.getElementById('employerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Clear any previous error styling
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

    // Stop execution if client-side validation fails
    if (!valid) return;

    // Update submit button state
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.textContent = 'Submitting…';

    // Format the payload as application/x-www-form-urlencoded for Google Forms
    const data = new URLSearchParams(new FormData(this));

    // Post to Google Forms backend
    fetch(FORM_ACTION, {
        method: 'POST',
        mode: 'no-cors',
        body: data
    })
    .finally(() => {
        // Smoothly transition interface to display the success state
        document.getElementById('formSection').style.display = 'none';
        document.getElementById('success').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});