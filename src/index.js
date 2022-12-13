import { initializeApp } from 'firebase/app';
import { 
    getFirestore,
    collection,
    onSnapshot,   //setup realtime listener
    getDocs,      //get document 
    addDoc,       //add new document
    deleteDoc,    //delete document
    doc,          //making references
    deleteField,
    query,      //Firestore queries, See line 62
    where,       //used by Firestore queries
    orderBy,      //used by Firestore queries, sorting data
    limit,          // limit the number of documents
    serverTimestamp,  //create timestamp stored in Firebase
    getDoc,          //grab single document
    updateDoc,        //update single document
    setDoc,
    arrayUnion,         // atomically add new element inside the array
    arrayRemove,        // atomically remove the element into the array
    increment,           // increment numeric field
} from 'firebase/firestore';

//Authentication
import {
    getAuth,
    createUserWithEmailAndPassword, //signup
    signOut, //signout the user
    signInWithEmailAndPassword, //signIn
    onAuthStateChanged,  //state change
    sendEmailVerification,
    updateProfile,
    reauthenticateWithCredential,
    signInWithCustomToken,
    updateEmail,
    updatePassword,
    sendPasswordResetEmail,
    verifyBeforeUpdateEmail,
    deleteUser,
    RecaptchaVerifier,
    multiFactor,
    PhoneAuthProvider,
    PhoneMultiFactorGenerator,
    EmailAuthProvider,
    getMultiFactorResolver
} from 'firebase/auth';


import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject } 
from "firebase/storage";

console.log("index.js is called.");
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
export const db = getFirestore(); //anything we do in our DB, we use this
export const auth = getAuth(); //utilize authentication service, (login, signup, signin)
export const storage = getStorage(); //get the firebase storage
export const doMultiFactor = multiFactor;

// const colRef1 = collection(db, 'account-information');
// const colRef2 = collection(db, 'vehicle-information');




// Only in User Account
if(window.location.pathname.indexOf("user-account") > -1) {

    onAuthStateChanged(auth, (user) => {
        const multiFactorUser = multiFactor(auth.currentUser);
        console.log("multiFactorUser", multiFactorUser)

        const display2FA = document.querySelector("#circle-message");

        if(multiFactorUser.enrolledFactors.length > 0) {
            display2FA.innerText = "2FA is active";
            $("#circle").css({backgroundColor: "rgb(1, 255, 77)"});
            $("#phone-sms-send").css("display", "none");
            $("#phone-sms-2fa-remove").css("display", "block");

            $("#mfa-title").html("- Remove SMS Multi-factor Authentication")
            $("#mfa-description").html(`You can instantly revoke the SMS Multi-factor Authentication by clicking the button below. No SMS verification is needed.`);
        }
        else {
            display2FA.innerText = "2FA is not enabled.";
            $("#circle").css({backgroundColor: "red"});
            $("#phone-sms-send").css("display", "block");
            $("#phone-sms-2fa-remove").css("display", "none");

            $("#mfa-title").html("- Enable SMS Multi-factor Authentication")
            $("#mfa-description").html(`If you have not enabled the 2FA, click the button below in order
            to verify the authenticity of your number.
            Provide the correct code in order enable the MFA.
            <br><br>
            You may be asked to reauthenticate your account by proving the account password so you can proceed to MFA.`);
        }


        
        // Present user the option to choose which factor to unenroll.
        // await multiFactorUser.unenroll(multiFactorUser.enrolledFactors[i])


        const userPhoneNumber = document.querySelector("#user-phone-number");
        const smsSend = document.querySelector("#phone-sms-send");
        smsSend.addEventListener("click", () => {
            const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container-id', {
                "size": "invisible",
                "callback": function(response) {
                    // reCAPTCHA solved, you can proceed with
                    // phoneAuthProvider.verifyPhoneNumber(...).
                    onSolvedRecaptcha();
                }
            }, auth);
            multiFactor(user).getSession()
            .then(function (multiFactorSession) {


                console.log("User phone number: ", userPhoneNumber);
                // Specify the phone number and pass the MFA session.
                const phoneInfoOptions = {
                    phoneNumber: userPhoneNumber.textContent,
                    session: multiFactorSession
                };

                const phoneAuthProvider = new PhoneAuthProvider(auth);

                // Send SMS verification code.
                console.log("Done sending SMS verification code");
                return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
            }).then(function (verificationId) {
                console.log("verificationId: ", verificationId);
                Swal.fire({
                    text: 'Enter the SMS verification code',
                    icon: 'question',
                    input: 'number',
                    showCancelButton: true,
                    confirmButtonText: 'Submit Code',
                    showLoaderOnConfirm: true,
                    preConfirm: (inputMFACode) => {
                        const cred = PhoneAuthProvider.credential(verificationId, inputMFACode);
                        const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
                        
                        console.log("Done checking verification code");
                        return multiFactor(user).enroll(multiFactorAssertion, "Phone Number").catch((error) => {
                            Swal.showValidationMessage(
                                `Error: ${error}`
                            );
                        });
                    },
                    allowOutsideClick: () => !Swal.isLoading()
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire({
                                text: `SMS Multi-Factor Authentication is enabled.`,
                                icon: 'success',
                            }).then(() => {
                                window.location.reload();
                            });
                        }
                        else {
                            Swal.fire({
                                text: `SMS Multi-Factor Authentication process is cancelled.`,
                                icon: 'error',
                            }).then(() => {
                                window.location.reload();
                            });
                        }
                    });
            }).then(() => {
                // window.location.reload();
            }).catch(async (error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            switch(errorCode) {
                case 'auth/requires-recent-login': {
                    // TODO(you): prompt the user to re-provide their sign-in credentials

                    const reauthenticatePassword = await Swal.fire({
                        icon: 'question',
                        title: 'Reauthentication required',
                        text: 'Enter your current password',
                        input: 'text',
                        showCancelButton: true,
                        confirmButtonText: 'Submit Passphrase',
                        preConfirm: (inputValue) => {
                            return inputValue;
                        }
                    });
                    
                    // console.log("verificationCode: ", verificationCode);
                    // let userProvidedPassword = window.prompt("Enter your password: ");
                    const credential = EmailAuthProvider.credential(
                        auth.currentUser.email,
                        reauthenticatePassword
                    )

                    reauthenticateWithCredential(user, credential).then(() => {
                        swal("Success!", "User reauthenticated.", "success").then((e) => {
                            // window.location.href = window.location.href; //reload a page in JS
                            location.reload();
                        });
                    }).catch((errorReauthentication) => {
                        // swal("Oops.", "Something went wrong during reauthentication!\n" + "Error code: " + errorReauthentication.code + "\nMessage: " + errorReauthentication.message, "error").then((e) => {
                        //     // window.location.href = window.location.href; //reload a page in JS
                        //     location.reload();
                        // });
                        swal("SMS Multi-factor Authentication process is cancelled." + errorReauthentication.message, "error").then((e) => {
                            // window.location.href = window.location.href; //reload a page in JS
                            location.reload();
                        });
                    });
                    break;
                }
                default: {
                    swal("Oops.", "Something went wrong!\n" + "Error code: " + errorCode + "\nMessage: " + errorMessage, "error").then((e) => {
                        // window.location.href = window.location.href; //reload a page in JS
                        location.reload();
                    });
                    console.log("Error: ", error);
                }
            }
            });
        });

        const mfaRemove = document.querySelector("#phone-sms-2fa-remove");
        mfaRemove.addEventListener("click", async () => {
            await multiFactorUser.unenroll(multiFactorUser.enrolledFactors[0]);

            Swal.fire({
                icon: 'success',
                title: 'MFA Revoked.',
                text: 'Multi-factor authentication has been removed successfully.',
            }).then((success) => {
                window.location.reload();
            });
        });
    });

    // onAuthStateChanged(auth, (user) => {
    //     // const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container-id', {
    //     //     "size": "invisible",
    //     //     "callback": function(response) {
    //     //         // reCAPTCHA solved, you can proceed with
    //     //         // phoneAuthProvider.verifyPhoneNumber(...).
    //     //         onSolvedRecaptcha();
    //     //     }
    //     // }, auth);

    //     window.recaptchaVerifier = new RecaptchaVerifier('2fa-captcha', {
    //         size: 'invisible',
    //         callback: (response) => console.log('captcha solved!', response),
    //     }, auth);

    //     // SMS Multi-Factor Authentication
    //     const getPhoneNumber = document.querySelector('#user-phone-number').value;
    //     const sendSMSVerification = document.querySelector('#phone-sms-send');
        
    //     // Asked for Phone Verification
    //     sendSMSVerification.addEventListener('click', () => {
            
    //         multiFactor(auth.currentUser).getSession()
    //             .then(function (multiFactorSession) {
    //                 // Specify the phone number and pass the MFA session.
    //                 const phoneInfoOptions = {
    //                     phoneNumber: "+639052354473",
    //                     session: multiFactorSession
    //                 };
            
    //                 const phoneAuthProvider = new PhoneAuthProvider(auth);
                    
    //                 // Send SMS verification code.
    //                 return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
    //             })
    //             .catch((error) => {
    //                 const errorCode = error.code;
    //                 const errorMessage = error.message;

    //                 switch(errorCode) {
    //                     case 'auth/requires-recent-login': {
    //                         // TODO(you): prompt the user to re-provide their sign-in credentials
    //                         let userProvidedPassword = window.prompt("Enter your password: ");
    //                         const credential = EmailAuthProvider.credential(
    //                             auth.currentUser.email,
    //                             userProvidedPassword
    //                         )

    //                         reauthenticateWithCredential(user, credential).then(() => {
    //                             swal("Success!", "User reauthenticated.", "success").then((e) => {
    //                                 // window.location.href = window.location.href; //reload a page in JS
    //                                 // location.reload();
    //                             });
    //                         }).catch((error) => {
    //                             swal("Oops.", "Something went wrong during reauthentication!\n" + "Error code: " + errorCode + "\nMessage: " + errorMessage, "error").then((e) => {
    //                                 // window.location.href = window.location.href; //reload a page in JS
    //                                 // location.reload();
    //                             });
    //                         });
    //                         break;
    //                     }
    //                     default: {
    //                         swal("Oops.", "Something went wrong!\n" + "Error code: " + errorCode + "\nMessage: " + errorMessage, "error").then((e) => {
    //                             // window.location.href = window.location.href; //reload a page in JS
    //                             // location.reload();
    //                         });
    //                         console.log("Error: ", error);
    //                     }
    //                 }
    //             });
    //     });
        
        
    //     // <input id="enroll-verify-code" value=""> 
    //     // <button id="enroll-verify-button">Verify</button>
    //     const enrollVerify = document.querySelector("#enroll-verify-code");
    //     const verifyPhoneButton = document.querySelector("#enroll-verify-button");
        
    //     verifyPhoneButton.addEventListener("click", () => {

    //         multiFactor(auth.currentUser).getSession()
    //         .then(function (verificationId) {
    //             console.log('enrollVerify: ', enrollVerify, enrollVerify.value)
    //             console.log('verificationId: ', verificationId)

    //             // Ask user for the verification code. Then:
    //             const cred = PhoneAuthProvider.credential(verificationId, "408154");
    //             const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
                
    //             // Complete enrollment.
    //             return multiFactor(auth.currentUser).enroll(multiFactorAssertion, 'phone number');
    //         }).catch((error) => {
    //             console.log('error: ', error);
    //         });

    //         // return multiFactor(user).enroll(multiFactorAssertion, mfaDisplayName);
    //     });
    // }); //end of onAuthStateChanged
}   //end of window.location.pathname
  
// Firestore
export const myGetFirestore = getFirestore;
export const myCollection = collection;
export const myOnSnapshot = onSnapshot;
export const myGetDocs = getDocs;
export const myGetDoc = getDoc;
export const myAddDoc = addDoc;
export const myDeleteDoc = deleteDoc;
export const doDeleteField = deleteField;
export const myDoc = doc;
export const myUpdateDoc = updateDoc;
export const doUpdateDoc = updateDoc;
export const doSetDoc = setDoc;
export const doUpdateProfile = updateProfile;

export const doArrayUnion = arrayUnion;
export const doArrayRemove = arrayRemove;
export const doIncrement = increment;
export const doQuery = query;
export const doWhere = where;
export const doOrderBy = orderBy;
export const doLimit = limit;


// Authentication
export const getServerTimestamp = serverTimestamp;
export const doCreateUserWithEmailAndPassword = createUserWithEmailAndPassword;
export const getCreateUserWithEmailAndPassword = createUserWithEmailAndPassword;
export const getSignOut = signOut;
export const getSignInWithEmailAndPassword = signInWithEmailAndPassword;
export const doSignInWithEmailAndPassword = signInWithEmailAndPassword;
export const getReauthenticateWithCredential = reauthenticateWithCredential;
export const getUpdateEmail = updateEmail;
export const getUpdatePassword = updatePassword;
export const getSendPasswordResetEmail = sendPasswordResetEmail;
export const getOnAuthStateChanged = onAuthStateChanged;
export const getSignInWithCustomToken = signInWithCustomToken;

export const myGetStorage = getStorage;
export const myRef = ref;
export const myUploadBytes = uploadBytes;
export const myUploadBytesResumable = uploadBytesResumable;
export const doUploadBytesResumable = uploadBytesResumable;
export const myGetDownloadURL = getDownloadURL;
export const doDeleteObject = deleteObject;
export const doVerifyBeforeUpdateEmail = verifyBeforeUpdateEmail;


// ##### User Level
export const listOfUserLevels = ["User", "Administrator", "Security Officer"];
// ##### Contexts

export const listOfPages = {
    "auth_login": "Login Page",
    "auth_signup": "Signup Page",

    "user_home": "Home",
    "user_account": "My Account",
    "user_vehicle": "Vehicle",
    "user_logs": "Logs",
    "user_announcement": "Announcements",

    "security_home": "Home",
    "security_account": "Account",
    "security_logs": "Logs",

    "admin_home": "Dashboard"
}

export const listOfActivityContext = {
    "user_created": "The account was created.",
    "user_login": "User logged in.",
    "user_logout": "User logged out",

    "user_home": "Viewing the Home/Dashboard section",
    "user_account": "Viewing the Account and Personal Information section",
    "user_vehicle": "Viewing the Vehicles and Linkages section",
    "user_logs": "Viewing the Logs section",
    "user_annouce": "Viewing the Announcements section",

    "user_update_account": "The user updated the account information.",
    "user_update_personal": "The user updated its personal information.",
    "user_update_email": "The user requested a new e-mail address",
    "user_update_pass": "The asked for a new password",

    "user_add_linkages": "The user added a new linked vehicle",
    "user_add_vehicle": "The user registered a new vehicle",

    "user_get_qr": "The user downloaded its QR code",
};


// if(window.location.pathname.indexOf("login.html") > -1) {
//     if(window.location.pathname.indexOf("user-home") > -1 ||
//     window.location.pathname.indexOf("user-account") > -1 ||
//     window.location.pathname.indexOf("user-vehicle") > -1 ||
//     window.location.pathname.indexOf("user-logs") > -1 ||
//     window.location.pathname.indexOf("user-announcement") > -1) {
//         console.log("Check user: ", user);
//         onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 if(window.location.pathname.indexOf('capstone-research-and-project') > -1) {
//                     console.log('GitHub Hosting');
//                     window.location = 'user-side/user-home.html'
//                 }
//                 else {
//                     console.log('Localhost');
//                     window.location = "../user-side/user-home.html";
//                 }
//             }
//             else {
//                 window.location = "login.html";
//             }
//         });
//     }
// }


/************** == LOGIN PAGE == ***************/
const loginForm = document.querySelector('.login'); 
// let allImageLinks = []; //all of the images links are stored here to be uploaded ng Firebase

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
// if(window.location.pathname.indexOf('login.html') > -1) {
//     localStorage.clear();
//     document.cookie = ''

//     console.log('We are on the login.html file');

//     deleteAllCookies();
//     console.log('data cleared.')
// }

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
                    // logoutUser();
                    console.log("isUserVerified:", isUserVerified());
            }).catch((err) => {
                // console.log("Sign in error: ", err);
                console.log('Error Code: ', err.code);
                console.log('Error Message: ', err.message);

                switch (err.code) {
                    case 'auth/user-not-found': {
                        $('.modal-container-main').html(`<p>This user does not exist.</p>`);
                        console.log('switch case')
                        break;
                    }
                    case 'auth/invalid-email':
                    case 'auth/wrong-password': {
                        $('.modal-container-main').html(`<p>Wrong credentials</p>`);
                        console.log('switch case')
                        break;
                    }
                    case 'auth/multi-factor-auth-required': {
                        // Ask user which second factor to use.

                        let isSMSSent = false;
                        const recaptchaVerifier = new RecaptchaVerifier("sign-in-button", {
                            "size": "invisible",
                            "callback": function(response) {
                                // reCAPTCHA solved, you can proceed with
                                // phoneAuthProvider.verifyPhoneNumber(...).
                                onSolvedRecaptcha();
                            }
                        }, auth);

                        const resolver = getMultiFactorResolver(auth, err);
                        console.log("resolver: ", resolver)

                        if (resolver.hints[0].factorId ===
                            PhoneMultiFactorGenerator.FACTOR_ID) {
                            const phoneInfoOptions = {
                                multiFactorHint: resolver.hints[0],
                                session: resolver.session
                            };
                            const phoneAuthProvider = new PhoneAuthProvider(auth);
                            // Send SMS verification code
                            return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier)
                            .then(async function (verificationId) {

                                const verificationCode = await Swal.fire({
                                    icon: 'question',
                                    text: 'Enter your SMS verification code',
                                    input: 'number',
                                    showCancelButton: true,
                                    confirmButtonText: 'Verify MFA Code',
                                    preConfirm: (inputValue) => {
                                        return inputValue;
                                    }
                                });
                                console.log("verificationCode: ", verificationCode);
                                
                                // Ask user for the SMS verification code. Then:
                                const cred = PhoneAuthProvider.credential(
                                    verificationId, verificationCode.value);
                                const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
                                // Complete sign-in.
                                return resolver.resolveSignIn(multiFactorAssertion)
                            })
                            .then(function (userCredential) {
                                console.log(userCredential)
                                console.log("User successfully signed in with the second factor phone number.");
                                checkCurrentLoggedUser();
                            }).catch((errorPhoneAuth) => {
                                switch(errorPhoneAuth.code) {
                                    case "auth/missing-code": {
                                        Swal.fire({
                                            icon: 'error',
                                            text: 'SMS Multi-Factor Authentication process is cancelled.',
                                        }).then(() => {
                                            window.location.reload();
                                        });
                                        break;
                                    }
                                    default: {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'An error occured.',
                                            text: `${errorPhoneAuth.message}`,
                                        });
                                        console.log("phoneAuthProvider: ", errorPhoneAuth, ": ", errorPhoneAuth.code, ": ", errorPhoneAuth.message)
                                    }
                                }
                            });
                        } else {
                            // Unsupported second factor.
                        }
                    }
                    default: {  
                        console.log('switch default');
                        console.log("Error: ", err, ": ", err.code, ": ", err.message)
                    }
                }

                $("#error-popup").modal({
                    fadeDuration: 100
                });
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


    // Is user verified
    if (user !== null) {
        if(user.emailVerified) {
            // alert("Email is verified.\n Go to login page.");

            //Store the logged user into the local storage for future reference
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('currentUserId', user.uid);
            
            // Add activity when user is logged in.
            addActivity(user.uid, listOfUserLevels[0], listOfPages["auth_login"], listOfActivityContext["user_login"])
            .then((success) => {
                if(window.location.pathname.indexOf('capstone-research-and-project') > -1) {
                    console.log('GitHub Hosting');
                    window.location = 'user-side/user-home.html'
                }
                else {
                    console.log('Localhost');
                    window.location = "../user-side/user-home.html";
                }
            });
            
            if(window.location.pathname.indexOf('capstone-research-and-project') > -1) {
                console.log('GitHub Hosting');
                window.location = 'user-side/user-home.html'
            }
            else {
                console.log('Localhost');
                window.location = "../user-side/user-home.html";
            }

        }
        else {
            console.log("Email is not yet verified.");
            // alert("Please verify your e-mail first.");
            sendVerification();

            $('.modal-container-main').html(`<p>The email is not yet verified.</p>
            <p class="note"><i>Note: Check your <b>Spam</b> section to verify your email.</i></p>`);
            $("#error-popup").modal({
                fadeDuration: 100
            });
            logoutUser();
        }
    }
    return;
}

// function getUserUID() {
//     return getAuth().currentUser.uid;
// }
function isUserVerified() {
    // true -> the user is verified
    // false -> not yet. need to confirm by checking the Spam mail inbox.
    return getAuth().currentUser.emailVerified;
}


export function logoutUser() {
    //Temporary only.
    signOut(auth)
        .then(() => {
            console.log('check logged user:', auth)
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

// Variables for vehicle image links and QR code
let imageLinks = [];
let qrCodeLink = [];

/*
createUserWithEmailAndPassword(auth, getCookie("email"), getCookie("pass"))
        .then((cred) => {
            //
        }).then((success) => {

        }).catch((err) => {
});
*/

if (registerButtonFinal !== null && registerButtonFinal !== undefined) { 
    registerButtonFinal.addEventListener("click", () => {
        createUserWithEmailAndPassword(auth, getCookie("email"), getCookie("pass"))
        .then((cred) => {
            console.log('User created: ', cred.user);
            const userId = getCurrentLoggedUserUID();
            // console.log(userId);
            // createNewData(userId);

            let decisions = localStorage.getItem('vehicle-front') === null || localStorage.getItem('vehicle-side') === null 
            || localStorage.getItem('vehicle-rear') === null;
            console.log('decisions: ', decisions)

            if(!decisions) {
                console.log('create new vehicle data')
                createVehicleImageData(userId);
            }
            else {
                createNewData(userId, false);
            }
            // createVehicleImageData(userId);
        }).then((success) => {
            console.log('registration successful!');
            // window.location = "signup4.html";
        }).catch((err) => {
            console.log("Signup error message: ", err); //e.g password is wrong or too short, invalid email, etc.
        });
    });
}
async function createNewData(userUID, flag) {
    let windowLocation = window.location.pathname;
    if(windowLocation.indexOf("signup") > -1) {
    
    
    // let allOfMyLinks = await createVehicleImageData(userUID); //create vehicle data and send it to Firebase Storage
    // let qrCodeGenerated = await generateVehicleQRCode(userUID, getCookie("plate"), 500);


    //Account Information (Firestore)
    // Uncomment these...

    console.log('imageLinks: ', imageLinks);
    console.log('qrCodeLink: ', qrCodeLink);
    console.log('qrCodeLink[0]: ', qrCodeLink[0]);
    const promiseAccount = await setDoc(doc(db, "account-information", userUID), {
        id_number: getCookie("id"),
        first_name: getCookie("fname"),
        middle_name: getCookie("mname"),
        last_name: getCookie("lname"),
        phone_num: getCookie("phone"),
        is_activated: false,
        email: getCookie("email"),
        category: getCookie("usertype"),
        createdAt: serverTimestamp(),
        last_login: serverTimestamp(),
        profile_pic: null,
        college: null,
    }).then(() => {
        console.log("Account Information was added in the collection");
    });
    
    // Vehicle Information (Firestore)



    console.log('flag:', flag)
    // flag -> if we have the vehicle uploaded or not
    if(flag) {
        // let imageLinks = [];
        // let qrCodeLink = [];

        console.log('imageLinks:', imageLinks);
        console.log('qrCodeLink:', qrCodeLink);

        const promiseVehicle = await setDoc(doc(db, "vehicle-information", userUID), {
            [getCookie("plate").replace(" ", "")]: {
                qrCode: qrCodeLink,
                images: imageLinks,
                model: [getCookie("model")],
                use_types: 'Private',
                createdAt: serverTimestamp(),
                classification: null,
                manufacturer: null,
                color: null,
                year: null,
                license_code: null,
                code_category: null,
                remarks: null,
            },
            vehicle_length: 1,
        }).then(() => {
            console.log("Vehicle Information was added in the collection");
        });
        await Promise.all([promiseAccount, promiseVehicle]).then((success) => {
            console.log("Sucessfully done the promises");
            deleteAllCookies();
            localStorage.clear();

            sendVerification();
            logoutUser();
            console.log('All promises are done!');
            window.location = "signup4.html";
        });

        // Send e-mail verification, to be later verify by user.
        // const promiseEmailVerification = sendEmailVerification(user)
        // .then(() => {
        //     console.log("User verification was sent.")
        //     console.log('Everything is all set up!');
        // });
        // const promiseSignOut = signOut(auth)
        // .then(() => {
        //     console.log('check logged user:', auth)
        //     console.log("User signed out.")
        // }).catch((err) => {
        //     console.log("Logout error message: ", err);
        // });
    }
    else {
        // Uncomment these...
        console.log('else statement')
        const promiseVehicle = setDoc(doc(db, "vehicle-information", userUID), {
            // registered_vehicle: {
            //     vehicles: {
            //         qrCode: [],
            //         images: {},
            //         linkages: {}
            //     },
            //     plate: [],
            //     model: [],
            //     use_types: []
            // },
            // vehicle_length: 0,
            // createdAt: serverTimestamp()
            vehicle_length: 0,
        }).then(() => {
            console.log("Vehicle Information was added in the collection");
        });


        Promise.all([promiseAccount, promiseVehicle]).then((success) => {
            console.log("Sucessfully done the promises");
            
            deleteAllCookies();
            localStorage.clear();

            sendVerification();
            logoutUser();
            console.log('All promises are done!');
            window.location = "signup4.html";
        });
        // Promise.all([promiseAccount, promiseVehicle]).then((success) => {
        //     deleteAllCookies();
        //     localStorage.clear();
        //     sendVerification();
        //     logoutUser();
        //     window.location = "signup4.html";
        //     console.log('Everything is all set up!');
        // });
    }

    // function doPrint() {
    //     console.log('allOfMyLinks:', allOfMyLinks);
    //     console.log('allOfMyLinks[0]:', allOfMyLinks[0]);
    //     console.log('allOfMyLinks[1]:', allOfMyLinks[1]);
    //     console.log('allOfMyLinks[2]:', allOfMyLinks[2]);
    
    //     console.log("localStorage uploadImage1", localStorage.uploadImage1);
    //     console.log("localStorage uploadImage2", localStorage.uploadImage2);
    //     console.log("localStorage uploadImage3", localStorage.uploadImage3);
    
    //     console.log('a-b-c:', ['a', 'b', 'c']);
    //     console.log('localStorage qrCodeLink:', localStorage.getItem('qrCodeLink'));
    
    //     console.log('vehicle-information', db, userUID, allOfMyLinks);
    //     console.log('qrCodeGenerated', qrCodeGenerated);
    // }


    // Promise.all([promiseAccount, promiseVehicle]).then((success) => {
    //     function deleteAllCookies() {
    //         var cookies = document.cookie.split(";");
        
    //         for (var i = 0; i < cookies.length; i++) {
    //             var cookie = cookies[i];
    //             var eqPos = cookie.indexOf("=");
    //             var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    //             document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    //         }
    //     }
    
    //     // deleteAllCookies();
    //     // localStorage.clear();
    //     // window.location = "signup4.html";
    //     console.log('Everything is all set up!');
    // });

    } //if statement, are we on signup.html
}

export function createVehicleImageData(userId) {
    if(localStorage.getItem("vehicle-front") === null || 
        localStorage.getItem("vehicle-side") === null ||
        localStorage.getItem("vehicle-rear") === null) {
            console.log("Skipped, no image was uploaded");
    }
    else {
        let fileNameFront = localStorage.getItem("vehicle-front-filename");
        let fileNameSide = localStorage.getItem("vehicle-side-filename");
        let fileNameRear = localStorage.getItem("vehicle-rear-filename");
        let vehicle_front = [localStorage.getItem("vehicle-front").replace(/^data:image\/(png|jpeg);base64,/, ""), 
        "vehicleFront0"+fileNameFront.substring(fileNameFront.lastIndexOf(".")), localStorage.getItem("vehicle-front-filetype")];
        let vehicle_side = [localStorage.getItem("vehicle-side").replace(/^data:image\/(png|jpeg);base64,/, ""), 
        "vehicleSide0"+fileNameSide.substring(fileNameSide.lastIndexOf(".")), localStorage.getItem("vehicle-side-filetype")];
        let vehicle_rear = [localStorage.getItem("vehicle-rear").replace(/^data:image\/(png|jpeg);base64,/, ""), 
        "vehicleRear0"+fileNameRear.substring(fileNameRear.lastIndexOf(".")), localStorage.getItem("vehicle-rear-filetype")];
    
        const storage = getStorage();
        let blobVehicleFront, blobVehicleSide, blobVehicleRear;
        blobVehicleFront = base64ToBlob(vehicle_front[0], vehicle_front[2]);  
        blobVehicleSide = base64ToBlob(vehicle_side[0], vehicle_side[2]);  
        blobVehicleRear = base64ToBlob(vehicle_rear[0], vehicle_rear[2]);  
    
        // Uncomment 318 - 397
        const metadataFront = { contentType: vehicle_front[2], };
        const metadataSide = { contentType: vehicle_side[2], };
        const metadataRear = { contentType: vehicle_rear[2], };
    
        const storageRef1 = ref(storage, `vehicle-information/${userId}/1/${vehicle_front[1]}`);
        const storageRef2 = ref(storage, `vehicle-information/${userId}/1/${vehicle_side[1]}`);
        const storageRef3 = ref(storage, `vehicle-information/${userId}/1/${vehicle_rear[1]}`);
        
        const uploadTask1 = uploadBytesResumable(storageRef1, blobVehicleFront, metadataFront);
        const uploadTask2 = uploadBytesResumable(storageRef2, blobVehicleSide, metadataSide);
        const uploadTask3 = uploadBytesResumable(storageRef3, blobVehicleRear, metadataRear);
        
        // Upload image (front view)
        var promise1 = uploadTask1.on('state_changed', (snapshot) => {
                // Progress of fileupload
                const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log("Uploading vehicle front.");
                console.log('Upload is ' + progress + '% done');    //progress of upload
            }, 
            (error) => {
                // Handle unsuccessful uploads
                console.log(error);
            }, 
            (success) => {
                // If successful, do this.
                getDownloadURL(uploadTask1.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    console.log(typeof(downloadURL))
                    imageLinks.push(downloadURL); //append the user link (vehicle)
                    // localStorage.setItem('uploadImage1', downloadURL);
                });
            } //end of getDownloadURL
        ); //end of on method
        var promise2 = uploadTask2.on('state_changed', (snapshot) => {
                const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log("Uploading vehicle side.");
                console.log('Upload is ' + progress + '% done');    //progress of upload
            }, 
            (error) => {
                // Handle unsuccessful uploads
                console.log(error);
            }, 
            (success) => {
                getDownloadURL(uploadTask2.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    console.log(typeof(downloadURL))
                    imageLinks.push(downloadURL); //append the user link (vehicle)
                });
            } //end of getDownloadURL
        ); //end of on method  
        var promise3 = uploadTask3.on('state_changed', (snapshot) => {
                const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log("Uploading vehicle rear.");
                console.log('Upload is ' + progress + '% done');    //progress of upload 
            }, 
            (error) => {
                // Handle unsuccessful uploads
                console.log(error);
            }, 
            (success) => {
                getDownloadURL(uploadTask3.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    console.log(typeof(downloadURL));
                    imageLinks.push(downloadURL); //append the user link (vehicle)
                });
            } //end of getDownloadURL
        ); //end of on method
        
        //Wait for everything to be uploaded.
        Promise.all([uploadTask1, uploadTask2, uploadTask3]).then((output) => {
            console.log("All uploaded done.")
            console.log(output);
            generateVehicleQRCode(userId, getCookie("plate"), 500);
        });
        console.log("BeforeReturn_Image Links: ", imageLinks);
    }
    return; //return the image link of the provided image
}

async function generateVehicleQRCode(userUID, plateNumber, mySize) {
    // let qrCodeLink = "";
    let generatedOutput;

    
    const generateQRCode = (text, size) => {
        const qrcode = new QRCode('qrcode', {
            text: text,
            width: size,
            height: size,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H,
            addQuietZone: true
        })
        generatedOutput = qrcode._oDrawing._elCanvas.toDataURL("image/png");
    };

    let qrCodeDataObject = {
        'uid': userUID,
        'plate_number': plateNumber.replace(" ", "")
    }
    console.log('qrCodeDataObject', JSON.stringify(qrCodeDataObject))

    await generateQRCode(JSON.stringify(qrCodeDataObject), mySize);

    //  USE THIS FOR GENERATING OBJECT
    const storage = getStorage();
    const storageRef = ref(storage, `vehicle-information/${userUID}/0/qrCode0.PNG`);
    let qrCodeBlob = await base64ToBlob((generatedOutput.replace(/^data:image\/(png|jpeg);base64,/, "")), "image/png");
    const uploadTask = uploadBytesResumable(storageRef, qrCodeBlob, "image/png");
    
    uploadTask.on('state_changed', 
        async (snapshot) => {
            // Progress of fileupload
            const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log("Uploading qr code vehicle");
            console.log('Upload is ' + progress + '% done');    //progress of upload
        }, 
        (error) => {
            // Handle unsuccessful uploads
            console.log(error);
        }, 
        (success) => {
            // If successful, do this.
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('QR Code - File available at', downloadURL);
                qrCodeLink.push(downloadURL);
                console.log('qrCodeLink pushed', qrCodeLink);

                console.log('QR Code done.');
                console.log('userUID:', userUID)
                createNewData(userUID, true);
            });
        } //end of getDownloadURL
    ); //end of on method
}

export async function exportGenerateVehicleQRCode(userUID, plateNumber, mySize, index) {
    // Check if the index parameter is given, if not then given it a default value
    if (typeof(index)==='undefined') index = "1";
    let generatedOutput;
    const generateQRCode = (text, size) => {
        const qrcode = new QRCode('qrcode', {
            text: text,
            width: size,
            height: size,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H,
            quietZone: true
        });
        generatedOutput = qrcode._oDrawing._elCanvas.toDataURL("image/png");
    };

    let qrCodeDataObject = {
        'uid': userUID,
        'plate_number': plateNumber.replace(" ", "")
    }

    await generateQRCode(JSON.stringify(qrCodeDataObject), mySize);
    const storage = getStorage();
    const storageRef = ref(storage, `vehicle-information/${userUID}/${index}/qrCode0.PNG`);
    let qrCodeBlob = await base64ToBlob((generatedOutput.replace(/^data:image\/(png|jpeg);base64,/, "")), "image/png");
    const uploadTask = uploadBytesResumable(storageRef, qrCodeBlob, "image/png");
    
    uploadTask.on('state_changed', 
        async (snapshot) => {
            // Progress of fileupload
            const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log("Uploading qr code vehicle");
            console.log('Upload is ' + progress + '% done');    //progress of upload
        }, 
        (error) => {
            // Handle unsuccessful uploads
            console.log(error);
        }, 
        (success) => {
            // If successful, do this.
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('QR Code - File available at', downloadURL);
                const strDownloadURL = downloadURL;
                return strDownloadURL;
            });
        } //end of getDownloadURL
    ); //end of uploadTask
    return "";
} //end of exportGenerateVehicleQRCode

// Convert base64 (generated by FileReader) into Blob (which is supported by Firebase Storage)
function base64ToBlob(base64, mime) 
{
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        var slice = byteChars.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: mime});
}


/********** END OF REGISTER THE USER **********/
/********** END OF REGISTER THE USER **********/
/********** END OF REGISTER THE USER **********/

let windowLocation = window.location.pathname;

if(windowLocation.indexOf('signup4') > -1) {
    let finalVerifyEmail = document.querySelector('#reg-goto-final-verifyemail');
    finalVerifyEmail.addEventListener('click', () => {
        window.location = 'index.html';
    });
}

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



// ##### Add Activity
export async function addActivity(userUID, userLevel, currentPage, activityContext) {
    // const dateMS = Date.now();

    // const colRef = collection(db, "system-activity");
    // const linkagesQuery = query(colRef, doLimit(10));
    // const docsSnap = await getDoc(linkagesQuery);

    const docRefActivity = doc(db, "system-activity", userUID);
    const docSnap = await getDoc(docRefActivity);

    console.log('exists: ', docSnap.exists())
    //"system-activity" collection exists?
    if (docSnap.exists()) {
        const getIndex = docSnap.data().index;

        console.log('getIndex', getIndex)
        const activityData = {
            [getIndex+1]: {
                "timestamp": new Date().toString(),
                "user_level": userLevel,
                "current_page": currentPage,
                "user_info": doc(db, '/account-information/' + userUID),
                "uid": userUID,
                "context": activityContext
            },
            index: increment(1)
        };

        await updateDoc(doc(db, "system-activity", userUID), activityData);
    }
    else {
        console.log("Create a new log.");
        // Create a new visitor logs information object.
        const activityData = {
            1: {
                "timestamp": new Date().toString(),
                "user_level": userLevel,
                "current_page": currentPage,
                "user_info": doc(db, '/account-information/' + userUID),
                "uid": userUID,
                "context": activityContext
            },
            index: 1
        };
        await setDoc(docRefActivity, activityData);
    }
} //end of function, addNewLogs


export async function deleteUserData(userUID) {
    const auth = getAuth();
    const user = auth.currentUser;

    console.log('delete auth', auth)
    console.log('delete user', user)
    deleteUser(user).then(async () => {
        // User deleted.

        const delete1 = await deleteDoc(doc(db, "account-information", userUID));
        const delete2 = await deleteDoc(doc(db, "vehicle-information", userUID));
        const delete3 = await deleteDoc(doc(db, "linkages", userUID));
        const delete4 = await deleteDoc(doc(db, "logs", userUID));
        const delete5 = await deleteDoc(doc(db, "system-activity", userUID));
        Promise.all([delete1,delete2,delete3,delete4,delete5]).then((e) => {
            window.location = 'index.html';
        });

        console.log('Account deleted: ', error);
    }).catch((error) => {
        // An error ocurred
        // ...
        console.log('An error occured: ', error);
    });

    
}


// SbS0eEu4gyCWRiAGplLq 
// addActivity("123", listOfUserLevels[0], listOfPages["auth_login"], listOfActivityContext["user_login"]);