import { getAuth, signOut, getFirestore, collection, getDocs, query, where } from "./fire-base.js";

// Firebase Auth Instance
const auth = getAuth();

// Elements for category list and posts container
const categoryList = document.getElementById("category-list");
const postsContainer = document.getElementById("posts-container");
const searchBar = document.getElementById("search-bar");
const authBtn = document.getElementById("auth-btn");

// Categories for filtering and post creation
const categories = ["Technology", "Design", "Crypto", "Programming", "Business"];

// Initialize Firebase
const db = getFirestore();

// Check Authentication State
auth.onAuthStateChanged((user) => {
    if (user) {
        authBtn.textContent = "LOGOUT";
    } else {
        authBtn.textContent = "LOGIN/REGISTER";
    }
});

// Auth Button (Login/Logout)
authBtn.addEventListener("click", () => {
    if (auth.currentUser) {
        signOut(auth).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Logged out successfully!',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.reload();
            });
        }).catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'Logout Failed',
                text: error.message
            });
        });
    } else {
        window.location.href = "login.html";
    }
});

// Render categories in the sidebar and dropdown
function renderCategories() {
    if (categoryList) {
        categories.forEach(category => {
            const categoryItem = document.createElement("li");
            categoryItem.classList.add("list-group-item");
            categoryItem.textContent = category;
            categoryItem.addEventListener("click", () => filterPostsByCategory(category));
            categoryList.appendChild(categoryItem);
        });

        // Adding categories to the dropdown
        const dropdown = document.querySelector(".dropdown-menu");
        categories.forEach(category => {
            const categoryOption = document.createElement("li");
            const categoryLink = document.createElement("a");
            categoryLink.classList.add("dropdown-item");
            categoryLink.href = "#";
            categoryLink.textContent = category;
            categoryLink.addEventListener("click", (e) => {
                e.preventDefault();
                filterPostsByCategory(category);
            });
            categoryOption.appendChild(categoryLink);
            dropdown.appendChild(categoryOption);
        });
    } else {
        console.error("categoryList element not found.");
    }
}

// Function to fetch and display posts
async function renderPosts() {
    const postsCollection = collection(db, "posts");
    const postsSnapshot = await getDocs(postsCollection);
    postsContainer.innerHTML = ""; // Clear posts container

    if (postsSnapshot.empty) {
        postsContainer.innerHTML = "<p>No posts available.</p>";
        return;
    }

    postsSnapshot.forEach(doc => {
        const post = doc.data();
        const postElement = document.createElement("div");
        postElement.classList.add("post", "mb-3");
        postElement.innerHTML = `
            <h5>${post.title}</h5>
            <p><strong>Category:</strong> ${post.category}</p>
            <p>${post.content}</p>
        `;
        postsContainer.appendChild(postElement);
    });
}

// Function to filter posts by category
async function filterPostsByCategory(category) {
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, where("category", "==", category));
    const querySnapshot = await getDocs(q);

    postsContainer.innerHTML = ""; // Clear posts container
    if (querySnapshot.empty) {
        postsContainer.innerHTML = `<p>No posts available in ${category} category.</p>`;
    }

    querySnapshot.forEach(doc => {
        const post = doc.data();
        const postElement = document.createElement("div");
        postElement.classList.add("post", "mb-3");
        postElement.innerHTML = `
            <h5>${post.title}</h5>
            <p><strong>Category:</strong> ${post.category}</p>
            <p>${post.content}</p>
        `;
        postsContainer.appendChild(postElement);
    });
}

// Function to handle search input (searching within the selected category)
searchBar.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const selectedCategory = document.querySelector(".dropdown-menu .active")?.textContent || "";

    // Fetch all posts from the container (including those filtered by category)
    const posts = postsContainer.querySelectorAll(".post");

    posts.forEach((post) => {
        const title = post.querySelector("h5").textContent.toLowerCase();
        const category = post.querySelector("p").textContent.toLowerCase();
        const matchesSearch = title.includes(searchTerm);
        const matchesCategory = selectedCategory ? category.includes(selectedCategory.toLowerCase()) : true;

        // Show post if it matches both category and search term
        post.style.display = matchesSearch && matchesCategory ? "block" : "none";
    });
});

// Render categories and posts
renderCategories();
renderPosts();

// Redirect to user dashboard
document.getElementById("dash-btn").addEventListener("click", () => {
    window.location.href = "userdashboard.html"; // Redirect to the user dashboard page
});
