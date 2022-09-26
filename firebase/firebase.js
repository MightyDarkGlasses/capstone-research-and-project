// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBFzmDkFR_ZIi5aSc1ATfXykOcowRTx8oA",
    authDomain: "bulsu---pms.firebaseapp.com",
    projectId: "bulsu---pms",
    storageBucket: "bulsu---pms.appspot.com",
    messagingSenderId: "36091561292",
    appId: "1:36091561292:web:85d41dea4e7c7b80f8fbe9"
};


// Initialize Firebase
initializeApp(firebaseConfig);

// init service, Firestore is more concerned in Collections than JSON.
const db = getFirestore(); //anything we do in our DB, we use this
const auth = getAuth(); //utilize authentication service, (login, signup, signin)


// Login Authentication
const loginForm = document.querySelector('right-login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); //prevent refresh

    const email = loginForm.user_email.value            // check the name attr. name="user_email"
    const password = loginForm.user_password.value;     // check the name attr. name="user_password"
    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log("User logged in:", cred.user)
        }).catch((err) => {
            console.log("Sign in error: ", err);
        });
});