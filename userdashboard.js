import { getAuth, signOut, getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from "./fire-base.js";

const auth = getAuth();
const db = getFirestore();

// Elements
const postCategorySelect = document.getElementById("post-category");
const postForm = document.getElementById("create-post-form"); // Corrected form ID here
const postsContainer = document.getElementById("posts-list"); // Corrected container ID here
const authBtn = document.getElementById("auth-btn");

// Check Authentication State
auth.onAuthStateChanged((user) => {
    if (user) {
        authBtn.textContent = "LOGOUT";
        renderUserPosts(user.uid);  // Fetch user-specific posts when logged in
    } else {
        authBtn.textContent = "LOGIN/REGISTER";
        window.location.href = "login.html"; // Redirect to login if not authenticated
    }
});

// Auth Button (Login/Logout)
authBtn.addEventListener("click", () => {
    if (auth.currentUser) {
        // If the user is logged in, log them out
        signOut(auth).then(() => {
            alert("Logged out successfully!");
            window.location.reload();
        }).catch((error) => alert(error.message));
    } else {
        // Redirect to the login page
        window.location.href = "login.html";
    }
});

// Categories
const categories = ["Technology", "Design", "Crypto", "Programming", "Business"];

// Function to render categories in the post creation form
function renderCategories() {
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        postCategorySelect.appendChild(option);
    });
}

// Render Categories
renderCategories();

// Function to handle post submission
postForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = e.target.title.value;
    const content = e.target.content.value;
    const category = e.target["post-category"].value;

    if (title && content && category) {
        try {
            const user = auth.currentUser;
            await addDoc(collection(db, "posts"), {
                title,
                content,
                category,
                userId: user.uid,  // Save the user ID with the post to identify ownership
                createdAt: new Date() // Timestamp of when post is created
            });
            alert("Post created successfully!");
            renderUserPosts(user.uid); // Reload user's posts
        } catch (error) {
            console.error("Error adding post: ", error);
            alert("There was an error creating the post.");
        }
    } else {
        alert("Please fill in all fields.");
    }
});

// Function to render posts created by the current user
async function renderUserPosts(userId) {
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    postsContainer.innerHTML = ""; // Clear the posts container

    querySnapshot.forEach(doc => {
        const post = doc.data();
        const postElement = document.createElement("div");
        postElement.classList.add("post", "mb-3");
        postElement.innerHTML = `
            <h5>${post.title}</h5>
            <p><strong>Category:</strong> ${post.category}</p>
            <p>${post.content}</p>
            <button class="edit-btn" data-id="${doc.id}">Edit</button>
            <button class="delete-btn" data-id="${doc.id}">Delete</button>
        `;
        postsContainer.appendChild(postElement);
    });

    // Add event listeners for edit and delete buttons
    addEditDeleteEventListeners();
}

// Function to handle editing and deleting posts
// Function to handle editing and deleting posts
function addEditDeleteEventListeners() {
    const deleteBtns = document.querySelectorAll(".delete-btn");
    deleteBtns.forEach(button => {
        button.addEventListener("click", async (e) => {
            const postId = e.target.getAttribute("data-id");
            try {
                await deleteDoc(doc(db, "posts", postId));
                alert("Post deleted successfully!");
                const user = auth.currentUser;
                renderUserPosts(user.uid);  // Refresh posts after deletion
            } catch (error) {
                console.error("Error deleting post: ", error);
                alert("There was an error deleting the post.");
            }
        });
    });

    const editBtns = document.querySelectorAll(".edit-btn");
    editBtns.forEach(button => {
        button.addEventListener("click", async (e) => {
            const postId = e.target.getAttribute("data-id");
            const postRef = doc(db, "posts", postId);
            const postDoc = await getDocs(postRef);
            const post = postDoc.data();

            // Populate the form with post data for editing
            postForm.title.value = post.title;
            postForm.content.value = post.content;
            postForm["post-category"].value = post.category;

            // Handle edit form submission separately
            const originalSubmitHandler = postForm.onsubmit; // Store the original handler
            postForm.onsubmit = async function (e) {
                e.preventDefault();

                // Check if the form elements are properly available
                const updatedTitle = postForm.title ? postForm.title.value : '';
                const updatedContent = postForm.content ? postForm.content.value : '';
                const updatedCategory = postForm["post-category"] ? postForm["post-category"].value : '';

                if (updatedTitle && updatedContent && updatedCategory) {
                    try {
                        await updateDoc(postRef, {
                            title: updatedTitle,
                            content: updatedContent,
                            category: updatedCategory,
                        });
                        alert("Post updated successfully!");
                        renderUserPosts(auth.currentUser.uid);  // Reload posts after update
                    } catch (error) {
                        console.error("Error updating post: ", error);
                        alert("There was an error updating the post.");
                    }
                } else {
                    alert("Please fill in all fields.");
                }
            };
        });
    });
}
document.getElementById("das-btn").addEventListener("click",()=>{
    window.location.href ="index.html"
})

