import * as fire from "../src/index";


let windowLocation = window.location.pathname;
let qrCodes = {};
let vehicleInformation = [];

if(windowLocation.indexOf("user-home") > -1) {
    console.log("home1.js was called");
    console.log("home1 auth test:", fire.auth);

    let colRefVehicle = fire.myCollection(fire.db, "vehicle-information");
    let myQRImage = document.querySelector(".qr-code-image img");
    let myQRImage2 = document.querySelector(".modal-qrcode");
    let saveQR = document.querySelector(".saveQR");


    // function getVehicleInformation(element, collectionReference) {
    function getVehicleInformation(collectionReference) {
        // get collection data
        fire.myGetDocs(collectionReference) //JS Promises
            .then((snapshot) => {
                // console.log(snapshot.docs); //docs, represent the documents
                
                snapshot.docs.forEach((doc) => {
                    vehicleInformation.push({ ...doc.data(), id: doc.id }); //... -> Spread, get all the data then the id
                });
                // console.log(vehicleInformation); //print the book array
                // console.log("vehicleInformation: ", vehicleInformation);

                console.log(vehicleInformation[0].registered_vehicle.model);
                console.log(vehicleInformation[0].registered_vehicle.plate);
                console.log("vehicleImages:", vehicleInformation[0].registered_vehicle.vehicles.images);
                console.log("qrCode:", vehicleInformation[0].registered_vehicle.vehicles.qrCode);

                

                
                localStorage.setItem("qrCodePlaceholder", vehicleInformation[0].registered_vehicle.vehicles.qrCode[0]);
                myQRImage.setAttribute("src", localStorage.getItem("qrCodePlaceholder"));
                myQRImage2.setAttribute("src", localStorage.getItem("qrCodePlaceholder"));
                // saveQR.setAttribute("src", localStorage.getItem("qrCodePlaceholder"));


                // qrCodeBlob();
                
        }).catch(err => {
            console.log("Error: ", err);
        }); //looks at the collection
    }


    // Did we download the file?
    console.log("localStorage:", localStorage.getItem("qrCodePlaceholder"));
    if(localStorage.getItem("qrCodePlaceholder") === null) {  
        getVehicleInformation(colRefVehicle);
    }
    else {
        myQRImage.setAttribute("src", localStorage.getItem("qrCodePlaceholder"));
        myQRImage2.setAttribute("src", localStorage.getItem("qrCodePlaceholder"));
        // saveQR.setAttribute("src", localStorage.getItem("qrCodePlaceholder"));
        // qrCodeBlob();
    }
    // setQRCodes();
    console.log(qrCodes)


    let saveQRImage = document.querySelector(".save");
    // fire.myGetDownloadURL(fire.myRef(fire.storage, 'vehicle-information/cjOBEg9vvUYw4vQLycSs89KUbCb2/1/qrCode.PNG}'))
    // .then((url) => {
    //     // `url` is the download URL for 'images/stars.jpg'
    //     console.log("XHR")

    //     // // Or inserted into an <img> element
    //     myQRImage.setAttribute("src", url);
    //     // const img = document.getElementById('myimg');
    //     // img.setAttribute('src', url);
    // })
    // .catch((error) => {
    //     // Handle any errors
    // });
    }



// function qrCodeBlob() {
//     fetch(localStorage.getItem("qrCodePlaceholder"))
//     .then((response) => {
//         localStorage.setItem("qrCodePlaceholderBlob", response.blob())
//     })
//     .then((blob) => {
//         console.log("Success Blob:", blob)
//     });
// }