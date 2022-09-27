/************** == LOGIN PAGE == ***************/
/************** == LOGIN PAGE == ***************/
/************** == LOGIN PAGE == ***************/
console.log("login.js is called.");
function doLoginForm() {
    // const loginForm = document.querySelector('.login'); 
    // if(loginForm !== undefined) {
        // loginForm.addEventListener('submit', (e) => {
        //     e.preventDefault(); //prevent refresh
            console.log("Create new account");
            const email = loginForm.user_email.value;            // check the name attr. name="user_email"
            const password = loginForm.user_password.value;     // check the name attr. name="user_password"
            signInWithEmailAndPassword(auth, email, password)
                .then((cred) => {
                    console.log("User logged in:", cred.user)
                    checkCurrentLoggedUser();
                    // sendVerification();
                    logoutUser();
                    
                }).catch((err) => {
                    console.log("Sign in error: ", err);
                });
    //     });
    // }
}
function checkCurrentLoggedUser() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user !== null) {
        // The user object has basic properties such as display name, email, etc.
        const displayName = user.displayName;
        const email = user.email;
        const photoURL = user.photoURL;
        const emailVerified = user.emailVerified;
        const fullDetails = user.toJSON;
        console.log("displayName: " + displayName, 
        "email: " + email, 
        "photoURL: " + photoURL, 
        "emailVerified: " + emailVerified),
        "JSON: ", fullDetails;
    }
}
function isUserVerified() {
    // true -> the user is verified
    // false -> not yet. need to confirm by checking the Spam mail inbox.
    return getAuth().currentUser.emailVerified;
}


/************** END OF LOGIN PAGE ***************/
/************** END OF LOGIN PAGE ***************/
/************** END OF LOGIN PAGE ***************/

/************************ UNRELATED FUNCION WITHIN THIS PAGE *******************************/

function sendVerification() {
    // Send e-mail verification, to be later verify by user.
    sendEmailVerification(auth.currentUser)
      .then(() => {
        window.alert("E-mail verification sent.");
    });
}
function updateUserProfile() {
    // Update the user profile, insert name, profile url, etc.
    const auth = getAuth();
    updateProfile(auth.currentUser, {
        displayName: "Administrator"
    }).then(() => {
        // Profile updated!
        // ...
    }).catch((error) => {
        // An error occurred
        // ...
    });
}
function logoutUser() {
    //Temporary only.
    signOut(auth)
        .then(() => {
            console.log("User signed out.")
        }).catch((err) => {
            console.log("Logout error message: ", err);
    }); //auth = getAuth();
    // let logoutButton = undefined;

    // if (logoutButton !== undefined) {
    //     logoutButton.addEventListener('click', () => {
    //         signOut(auth)
    //             .then(() => {
    //                 console.log("User signed out.")
    //             }).catch((err) => {
    //                 console.log("Logout error message: ", err);
    //             }); //auth = getAuth();
    //     });
    // }
}

/*
//generateJoke.js
    function generateJoke() {
        return "This is a joke. HAHAHA!";
    }
    export default generateJoke;

//callJoke.js
    import { generateJoke } from './generateJoke';
    console.log(generateJoke());
*/