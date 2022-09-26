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
    onAuthStateChanged  //state change
} from 'firebase/auth';

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
const app = initializeApp(firebaseConfig);

//init firebase app
initializeApp(firebaseConfig)

// init service, Firestore is more concerned in Collections than JSON.
const db = getFirestore(); //anything we do in our DB, we use this
const auth = getAuth(); //utilize authentication service, (login, signup, signin)
const colRef1 = collection(db, 'account-information');
const colRef2 = collection(db, 'vehicle-information');

console.log(auth);
// Login Authentication
// const loginForm = document.querySelector('.login'); 
// loginForm.addEventListener('submit', (e) => {
//     e.preventDefault(); //prevent refresh

//     const email = loginForm.user_email.value;            // check the name attr. name="user_email"
//     const password = loginForm.user_password.value;     // check the name attr. name="user_password"
//     signInWithEmailAndPassword(auth, email, password)
//         .then((cred) => {
//             console.log("User logged in:", cred.user)

//             //Temporary only.
//             signOut(auth)
//                 .then(() => {
//                     console.log("User signed out.")
//                 }).catch((err) => {
//                     console.log("Logout error message: ", err);
//                 }); //auth = getAuth();
//         }).catch((err) => {
//             console.log("Sign in error: ", err);
//         });
// });

// logoutButton.addEventListener('click', () => {
    // signOut(auth)
    //     .then(() => {
    //         console.log("User signed out.")
    //     }).catch((err) => {
    //         console.log("Logout error message: ", err);
    //     }); //auth = getAuth();
// });


// const registerUser = document.getElementById("reg-goto-final");
// if (registerUser !== null) {
//     createUserWithEmailAndPassword(auth, getCookie("email"), getCookie("pass"))
//         .then((cred) => {
//             console.log('User created: ', cred.user);
//             signupForm.reset(); //reset/clear form
//         }).catch((err) => {
//             console.log("Signup error message: ", err); //e.g password is wrong or too short, invalid email, etc.
//         });
// }




// signup3.html, OK button

// var userUID = "";
let registerButtonFinal = document.getElementById("reg-goto-final");
if (registerButtonFinal !== null) {

    registerButtonFinal.addEventListener("click", () => {
        // Code here...
        createUserWithEmailAndPassword(auth, getCookie("email"), getCookie("pass"))
        .then((cred) => {
            console.log('User created: ', cred.user);
            console.log("Process done.");
        }).catch((err) => {
            console.log("Signup error message: ", err); //e.g password is wrong or too short, invalid email, etc.
        });
    });
}


// Execute this one after the signup.
// When the user is logged in.
auth.onAuthStateChanged(function(user) {
    if(user) {
        //user signed in. It is automatic after you signed up.
        let userUID = user.uid; //get the user UID for file upload
        createNewData(userUID); //create information using the current UID
        console.log("new data crated");


        // Go to checkout, final page of registration


        
        window.location = "signup4.html";
    }
    else {
        //user logged out.
    }
});

// https://stackoverflow.com/questions/70557129/how-to-add-nested-collection-in-firebase-v9
// written for firebase v8 -->
// db.collection("users")
//     .doc(user?.id)
//     .collection("orders")
//     .doc(paymentIntent.id)
//     .set({
//     basket: basket,
//     amount: paymentIntent.amount,
//     created: paymentIntent.created,
// });

// const paymentRef = doc(db, "users", user?.id, "orders", paymentIntent.id);
// setDoc(paymentRef, {
//   basket: basket,
//   amount: paymentIntent.amount,
//   created: paymentIntent.created,
// }); 


// var crypto = require("crypto");
// var newId = crypto.randomBytes(20).toString('hex');


// var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
// var stringLength = 30;

// function pickRandom() {
//     return possible[Math.floor(Math.random() * possible.length)];
// }
// var randomString = Array.apply(null, Array(stringLength)).map(pickRandom).join('');
// console.log(randomString);
// function createNewData(currentUserID) {
function createNewData(userUID) {
    setDoc(doc(db, "account-information", userUID), {
        id_number: getCookie("id"),
        first_name: getCookie("fname"),
        middle_name: getCookie("mname"),
        last_name: getCookie("lname"),
        phone_num: getCookie("phone"),
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
    });
}

// Sign Up

/***********  ACCOUNT INFORMATION ***********/
// import { doc, setDoc, Timestamp } from "firebase/firestore"; 

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