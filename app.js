import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';

const auth = getAuth();
const db = getFirestore();
const loginBtn = document.getElementById('log-in');
const logEmail = document.getElementById('logEmail');
const logPass = document.getElementById('logPass');

loginBtn.addEventListener('click', () => {
    const email = logEmail.value.trim();
    const password = logPass.value.trim();

    if (email && password) {
        Swal.fire({
            title: 'Logging In...',
            didOpen: () => {
                Swal.showLoading();
            }
        });

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('User logged in:', user);

                if (user.emailVerified) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Logging you in, please wait...',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 5000 // Close after 5 seconds
                    });

                    // Redirect to dashboard after 5 seconds
                    setTimeout(() => {
                        window.location.href = "index.html"; // Make sure this URL is correct
                    }, 5000);
                } else {
                    Swal.fire({
                        title: 'Email Not Verified',
                        text: 'Please verify your email to proceed. Check your inbox for the verification link.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Resend Verification Email',
                        cancelButtonText: 'Cancel'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            sendEmailVerification(user)
                                .then(() => {
                                    Swal.fire({
                                        title: 'Verification Email Sent',
                                        text: 'A new verification link has been sent to your email.',
                                        icon: 'info'
                                    });
                                })
                                .catch((error) => {
                                    console.error("Error sending email verification:", error.message);
                                    Swal.fire({
                                        title: 'Error',
                                        text: error.message,
                                        icon: 'error'
                                    });
                                });
                        }
                    });
                }
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.error('Error logging in:', errorMessage);
                Swal.fire({
                    title: 'Error!',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'Try Again'
                });
            });

    } else {
        Swal.fire({
            title: 'Input Required',
            text: "Please enter your email and password.",
            icon: "warning"
        });
    }
});

// Register user
function registerUser(email, password, name, address, phone) {
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;

            // Store additional user info in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name: name,
                address: address,
                phone: phone,
                email: email,
            });

            // Send email verification
            sendEmailVerification(user)
                .then(() => {
                    Swal.fire({
                        title: 'Verify Your Email',
                        text: 'A verification link has been sent to your email. Please check your inbox.',
                        icon: 'info'
                    });
                })
                .catch((error) => {
                    console.error("Error sending email verification:", error.message);
                    Swal.fire({
                        title: 'Error',
                        text: error.message,
                        icon: 'error'
                    });
                });
        }) // Corrected placement of closing parentheses
        .catch((error) => {
            console.error("Error registering user:", error.message);
            Swal.fire({
                title: 'Registration Error',
                text: error.message,
                icon: 'error'
            });
        });
}

// Register button event
const registerBtn = document.getElementById("register");
registerBtn.addEventListener("click", () => {
    window.location.href = "sign-up.html"; // Redirect to sign-up page
});
