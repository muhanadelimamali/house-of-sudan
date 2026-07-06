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
    loadComponent('navbar-placeholder', 'https://houseofsudan.com/components/navbar.html', () => {
        // Initialize dynamic responsive layout listeners right away
        if (typeof initNavbar === 'function') initNavbar();
    });
    loadComponent('footer-placeholder', 'https://houseofsudan.com/components/footer.html');
});