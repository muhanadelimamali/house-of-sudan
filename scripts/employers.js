// ── NAVIGATION DRAWER TOGGLE ──
const toggle = document.getElementById('toggle');
const drawer = document.getElementById('drawer');

if (toggle && drawer) {
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        drawer.classList.toggle('open');
    });
}

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

    // Format payload cleanly for standard Google Forms endpoints
    const data = new URLSearchParams(new FormData(this));

    // Post data to Google backend
    fetch(FORM_ACTION, {
        method: 'POST',
        mode: 'no-cors',
        body: data
    })
    .then(() => {
        // Form hidden completely to avoid broken height calculations with scroll-snap
        document.getElementById('formSection').style.display = 'none';
        
        // Show success layout screen
        const successPanel = document.getElementById('success');
        successPanel.style.display = 'flex';
        
        // Safe document reset focus view
        document.querySelector('main').scrollTop = 0;
    })
    .catch((err) => {
        console.error('Submission failed tracking error:', err);
        btn.disabled = false;
        btn.textContent = 'Submit';
    });
});