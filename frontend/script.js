const API_URL = 'http://localhost:5000/posts';

document.addEventListener('DOMContentLoaded', () => {
    const postList = document.getElementById('postList');
    const postForm = document.getElementById('postForm');
    const postsContainer = document.getElementById('postsContainer');
    const postFormElement = document.getElementById('postFormElement');
    const postIdField = document.getElementById('postId');
    const postTitleField = document.getElementById('postTitle');
    const postContentField = document.getElementById('postContent');
    const postAuthorField = document.getElementById('postAuthor');

    const loadPostsButton = document.getElementById('loadPosts');
    const createPostButton = document.getElementById('createPost');

    const showSection = (section) => {
        postList.classList.add('hidden');
        postForm.classList.add('hidden');
        section.classList.remove('hidden');
    };

    const fetchPosts = async () => {
        const response = await fetch(API_URL);
        const posts = await response.json();

        postsContainer.innerHTML = posts
            .map(post => `
                <div>
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <small>By ${post.author} on ${new Date(post.date).toLocaleDateString()}</small>
                    <button onclick="editPost('${post.id}')">Edit</button>
                    <button onclick="deletePost('${post.id}')">Delete</button>
                </div>
            `)
            .join('');
    };

    window.editPost = (id) => {
        fetch(`${API_URL}/${id}`)
            .then(response => response.json())
            .then(post => {
                postIdField.value = post.id;
                postTitleField.value = post.title;
                postContentField.value = post.content;
                postAuthorField.value = post.author;
                showSection(postForm);
            });
    };

    window.deletePost = (id) => {
        fetch(`${API_URL}/${id}`, { method: 'DELETE' })
            .then(() => fetchPosts());
    };

    postFormElement.addEventListener('submit', async (event) => {
        event.preventDefault();

        const post = {
            title: postTitleField.value,
            content: postContentField.value,
            author: postAuthorField.value,
        };

        const method = postIdField.value ? 'PUT' : 'POST';
        const endpoint = postIdField.value ? `${API_URL}/${postIdField.value}` : API_URL;

        await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post),
        });

        postFormElement.reset();
        showSection(postList);
        fetchPosts();
    });

    loadPostsButton.addEventListener('click', () => {
        showSection(postList);
        fetchPosts();
    });

    createPostButton.addEventListener('click', () => {
        postFormElement.reset();
        postIdField.value = '';
        showSection(postForm);
    });

    // Load posts by default
    showSection(postList);
    fetchPosts();
});
