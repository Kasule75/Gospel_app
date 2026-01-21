document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const primaryNav = document.querySelector('.primary-nav');
    const body = document.body;

    // Toggle Mobile Menu
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        primaryNav.classList.toggle('active');
        menuToggle.textContent = primaryNav.classList.contains('active') ? '✕' : '☰';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!primaryNav.contains(e.target) && !menuToggle.contains(e.target) && primaryNav.classList.contains('active')) {
            primaryNav.classList.remove('active');
            menuToggle.textContent = '☰';
        }
    });

    // Mobile Dropdown Toggle
    const dropdowns = document.querySelectorAll('.dropdown > a');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 992) { // Only on mobile
                e.preventDefault();
                const parent = dropdown.parentElement;

                // Close other opened dropdowns
                document.querySelectorAll('.dropdown.active').forEach(item => {
                    if (item !== parent) {
                        item.classList.remove('active');
                    }
                });

                parent.classList.toggle('active');
            }
        });
    });

    // Expose delete function to window for the onclick handler - NOT NEEDED HERE, handled in admin.js. 
    // We need to display posts here.

    const blogGrid = document.getElementById('blog-grid');
    if (blogGrid && window.BlogDB) {
        const posts = BlogDB.getPosts();

        // Take only top 3 for the homepage
        const latestPosts = posts.slice(0, 3);

        latestPosts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.className = 'faq-item'; // Reuse card style
            postCard.innerHTML = `
                <small style="color: var(--primary-color); font-weight: bold;">${post.category}</small>
                <h3>${post.title}</h3>
                <p>${post.content.substring(0, 100)}...</p>
                <br>
                <small style="color: #666;">By ${post.author} on ${post.date}</small>
            `;
            blogGrid.appendChild(postCard);
        });
    }

    // Smooth Scrolling for Anchors
    // Exclusive Content Visibility Logic
    const contentSections = document.querySelectorAll('section');
    const heroSection = document.querySelector('.hero-section');
    const footer = document.querySelector('.main-footer');

    // Function to hide everything
    function hideAllContent() {
        if (heroSection) heroSection.style.display = 'none';
        contentSections.forEach(section => {
            section.style.display = 'none';
            // Reset visibility of children in case they were hidden
            Array.from(section.children).forEach(child => child.style.display = '');
            // Reset grid
            const grids = section.querySelectorAll('.faq-grid');
            grids.forEach(grid => {
                grid.style.display = '';
                Array.from(grid.children).forEach(item => item.style.display = '');
            });
        });
    }

    // Function to show Home/Hero
    function showHome() {
        hideAllContent();
        if (heroSection) heroSection.style.display = 'flex';
        // Optional: show some specific sections on home if desired, or just hero
        // For now, based on "clean", let's show Hero + maybe Blog grid if user wants, but stricter is safer.
        // Let's show Hero and the "Gospel" intro section as it was the main landing.
        const gospelSection = document.querySelector('#gospel');
        if (gospelSection) {
            gospelSection.style.display = 'block';
            // Ensure full gospel section is visible
            Array.from(gospelSection.children).forEach(c => c.style.display = '');
            const grid = gospelSection.querySelector('.faq-grid');
            if (grid) Array.from(grid.children).forEach(c => c.style.display = '');
        }
    }

    // Navigation Click Handler
    document.querySelectorAll('a[href^="#"], a[href="index.html"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Handle index.html or home link
            const href = this.getAttribute('href');
            if (href === 'index.html') {
                e.preventDefault();
                showHome();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            e.preventDefault();
            const targetId = href;
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // If mobile menu is open, close it
                if (primaryNav.classList.contains('active')) {
                    primaryNav.classList.remove('active');
                    menuToggle.textContent = '☰';
                }

                hideAllContent();

                // Check if target is a Section (Main Menu Item likely)
                if (targetElement.tagName === 'SECTION') {
                    // Show Full Section
                    targetElement.style.display = 'block';
                }
                // Check if target is a Sub-Item (div inside section)
                else {
                    const parentSection = targetElement.closest('section');
                    if (parentSection) {
                        parentSection.style.display = 'block';

                        // Hide Parent Section Direct Children (Headers etc) NOT containing the target
                        // We want to hide <h2>About Jesus</h2> etc.
                        Array.from(parentSection.children).forEach(child => {
                            if (!child.contains(targetElement) && child !== targetElement) {
                                child.style.display = 'none';
                            }
                        });

                        // If target is inside a grid (faq-grid), we need to hide siblings in that grid
                        const parentGrid = targetElement.closest('.faq-grid');
                        if (parentGrid) {
                            parentGrid.style.display = 'block'; // Ensure grid container is visible
                            Array.from(parentGrid.children).forEach(item => {
                                if (item !== targetElement) {
                                    item.style.display = 'none';
                                } else {
                                    item.style.display = 'block';
                                    item.classList.add('active'); // Ensure opacity animation works if CSS uses it
                                    // Make it look full width/centered if needed ?
                                    // For now, grid layout might act weird with one item. 
                                    // But typically 1 item in grid fills space or stays left.
                                }
                            });
                        }
                    }
                }

                // Scroll to top or target
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });

});

// Donation Amount Selector
function selectAmount(btn, amount) {
    // Deselect all buttons in this container
    const container = btn.parentElement;
    const buttons = container.querySelectorAll('.amount-btn');
    buttons.forEach(b => b.classList.remove('active'));

    // Select clicked button
    btn.classList.add('active');

    // Toggle Custom Input
    const customContainer = document.getElementById('custom-amount-container');
    if (amount === 'custom') {
        customContainer.style.display = 'block';
        const input = document.getElementById('custom-amount');
        if (input) input.focus();
    } else {
        if (customContainer) customContainer.style.display = 'none';
    }
}
window.selectAmount = selectAmount;
