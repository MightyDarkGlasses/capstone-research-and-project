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


import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } 
from "firebase/storage";

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
// let allImageLinks = []; //all of the images links are stored here to be uploaded ng Firebase

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

    if (user !== null) {
        if(user.emailVerified) {
            alert("Email is verified.\n Go to login page.");
        }
        else {
            console.log("Email is not yet verified.");
            alert("Please verify your e-mail first.")
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
            console.log(userId);
            createNewData(userId);
            // createVehicleImageData(userId);
        }).catch((err) => {
            console.log("Signup error message: ", err); //e.g password is wrong or too short, invalid email, etc.
        });

        // For testing.
        // createNewData("THISISATEST");
    });
}
async function createNewData(userUID) {
    let allOfMyLinks = await createVehicleImageData(userUID); //create vehicle data and send it to Firebase Storage
    // let allOfMyLinks = [];
    let qrCodeGenerated = await generateVehicleQRCode(userUID, 500);
    console.log("allOfMyLinks", allOfMyLinks);
    console.log("Afterthought: ", qrCodeGenerated);

    //Account Information (Firestore)
    await setDoc(doc(db, "account-information", userUID), {
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

    //Vehicle Information (Firestore)
    await setDoc(doc(db, "vehicle-information", userUID), {
        registered_vehicle: {
            vehicles: {
                qrCode: {
                    "0": qrCodeGenerated[0]
                },
                images: {
                    "0": allOfMyLinks
                }
            },
            // qrcode: [qrCodeGenerated],
            plate: [getCookie("plate")],
            model: [getCookie("model")]
        },
        createdAt: serverTimestamp()
    }).then(() => {
        console.log("Vehicle Information was added in the collection");
    });
}

function createVehicleImageData(userId) {
    let imageLinks = []; //STORE THE VEHICLE IMAGE LINKS HERE...
    // // vehicle-front
    // // vehicle-side
    // // vehicle-rear

    // // vehicle-front-filename
    // // vehicle-side-filename
    // // vehicle-rear-filename

  
    // // vehicle-front-filetype
    // // vehicle-side-filetype
    // // vehicle-rear-filetype
  
    // // let vehicle_front = [localStorage.getItem("vehicle-front").replace(/^data:image\/(png|jpeg);base64,/, ""), 
    // // localStorage.getItem("vehicle-front-filename"), localStorage.getItem("vehicle-front-filetype")];
    // // let vehicle_side = [localStorage.getItem("vehicle-side").replace(/^data:image\/(png|jpeg);base64,/, ""), 
    // // localStorage.getItem("vehicle-side-filename"), localStorage.getItem("vehicle-side-filetype")];
    // // let vehicle_rear = [localStorage.getItem("vehicle-rear").replace(/^data:image\/(png|jpeg);base64,/, ""), 
    // // localStorage.getItem("vehicle-rear-filename"), localStorage.getItem("vehicle-rear-filetype")];\\\


    let fileNameFront = localStorage.getItem("vehicle-front-filename");
    let fileNameSide = localStorage.getItem("vehicle-side-filename");
    let fileNameRear = localStorage.getItem("vehicle-rear-filename");
    let vehicle_front = [localStorage.getItem("vehicle-front").replace(/^data:image\/(png|jpeg);base64,/, ""), 
    "vehicleFront"+fileNameFront.substring(fileNameFront.lastIndexOf(".")), localStorage.getItem("vehicle-front-filetype")];
    let vehicle_side = [localStorage.getItem("vehicle-side").replace(/^data:image\/(png|jpeg);base64,/, ""), 
    "vehicleSide"+fileNameSide.substring(fileNameSide.lastIndexOf(".")), localStorage.getItem("vehicle-side-filetype")];
    let vehicle_rear = [localStorage.getItem("vehicle-rear").replace(/^data:image\/(png|jpeg);base64,/, ""), 
    "vehicleRear"+fileNameRear.substring(fileNameRear.lastIndexOf(".")), localStorage.getItem("vehicle-rear-filetype")];

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
    // link1 = link2 = link3 = "";
     uploadTask1.on('state_changed', (snapshot) => {
            // Progress of fileupload
            const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log("Uploading vehicle front.");
            console.log('Upload is ' + progress + '% done');    //progress of upload
        }, 
        (error) => {
            // Handle unsuccessful uploads
            console.log(error);
        }, 
        () => {
            // If successful, do this.
            getDownloadURL(uploadTask1.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                console.log(typeof(downloadURL))
                imageLinks.push(downloadURL); //append the user link (vehicle)
            });
        } //end of getDownloadURL
    ); //end of on method

     uploadTask2.on('state_changed', (snapshot) => {
            const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log("Uploading vehicle side.");
            console.log('Upload is ' + progress + '% done');    //progress of upload
        }, 
        (error) => {
            // Handle unsuccessful uploads
            console.log(error);
        }, 
        () => {
            getDownloadURL(uploadTask2.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                console.log(typeof(downloadURL))
                imageLinks.push(downloadURL);
            });
        } //end of getDownloadURL
    ); //end of on method

     uploadTask3.on('state_changed', (snapshot) => {
            const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log("Uploading vehicle rear.");
            console.log('Upload is ' + progress + '% done');    //progress of upload 
        }, 
        (error) => {
            // Handle unsuccessful uploads
            console.log(error);
        }, 
        () => {
            getDownloadURL(uploadTask3.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                console.log(typeof(downloadURL))
                imageLinks.push(downloadURL);
            });
        } //end of getDownloadURL
    ); //end of on method

    console.log("BeforeReturn_Image Links: ", imageLinks);
    return imageLinks; //return the image link of the provided image
}



async function generateVehicleQRCode(userUID, mySize) {
    // let qrCodeLink = "";
    let qrCodeLink = [];
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
    await generateQRCode(userUID, mySize);
    // console.log("generatedOutput:", generatedOutput);
    // console.log("userUID:", userUID);

    const storage = getStorage();
    const storageRef = ref(storage, `vehicle-information/${userUID}/1/qrCode.PNG`);
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
        () => {
            // If successful, do this.
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('QR Code - File available at', downloadURL);
                // qrCodeLink = downloadURL;
                // console.log("qrCodeLink generateVehicleQRCode(): DURING.", qrCodeLink)
                qrCodeLink.push(downloadURL);
            });
        } //end of getDownloadURL
    ); //end of on method
    
    
    console.log("qrCodeLink generateVehicleQRCode(): end", qrCodeLink);
    return qrCodeLink;
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
