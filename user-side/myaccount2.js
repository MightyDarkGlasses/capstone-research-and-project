import { doc } from "firebase/firestore";
import * as fire from "../src/index";
   

let windowLocation = window.location.pathname;

//Check if I am on the user-account.html
if(windowLocation.indexOf("user-account") > -1) {
    console.log("user.js is called.");
    
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));  // convert the JSON from logged user
    let currentUserId = localStorage.getItem('currentUserId');          // get logged user uid
    console.log('currentUser:', currentUser);
    
    
    
    // let colRefAccount = fire.myCollection(fire.db, `account-information/${currentUserId}`);
    const docRefAccount = fire.myDoc(fire.db, "account-information", currentUserId);


    let fullName = document.querySelector(".personal-info-fullname");
    let userid = document.querySelector(".personal-info-id");
    let category = document.querySelector(".personal-info-category");
    let phoneNum = document.querySelector(".personal-info-phonenum");
    let useremail = document.querySelector(".personal-info-email");
    //getAccountInformation(colRefAccount);

    if(!isAny(localStorage.getItem("personal_info_name"), localStorage.getItem("personal_info_id"), 
        localStorage.getItem("personal_info_cat"), localStorage.getItem("personal_info_phone", 
        localStorage.getItem("personal_info_email")))) 
    {
        // getAccountInformation(colRefAccount); //get my information
        getAccountInformation(docRefAccount); //get my information
    }
    else {
        displayInformation();
    }

    

    // /const docRef = fire.myDoc(fire.db, "vehicle-information", currentUserId);

    //getDoc()
    function getAccountInformation(docReference) {
        //detect changes in database
        fire.myOnSnapshot(docReference, (doc) => {
            console.log("getAccountInformation", doc.data(), doc.id);
            let accountInformation = {...doc.data()};
            // console.log(accountInformation)

            localStorage.setItem("personal_info_name", `${accountInformation.last_name}, ${accountInformation.first_name} ${accountInformation.middle_name}`);
            localStorage.setItem("personal_info_id",   `${accountInformation.id_number}`);
            localStorage.setItem("personal_info_cat",  `Nothing`);
            localStorage.setItem("personal_info_phone",`${accountInformation.phone_num}`);
            localStorage.setItem('personal_info_email', currentUser.email)
            displayInformation();
            // console.log(localStorage.getItem("personal_info_name"));
            // console.log(localStorage.getItem("personal_info_id"));
            // console.log(localStorage.getItem("personal_info_cat"));
            // console.log(localStorage.getItem("personal_info_phone"));
            // console.log(localStorage.getItem("personal_info_email"));

        });
    }

    function displayInformation() {
        console.log("cookies time")
        console.log(localStorage.getItem("personal_info_email"))
        fullName.innerText = localStorage.getItem("personal_info_name");
        userid.innerText   = localStorage.getItem("personal_info_id");
        category.innerText = localStorage.getItem("personal_info_cat");
        phoneNum.innerText = localStorage.getItem("personal_info_phone");
        useremail.innerText = localStorage.getItem("personal_info_email");
    }
    // function getAccountInformation(collectionReference) {
    //     // get collection data
    //     fire.myGetDocs(collectionReference) //JS Promises
    //         .then((snapshot) => {
    //             // console.log(snapshot.docs); //docs, represent the documents
    //             let accountInformation = [];
    //             snapshot.docs.forEach((doc) => {
    //                 accountInformation.push({ ...doc.data(), id: doc.id }); //... -> Spread, get all the data then the id
    //             });
    //             // console.log(accountInformation); //print the book array
    //             // console.log("accountInformation: ", accountInformation);
    //             localStorage.setItem("personal_info_name", `${accountInformation[0].last_name}, ${accountInformation[0].first_name} ${accountInformation[0].middle_name}`);
    //             localStorage.setItem("personal_info_id",   `${accountInformation[0].id_number}`);
    //             localStorage.setItem("personal_info_cat",  `Nothing`);
    //             localStorage.setItem("personal_info_phone",`${accountInformation[0].phone_num}`);
    //             localStorage.setItem('personal_info_email', email)
    //     }).catch(err => {
    //         console.log("Error: ", err);
    //     }); //looks at the collection
    // }  
    

    // fire.getSignInWithEmailAndPassword(fire.auth, "centteedow@gmail.com", "J123456a")
    // .then((cred) => {
    //     console.log("User logged in:", cred.user, cred.user.email); //auth
    //     getAccountInformation(colRefAccount);
    //     // setAccountInformation(cred.user.email);
    // }).catch((err) => {
    //     console.log("Sign in error: ", err);
    // });


    // console.log(localStorage.getItem("asdfasfd")) // return null
    // localStorage.setItem("personal_info_name", name);
    // localStorage.setItem("personal_info_id", id);
    // localStorage.setItem("personal_info_cat", cat);
    // localStorage.setItem("personal_info_phone", phone);


    // function setAccountInformation(email) {
    //     console.log("setAccountInformation was called");

    // }

    function isAny(...args) {
        for (var i = 1; i < arguments.length; ++i)
          if (arguments[i] === null) return false;
        return true;
    }

    let logoutUser = document.querySelector('.util-icon-logout');
    logoutUser.addEventListener('click', () => {
        console.log("this is a test.");
        localStorage.clear();
        window.location = '../login.html';
    });
} //end of link checking, windowLocation.indexOf("user-account") > -1