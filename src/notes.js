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