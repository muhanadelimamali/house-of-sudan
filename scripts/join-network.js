const STORAGE_KEY = 'hos_join_network_submitted';
let submitted = false;

function handleFormSubmit() {
submitted = true;
try { localStorage.setItem(STORAGE_KEY, 'true'); } catch (e) {}
}

function showConfirmation() {
document.getElementById('hosForm').style.display = 'none';
document.getElementById('success-message').style.display = 'block';
}

(function checkExistingSubmission() {
try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('reset') === 'true') {
    localStorage.removeItem(STORAGE_KEY);
    return;
    }
    if (localStorage.getItem(STORAGE_KEY) === 'true') {
    showConfirmation();
    }
} catch (e) {}
})();