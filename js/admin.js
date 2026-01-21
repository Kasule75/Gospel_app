// DOM Elements - initialized in DOMContentLoaded
let postForm, postsContainer, submitBtn, formTitle;
let editingId = null;

// Move loadPosts to global scope so it can be called by delete/edit
function loadPosts() {
    // Re-query container if needed or ensure it's set
    if (!postsContainer) postsContainer = document.getElementById('postsContainer');
    if (!postsContainer) return;

    const posts = BlogDB.getPosts();
    postsContainer.innerHTML = '';

    if (posts.length === 0) {
        postsContainer.innerHTML = '<p>No posts yet.</p>';
        return;
    }

    posts.forEach(post => {
        const item = document.createElement('div');
        item.className = 'post-item';
        item.innerHTML = `
            <div>
                <strong>${post.title}</strong>
                <br>
                <small>${post.category} - ${post.date}</small>
            </div>
            <div>
                <button class="edit-btn" onclick="editPost(${post.id})" style="background-color: #f39c12; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">Edit</button>
                <button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>
            </div>
        `;
        postsContainer.appendChild(item);
    });
}

// Global Edit Function
window.editPost = (id) => {
    // Ensure elements are available
    if (!postForm) {
        postForm = document.getElementById('postForm');
        submitBtn = postForm.querySelector('button[type="submit"]');
        formTitle = document.querySelector('.admin-container h2');
    }

    const post = BlogDB.getPostById(id);
    if (post) {
        editingId = post.id;
        document.getElementById('title').value = post.title;
        document.getElementById('category').value = post.category;
        document.getElementById('author').value = post.author;
        document.getElementById('content').value = post.content;

        // Visual feedback
        submitBtn.textContent = 'Update Post';
        submitBtn.style.backgroundColor = '#f39c12';
        formTitle.textContent = '✏️ Edit Post';

        // Scroll to form
        formTitle.scrollIntoView({ behavior: 'smooth' });
    }
};

// Global Delete Function
window.deletePost = (id) => {
    if (confirm('Are you sure you want to delete this post?')) {
        BlogDB.deletePost(id);
        loadPosts();
        // If deleting the currently edited post, reset form
        if (editingId === id) resetForm();
    }
};

// Reset Form Helper
function resetForm() {
    editingId = null;
    if (postForm) postForm.reset();
    if (submitBtn) {
        submitBtn.textContent = 'Publish Post';
        submitBtn.style.backgroundColor = ''; // Reset to CSS default
    }
    if (formTitle) formTitle.textContent = '📝 Write New Sermon/Blog';
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM elements
    postForm = document.getElementById('postForm');
    postsContainer = document.getElementById('postsContainer');
    submitBtn = postForm.querySelector('button[type="submit"]');
    formTitle = document.querySelector('.admin-container h2');

    // Handle Form Submission
    postForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const category = document.getElementById('category').value;
        const author = document.getElementById('author').value || 'Admin';
        const content = document.getElementById('content').value;

        if (editingId) {
            // Update existing post
            BlogDB.updatePost({
                id: editingId,
                title,
                category,
                author,
                content
            });
            alert('Post updated successfully!');
            resetForm();
        } else {
            // Create new post
            BlogDB.addPost({
                title,
                category,
                author,
                content
            });
            alert('Post published successfully!');
            postForm.reset();
        }

        loadPosts();
    });

    // Initial Load
    loadPosts();
});
