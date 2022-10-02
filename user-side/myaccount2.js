import * as fire from "../src/index";
   

let windowLocation = window.location.pathname;

//Check if I am on the user-account.html
if(windowLocation.indexOf("user-account") > -1) {
    console.log("user.js is called.");

    let colRefAccount = fire.myCollection(fire.db, "account-information");


    // function getAccountInformation(element, collectionReference) {
    function getAccountInformation(collectionReference) {
        // get collection data
        fire.myGetDocs(collectionReference) //JS Promises
            .then((snapshot) => {
                // console.log(snapshot.docs); //docs, represent the documents
                let accountInformation = [];
                snapshot.docs.forEach((doc) => {
                    accountInformation.push({ ...doc.data(), id: doc.id }); //... -> Spread, get all the data then the id
                });
                console.log(accountInformation); //print the book array
                console.log("accountInformation: ", accountInformation);

                setPersonalInformation(`${accountInformation[0].last_name}, ${accountInformation[0].first_name} ${accountInformation[0].middle_name}`, 
                accountInformation[0].id_number,
                "Resident",
                accountInformation[0].phone_num);
                
                console.log("auth", fire.auth)
        }).catch(err => {
            console.log("Error: ", err);
        }); //looks at the collection
    }  
    

    fire.getSignInWithEmailAndPassword(fire.auth, "centteedow@gmail.com", "J123456a")
    .then((cred) => {
        console.log("User logged in:", cred.user, cred.user.email); //auth
        getAccountInformation(colRefAccount);
        getVehicleInformation(colRefVehicle);
        setAccountInformation(cred.user.email);
    }).catch((err) => {
        console.log("Sign in error: ", err);
    });


    function setPersonalInformation(name, id, cat, phone) {
        console.log("setPersonalInformation was called");
        let fullName = document.querySelector(".personal-info-fullname");
        let userid = document.querySelector(".personal-info-id");
        let category = document.querySelector(".personal-info-category");
        let phoneNum = document.querySelector(".personal-info-phonenum");

        fullName.innerText = name;
        userid.innerText = id;
        category.innerText = cat;
        phoneNum.innerText = phone;
    }
    function setAccountInformation(email) {
        console.log("setAccountInformation was called");
        let useremail = document.querySelector(".personal-info-email");
        // let password = document.querySelector(".personal-info-password");

        useremail.innerText = email;
        // password = pass;
    }
}

// console.log(fire.auth);


