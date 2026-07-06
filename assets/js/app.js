document.addEventListener("DOMContentLoaded", () => {
    const loadComponent = (elementId, componentPath, callback) => {
        const target = document.getElementById(elementId);
        if (!target) return;

        fetch(componentPath)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
                return response.text();
            })
            .then(data => {
                target.outerHTML = data;
                if (callback) callback();
            })
            .catch(error => console.error(error));
    };

    // Lazy load the shared structures using absolute live endpoints
    loadComponent('head-placeholder', 'https://houseofsudan.com/components/head.html');
    // Append or balance this inside your active assets/js/app.js instance:
    loadComponent('navbar-placeholder', 'https://houseofsudan.com/components/navbar.html', () => {
        if (typeof initNavbar === 'function') initNavbar();
        // Fire form setup hook securely if active execution target context is loaded
        if (typeof initFormProcessor === 'function') initFormProcessor();
    });
    loadComponent('footer-placeholder', 'https://houseofsudan.com/components/footer.html');
});