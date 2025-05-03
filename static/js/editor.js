// Rich text editor integration for blog post creation/editing

document.addEventListener('DOMContentLoaded', function() {
    // Initialize CKEditor on the content field
    const contentField = document.getElementById('content');
    const postForm = document.getElementById('postForm');
    
    if (contentField) {
        ClassicEditor
            .create(contentField, {
                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'insertTable', 'undo', 'redo'],
                heading: {
                    options: [
                        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
                    ]
                }
            })
            .then(editor => {
                // Store editor instance to access it later if needed
                window.editor = editor;
                
                // Update the hidden form field with CKEditor content before form submission
                if (postForm) {
                    postForm.addEventListener('submit', function() {
                        contentField.value = editor.getData();
                    });
                }
            })
            .catch(error => {
                console.error('CKEditor initialization error:', error);
            });
    }
    
    // Handle form submission
    if (postForm) {
        postForm.addEventListener('submit', function(e) {
            // Content validation already handled by CKEditor integration
            // Validate content (prevent empty posts)
            const content = contentField.value.trim();
            if (!content) {
                e.preventDefault();
                alert('Post content cannot be empty.');
            }
        });
    }
    
    // Featured image preview
    const featuredImageInput = document.getElementById('featured_image');
    const featuredImagePreview = document.getElementById('featuredImagePreview');
    
    if (featuredImageInput && featuredImagePreview) {
        featuredImageInput.addEventListener('blur', function() {
            const imageUrl = this.value.trim();
            if (imageUrl) {
                featuredImagePreview.innerHTML = `
                    <div class="card mt-3">
                        <img src="${imageUrl}" class="card-img-top" alt="Featured image preview">
                        <div class="card-body">
                            <p class="card-text text-muted">Featured image preview</p>
                        </div>
                    </div>
                `;
            } else {
                featuredImagePreview.innerHTML = '';
            }
        });
        
        // Trigger for existing URLs when page loads
        if (featuredImageInput.value.trim()) {
            featuredImageInput.dispatchEvent(new Event('blur'));
        }
    }
    
    // Category multiselect enhancement
    const categorySelect = document.getElementById('categories');
    if (categorySelect) {
        // Initialize Bootstrap Select if available
        if (typeof $.fn.selectpicker !== 'undefined') {
            $(categorySelect).selectpicker({
                liveSearch: true,
                actionsBox: true,
                size: 5
            });
        }
    }
});
