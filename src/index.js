import { initializeApp } from 'firebase/app';
import { 
    getFirestore,
    collection,
    onSnapshot,   //setup realtime listener
    getDocs,      //get document 
    addDoc,       //add new document
    deleteDoc,    //delete document
    doc,          //making references

    query,      //Firestore queries, See line 62
    where,       //used by Firestore queries
    orderBy,      //used by Firestore queries, sorting data
    serverTimestamp,  //create timestamp stored in Firebase
    getDoc,          //grab single document
    updateDoc,        //update single document
    setDoc
} from 'firebase/firestore';

//Authentication
import {
    getAuth,
    createUserWithEmailAndPassword, //signup
    signOut, //signout the user
    signInWithEmailAndPassword, //signIn
    onAuthStateChanged,  //state change
    sendEmailVerification,
    updateProfile
} from 'firebase/auth';

console.log("bundle.js/index.js is called.");
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
// export const app = initializeApp(firebaseConfig);

//init firebase app
initializeApp(firebaseConfig)

// init service, Firestore is more concerned in Collections than JSON.
const db = getFirestore(); //anything we do in our DB, we use this
const auth = getAuth(); //utilize authentication service, (login, signup, signin)
// const colRef1 = collection(db, 'account-information');
// const colRef2 = collection(db, 'vehicle-information');

// Authentication check.
console.log(auth);
/************** == LOGIN PAGE == ***************/
/************** == LOGIN PAGE == ***************/
/************** == LOGIN PAGE == ***************/
const loginForm = document.querySelector('.login'); 
// console.log(loginForm)
if(loginForm !== undefined && loginForm !== null) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); //prevent refresh
        doLoginForm();
    });
}
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
                    console.log("isUserVerified:", isUserVerified());
                    
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
        const myId = user.uid;
        const fullDetails = user.toJSON;
        console.log("displayName: " + displayName, 
        "email: " + email, 
        "photoURL: " + photoURL, 
        "uid: " + myId,
        "emailVerified: " + emailVerified);
    }
    return;
}

function isUserVerified() {
    // true -> the user is verified
    // false -> not yet. need to confirm by checking the Spam mail inbox.
    return getAuth().currentUser.emailVerified;
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

/************** END OF LOGIN PAGE ***************/
/************** END OF LOGIN PAGE ***************/
/************** END OF LOGIN PAGE ***************/


/********** REGISTER THE USER **********/
/********** REGISTER THE USER **********/
/********** REGISTER THE USER **********/
//J123456a
// signup3.html, OK button
function getCurrentLoggedUserUID() {
    const auth = getAuth();
    const user = auth.currentUser;
    return user.uid;
}
let registerButtonFinal = document.getElementById("reg-goto-final");
if (registerButtonFinal !== null && registerButtonFinal !== undefined) {
    registerButtonFinal.addEventListener("click", () => {
        createUserWithEmailAndPassword(auth, getCookie("email"), getCookie("pass"))
        .then((cred) => {
            console.log('User created: ', cred.user);
            const userId = getCurrentLoggedUserUID();
            createNewData(userId);
        }).catch((err) => {
            console.log("Signup error message: ", err); //e.g password is wrong or too short, invalid email, etc.
        });
    });
}
function createNewData(userUID) {
    setDoc(doc(db, "account-information", userUID), {
        id_number: getCookie("id"),
        first_name: getCookie("fname"),
        middle_name: getCookie("mname"),
        last_name: getCookie("lname"),
        phone_num: getCookie("phone"),
        is_active: false,
        createdAt: serverTimestamp()
    }).then(() => {
        console.log("Account Information was added in the collection");
    });
    setDoc(doc(db, "vehicle-information", userUID), {
        registered_vehicle: {
            vehicles: {
                images: ["front", "side", "rear"]
            },
            qrcode: ["QRCODE-TEST"],
            plate: [getCookie("plate")],
            model: [getCookie("model")]
        },
        createdAt: serverTimestamp()
    }).then(() => {
        console.log("Vehicle Information was added in the collection");

        //Success! Redirect to the next page.
        sendVerification();
        window.location = "signup4.html";
    });
}

/********** END OF REGISTER THE USER **********/
/********** END OF REGISTER THE USER **********/
/********** END OF REGISTER THE USER **********/


// let verificationPage = document.getElementById("verification-page");
// if (verificationPage !== null && verificationPage !== undefined) {
//     window.onload = function() {
//         sendVerification();
//         console.log("An email verification was send successfully.");
//     }
// }

function sendVerification() {
    const auth = getAuth();
    const user = auth.currentUser;
    // Send e-mail verification, to be later verify by user.
    sendEmailVerification(user)
      .then(() => {
        console.log("User verification was sent.")
        alert("User verification was sent.")
    });
}
// let registerVerifyEmail = document.getElementById("reg-goto-final-verifyemail");
// if (registerVerifyEmail !== null && registerVerifyEmail !== undefined) {

// }


// const docData = {
//     stringExample: "Hello world!",
//     booleanExample: true,
//     numberExample: 3.14159265,
//     dateExample: Timestamp.fromDate(new Date("December 10, 1815")),
//     arrayExample: [5, true, "hello"],
//     nullExample: null,
//     objectExample: {
//         a: 5,
//         b: {
//             nested: "foo"
//         }
//     }
// };
// await setDoc(doc(db, "data", "one"), docData);

// Get the User UID using onAuthStateChanged function
// https://stackoverflow.com/questions/62974697/how-to-retrieve-user-uid-after-they-have-been-created-firebase-js
// firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//       // User is signed in.
//       var displayName = user.displayName;
//       var email = user.email;
//       var emailVerified = user.emailVerified;
//       var photoURL = user.photoURL;
//       var isAnonymous = user.isAnonymous;
//       var uid = user.uid;
//       var providerData = user.providerData;
//       // ...
//     } else {
//       // User is signed out.
//       // ...
//     }
//   });