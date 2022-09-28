// Execute this one after the signup.
// When the user is logged in.
// auth.onAuthStateChanged(function(user) {
//     if(user) {
//         //user signed in. It is automatic after you signed up.
//         let userUID = user.uid; //get the user UID for file upload
//         createNewData(userUID); //create information using the current UID
//         console.log("new data crated");
//         window.location = "signup4.html";
//     }
//     else {
//         //user logged out.
//     }
// });

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

/** RANDOM STRING/ID GENERATOR */
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



// Sign Up

/***********  ACCOUNT INFORMATION ***********/
// import { doc, setDoc, Timestamp } from "firebase/firestore"; 




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