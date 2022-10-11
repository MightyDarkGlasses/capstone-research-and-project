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
    updateProfile,
    reauthenticateWithCredential,
    signInWithCustomToken,
    updateEmail,
    updatePassword,
    sendPasswordResetEmail,
    verifyBeforeUpdateEmail
} from 'firebase/auth';


import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } 
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
// const colRef1 = collection(db, 'account-information');
// const colRef2 = collection(db, 'vehicle-information');

//exports

// Firestore
export const myGetFirestore = getFirestore;
export const myCollection = collection;
export const myOnSnapshot = onSnapshot;
export const myGetDocs = getDocs;
export const myAddDoc = addDoc;
export const myDeleteDoc = deleteDoc;
export const myDoc = doc;
export const myUpdateDoc = updateDoc;

// Authentication
export const getCreateUserWithEmailAndPassword = createUserWithEmailAndPassword;
export const getSignOut = signOut;
export const getSignInWithEmailAndPassword = signInWithEmailAndPassword;
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
export const myGetDownloadURL = getDownloadURL;
export const doVerifyBeforeUpdateEmail = verifyBeforeUpdateEmail;
// Authentication check.
// console.log(auth);


/************** == LOGIN PAGE == ***************/
/************** == LOGIN PAGE == ***************/
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
if(window.location.pathname.indexOf('login.html') > -1) {
    localStorage.clear();
    document.cookie = ''

    console.log('We are on the login.html file');

    deleteAllCookies();
    console.log('data cleared.')
}

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


    // Is user verified
    if (user !== null) {
        if(user.emailVerified) {
            // alert("Email is verified.\n Go to login page.");

            //Store the logged user into the local storage for future reference
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('currentUserId', user.uid);


            if(window.location.pathname.indexOf('mightydarkglasses.github.io') > -1) {
                window.location = '/user-side/user-home.html'
            }
            else {
                // window.location = "../user-side/user-home.html";
            }

        }
        else {
            console.log("Email is not yet verified.");
            alert("Please verify your e-mail first.");
            // sendVerification();
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
            console.log("User signed out.")
            console.log('check logged user:', fire.auth)
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

        // createNewData("7fjUF7uqknYbx0EvVruxgFWxizq1");
        
        // For testing.
        // createNewData("THISISATEST");
    });
}
function createNewData(userUID, flag) {
    let windowLocation = window.location.pathname;
    if(windowLocation.indexOf("signup") > -1) {
    
    
    // let allOfMyLinks = await createVehicleImageData(userUID); //create vehicle data and send it to Firebase Storage
    // let qrCodeGenerated = await generateVehicleQRCode(userUID, getCookie("plate"), 500);


    //Account Information (Firestore)
    // Uncomment these...

    console.log('imageLinks: ', imageLinks);
    console.log('qrCodeLink: ', qrCodeLink);
    console.log('qrCodeLink[0]: ', qrCodeLink[0]);
    const promiseAccount = setDoc(doc(db, "account-information", userUID), {
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
    
    // Vehicle Information (Firestore)



    console.log('flag:', flag)
    // flag -> if we have the vehicle uploaded or not
    if(flag) {
        // let imageLinks = [];
        // let qrCodeLink = [];

        console.log('imageLinks:', imageLinks);
        console.log('qrCodeLink:', qrCodeLink);

        const promiseVehicle = setDoc(doc(db, "vehicle-information", userUID), {
            registered_vehicle: {
                vehicles: {
                    qrCode: qrCodeLink,
                    images: {
                        0: imageLinks
                    }
                },
                // qrcode: [qrCodeGenerated],
                plate: [getCookie("plate")],
                model: [getCookie("model")],
                use_types: ['Private']
            },
            vehicle_length: 1,
            createdAt: serverTimestamp()
        }).then(() => {
            console.log("Vehicle Information was added in the collection");
        });

        Promise.all([promiseAccount, promiseVehicle]).then((success) => {
            deleteAllCookies();
            localStorage.clear();
            sendVerification();
            logoutUser();
            window.location = "signup4.html";
            console.log('Everything is all set up!');
        });
    }
    else {
        // Uncomment these...
        const promiseVehicle = setDoc(doc(db, "vehicle-information", userUID), {
            registered_vehicle: {
                vehicles: {
                    qrCode: [],
                    images: {
                        0: []
                    }
                },
                plate: [],
                model: [],
                use_types: []
            },
            vehicle_length: 0,
            createdAt: serverTimestamp()
        }).then(() => {
            console.log("Vehicle Information was added in the collection");
        });

        Promise.all([promiseAccount, promiseVehicle]).then((success) => {
            deleteAllCookies();
            localStorage.clear();
            sendVerification();
            logoutUser();
            window.location = "signup4.html";
            console.log('Everything is all set up!');
        });
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


// let promise1, promise2, promise3, promise4; //all of the promises


function createVehicleImageData(userId) {
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


//generateVehicleQRCode(userUID, getCookie("plate"), 500)
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
            correctLevel : QRCode.CorrectLevel.H
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
    
    // console.log("generatedOutput:", generatedOutput);
    // console.log("userUID:", userUID);

    const storage = getStorage();
    const storageRef = ref(storage, `vehicle-information/${userUID}/1/qrCode0.PNG`);
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
    // Promise.all([uploadTask]).then(() => {
    //     console.log('QR Code done.');
    //     console.log('userUID:', userUID)
    //     createNewData(userUID, true);
    // });
}

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


// let verificationPage = document.getElementById("verification-page");
// if (verificationPage !== null && verificationPage !== undefined) {
//     window.onload = function() {
//         sendVerification();
//         console.log("An email verification was send successfully.");
//     }
// }


let windowLocation = window.location.pathname;
// if(windowLocation.indexOf("signup4") > -1) {
//     console.log(getAuth());
//     // Send e-mail verification, to be later verify by user.
//     // sendEmailVerification(getAuth().currentUser)
//     //   .then(() => {
//     //     console.log("User verification was sent.")
//     //     alert("User verification was sent.")
//     // });
// }

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



/*********** START OF USER ACCOUNT ************/
/*********** START OF USER ACCOUNT ************/
/*********** START OF USER ACCOUNT ************/



/*********** END OF USER ACCOUNT ************/
/*********** END OF USER ACCOUNT ************/
/*********** END OF USER ACCOUNT ************/