/**
 * data.js - Simulates a database using LocalStorage
 */

const STORAGE_KEY = 'gospel_ministry_posts';

// Sample initial data
const INITIAL_DATA = [
    {
        id: 1731567890000,
        title: "Walking in Faith",
        category: "Daily Devotionals",
        author: "Pastor John",
        date: "2024-01-15",
        content: "Faith is the substance of things hoped for, the evidence of things not seen. Today, let us walk by faith and not by sight."
    },
    {
        id: 1731654320000,
        title: "The Power of Prayer",
        category: "Christian Living",
        author: "Sarah Smith",
        date: "2024-01-18",
        content: "Prayer is our direct line to God. When we pray, we invite His power into our lives and situations."
    }
];

const BlogDB = {
    // Initialize DB with sample data if empty
    init() {
        if (!localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
        }
    },

    // Get all posts (newest first)
    getPosts() {
        this.init();
        const posts = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return posts.sort((a, b) => b.id - a.id);
    },

    // Add a new post
    addPost(post) {
        this.init();
        const posts = this.getPosts();
        const newPost = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            ...post
        };
        posts.push(newPost);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
        return newPost;
    },

    // Get single post by ID
    getPostById(id) {
        this.init();
        const posts = this.getPosts();
        return posts.find(post => post.id === Number(id));
    },

    // Update an existing post
    updatePost(updatedPost) {
        this.init();
        const posts = this.getPosts();
        const index = posts.findIndex(p => p.id === Number(updatedPost.id));

        if (index !== -1) {
            posts[index] = { ...posts[index], ...updatedPost };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
        }
    },

    // Delete a post by ID
    deletePost(id) {
        this.init();
        let posts = this.getPosts();
        posts = posts.filter(post => post.id !== Number(id));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    }
};

// Expose to window for global access
window.BlogDB = BlogDB;
