// Main JavaScript file for general functionality

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize Bootstrap popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Add staggered animation effect to post cards
    const staggerItems = document.querySelectorAll('.stagger-item');
    if (staggerItems.length > 0) {
        staggerItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Flash message auto-close
    const flashMessages = document.querySelectorAll('.alert-dismissible');
    if (flashMessages.length > 0) {
        flashMessages.forEach(flash => {
            setTimeout(() => {
                const closeButton = flash.querySelector('.btn-close');
                if (closeButton) {
                    closeButton.click();
                }
            }, 5000);
        });
    }

    // Confirm delete actions
    const deleteButtons = document.querySelectorAll('.delete-confirm');
    if (deleteButtons.length > 0) {
        deleteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
                    e.preventDefault();
                }
            });
        });
    }

    // Handle search form
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            if (searchInput.value.trim() === '') {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }

    // File input preview for profile avatar
    const avatarInput = document.getElementById('avatar');
    const avatarPreview = document.getElementById('avatarPreview');
    if (avatarInput && avatarPreview) {
        avatarInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarPreview.src = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // Auto-generate slug from title in post creation form
    const titleInput = document.getElementById('title');
    const slugInput = document.getElementById('slug');
    if (titleInput && slugInput) {
        titleInput.addEventListener('blur', function() {
            if (slugInput.value === '') {
                // Simple slug generation (for full implementation, use backend)
                let slug = this.value.toLowerCase()
                    .replace(/[^\w\s-]/g, '')    // Remove special chars
                    .replace(/\s+/g, '-')        // Replace spaces with hyphens
                    .replace(/-+/g, '-');        // Replace multiple hyphens with single hyphen
                
                slugInput.value = slug;
            }
        });
    }

    // Load more posts on scroll (infinite scroll simulation)
    const loadMoreTrigger = document.getElementById('loadMoreTrigger');
    const postsContainer = document.getElementById('postsContainer');
    let currentPage = 1;
    let loading = false;

    function loadMorePosts() {
        if (loadMoreTrigger && postsContainer && !loading) {
            const triggerPosition = loadMoreTrigger.getBoundingClientRect().top;
            const screenPosition = window.innerHeight;
            
            if (triggerPosition < screenPosition) {
                loading = true;
                
                // Show loading spinner
                loadMoreTrigger.innerHTML = '<div class="loading-spinner"></div>';
                
                // Simulate loading more posts (in a real app, this would be an AJAX call)
                setTimeout(() => {
                    // This is just for demonstration, in a real app you'd fetch data from the server
                    loading = false;
                    currentPage++;
                    
                    // Reset the trigger text
                    loadMoreTrigger.innerHTML = 'Loading more posts...';
                    
                    // If we've reached a certain page, remove the trigger
                    if (currentPage >= 5) {
                        loadMoreTrigger.remove();
                    }
                }, 1000);
            }
        }
    }

    // If the loadMoreTrigger exists, add scroll event listener
    if (loadMoreTrigger) {
        window.addEventListener('scroll', loadMorePosts);
        // Initial check
        loadMorePosts();
    }
});

// Function to show/hide password in login/register forms
function togglePasswordVisibility(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
}
