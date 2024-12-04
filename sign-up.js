import { getAuth, createUserWithEmailAndPassword,GoogleAuthProvider,signInWithPopup } from "./fire-base.js";
const provider = new GoogleAuthProvider();
const auth = getAuth();
let signEmail = document.getElementById('sign-email')
let signPass = document.getElementById('sign-pass')
let signUpBtn = document.getElementById('sign-up')

signUpBtn.addEventListener('click', () => {

    if (signEmail.value.trim() && signPass.value.trim()) {
        createUserWithEmailAndPassword(auth, signEmail.value, signPass.value)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('User created:', user);
             window.location.href = "index.html";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Error:', errorCode, errorMessage);
                // Log the complete error object for more details
                console.error('Full error details:', error);

            });
    }
    else {
        Swal.fire({
            text: "Insert your data",
            icon: "question"
        });
    }
})
let googlebtn = document.getElementById("google")
googlebtn.addEventListener("click",()=>{
    signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    window.location.href = "index.html";
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
})
document.getElementById("login").addEventListener("click",()=>{window.location.href ="index.html"})
