function initFormProcessor() {
    const targetForm = document.getElementById('hosForm');
    if (!targetForm) return;

    const FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLScpwZCyKOVgasfMJ5DYPqML84PgqqlRfU4f4HeGlcAUKsEAOA/formResponse';

    targetForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Reset previous validation visually
        this.querySelectorAll('input.error').forEach(el => el.classList.remove('error'));

        let isFormValid = true;
        const nameField = this.querySelector('#fullName');
        const emailField = this.querySelector('#email');

        // Check layout rules
        if (!nameField.value.trim()) {
            nameField.classList.add('error');
            nameField.focus();
            isFormValid = false;
        }
        if (!emailField.value.trim() || !emailField.validity.valid) {
            emailField.classList.add('error');
            if (isFormValid) emailField.focus();
            isFormValid = false;
        }

        if (!isFormValid) return;

        const submitButton = document.getElementById('submitBtn');
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting…';

        const payload = new URLSearchParams(new FormData(this));

        fetch(FORM_ACTION, {
            method: 'POST',
            mode: 'no-cors',
            body: payload
        })
        .then(() => {
            // Direct structural display switch upon resolution loop completion
            document.getElementById('formSection').style.display = 'none';
            document.getElementById('success').style.display = 'block';
            
            const scrollContainer = document.querySelector('main');
            if(scrollContainer) {
                scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        })
        .catch(err => {
            console.error('Submission processing failure:', err);
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Application';
        });
    });
}