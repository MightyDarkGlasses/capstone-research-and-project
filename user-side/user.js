import * as fire from "../src/index";
   
let colRefAccount = fire.myCollection(fire.db, "account-information");
let colRefVehicle = fire.myCollection(fire.db, "vehicle-information");

// console.log("user.js is called.");
// console.log(fire.auth);


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
    }).catch(err => {
        console.log("Error: ", err);
    }); //looks at the collection
}  

// function getVehicleInformation(element, collectionReference) {
function getVehicleInformation(collectionReference) {
      // get collection data
      fire.myGetDocs(collectionReference) //JS Promises
          .then((snapshot) => {
              // console.log(snapshot.docs); //docs, represent the documents
              let vehicleInformation = [];
              snapshot.docs.forEach((doc) => {
                  vehicleInformation.push({ ...doc.data(), id: doc.id }); //... -> Spread, get all the data then the id
              });
              console.log(vehicleInformation); //print the book array
              console.log("vehicleInformation: ", vehicleInformation);
      }).catch(err => {
          console.log("Error: ", err);
      }); //looks at the collection
}


fire.getSignInWithEmailAndPassword(fire.auth, "centteedow@gmail.com", "J123456a")
.then((cred) => {
    console.log("User logged in:", cred.user);
    getAccountInformation(colRefAccount);
    getVehicleInformation(colRefVehicle);

}).catch((err) => {
    console.log("Sign in error: ", err);
});