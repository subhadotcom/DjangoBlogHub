// Rich text editor integration for blog post creation/editing

document.addEventListener('DOMContentLoaded', function() {
    // Initialize TinyMCE on textareas with class "tinymce"
    const contentField = document.getElementById('content');
    const postForm = document.getElementById('postForm');
    
    if (contentField) {
        tinymce.init({
            selector: '#content',
            height: 500,
            menubar: true,
            plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
            ],
            toolbar: 'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | link image media | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            skin: 'oxide-dark',
            content_css: 'dark',
            setup: function(editor) {
                // Update the hidden form field with TinyMCE content before form submission
                editor.on('change', function() {
                    tinymce.triggerSave();
                });
                
                // Also handle image uploads if needed
                editor.on('init', function() {
                    editor.getBody().style.backgroundColor = '#2b2b2b';
                    editor.getBody().style.color = '#f8f9fa';
                });
            }
        });
    }
    
    // Handle form submission
    if (postForm) {
        postForm.addEventListener('submit', function(e) {
            // Make sure TinyMCE content is saved to the form field
            tinymce.triggerSave();
            
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
