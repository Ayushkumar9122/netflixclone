// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Utility function for showing notifications
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = '#141414';
        } else {
            header.style.backgroundColor = 'transparent';
        }
    });

    // Sign In Modal
    const signInBtn = document.querySelector('#header-right button');
    let signInModal = null;

    signInBtn.addEventListener('click', () => {
        signInModal = document.createElement('div');
        signInModal.className = 'signin-modal';
        signInModal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Sign In</h2>
                <form id="signin-form">
                    <input type="email" placeholder="Email" required>
                    <input type="password" placeholder="Password" required>
                    <button type="submit">Sign In</button>
                </form>
            </div>
        `;
        document.body.appendChild(signInModal);

        // Close modal functionality
        const closeBtn = signInModal.querySelector('.close');
        closeBtn.onclick = () => signInModal.remove();
    });

    // Email Signup Form
    const emailForm = document.querySelector('.email-form');
    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailForm.querySelector('input').value;
        if (validateEmail(email)) {
            showNotification('Thank you for signing up!');
            emailForm.reset();
        } else {
            showNotification('Please enter a valid email address', 'error');
        }
    });

    // Email validation
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Movie/Show Preview Functionality
    const movieBoxes = document.querySelectorAll('.box1, .box2, .box3');
    movieBoxes.forEach(box => {
        box.addEventListener('mouseenter', showPreview);
        box.addEventListener('mouseleave', hidePreview);
        box.addEventListener('click', showMovieDetails);
    });

    function showPreview(e) {
        const box = e.currentTarget;
        box.style.transform = 'scale(1.05)';
        box.style.transition = 'transform 0.3s ease';
    }

    function hidePreview(e) {
        const box = e.currentTarget;
        box.style.transform = 'scale(1)';
    }

    function showMovieDetails(e) {
        const movieModal = document.createElement('div');
        movieModal.className = 'movie-modal';
        movieModal.innerHTML = `
            <div class="movie-modal-content">
                <span class="close">&times;</span>
                <h2>${e.currentTarget.getAttribute('data-title') || 'Movie Title'}</h2>
                <div class="movie-details">
                    <p class="description">${e.currentTarget.getAttribute('data-description') || 'Movie description goes here...'}</p>
                    <div class="rating">Rating: ${e.currentTarget.getAttribute('data-rating') || '★★★★☆'}</div>
                    <button class="play-btn">▶ Play</button>
                    <button class="add-list-btn">+ My List</button>
                </div>
            </div>
        `;
        document.body.appendChild(movieModal);

        const closeBtn = movieModal.querySelector('.close');
        closeBtn.onclick = () => movieModal.remove();
    }

    // Lazy Loading for Images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Smooth Scrolling for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add to My List Functionality
    let myList = JSON.parse(localStorage.getItem('myList')) || [];
    
    function addToMyList(movieId, title) {
        if (!myList.includes(movieId)) {
            myList.push(movieId);
            localStorage.setItem('myList', JSON.stringify(myList));
            showNotification(`${title} added to My List`);
        } else {
            showNotification(`${title} is already in My List`, 'error');
        }
    }

    // Search Functionality
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = e.target.value.toLowerCase();
                const movies = document.querySelectorAll('.movie-item');
                
                movies.forEach(movie => {
                    const title = movie.getAttribute('data-title').toLowerCase();
                    if (title.includes(searchTerm)) {
                        movie.style.display = 'block';
                    } else {
                        movie.style.display = 'none';
                    }
                });
            }, 300);
        });
    }

    // Theme Toggle
    let isDarkMode = true;
    function toggleTheme() {
        isDarkMode = !isDarkMode;
        document.body.style.backgroundColor = isDarkMode ? '#141414' : '#ffffff';
        document.body.style.color = isDarkMode ? '#ffffff' : '#141414';
    }

    // Error Handling
    window.addEventListener('error', function(e) {
        console.error('An error occurred:', e.error);
        showNotification('Something went wrong. Please try again later.', 'error');
    });
});