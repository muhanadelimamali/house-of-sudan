// ── NAVIGATION DRAWER TOGGLE ──
const toggle = document.getElementById('toggle');
const drawer = document.getElementById('drawer');

if (toggle && drawer) {
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        drawer.classList.toggle('open');
    });
}

// ── EMPLOYER GOOGLE FORM SUBMISSION HANDLER ──
const FORM_ACTION = 'https://docs.google.com/forms/d/e/FAIpQLSfjQn0gJ984xynCVE46me8RarXDnYPiYKy2x8sRS5sM3yYr6w/formResponse';

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

    // Stop execution if validation fails
    if (!valid) return;

    // Update submit button state
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.textContent = 'Submitting…';

    // Format payload for Google Forms
    const data = new URLSearchParams(new FormData(this));

    // Post data to Google backend
    fetch(FORM_ACTION, {
        method: 'POST',
        mode: 'no-cors',
        body: data
    })
    .finally(() => {
        // Hide the form section
        document.getElementById('formSection').style.display = 'none';
        
        // Show success layout screen
        document.getElementById('success').style.display = 'block';
        
        // Smooth scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});