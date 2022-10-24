import * as fire from "../src/index";


let windowLocation = window.location.pathname;
let qrCodes = {};
let vehicleInformation = [];

if(windowLocation.indexOf("user-home") > -1) {
    // console.log("home1.js was called");
    // console.log("home1 auth test:", fire.auth);

    // console.log("getCurrentUser:",  localStorage.getItem('currentUser'));
    // console.log("currentUserId:",  localStorage.getItem('currentUserId'));

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));  // convert the JSON from logged user
    let currentUserId = localStorage.getItem('currentUserId');          // get logged user uid

    // let colRefVehicle = fire.myCollection(fire.db, `vehicle-information`); //collectionReference
    const docRefVehicle = fire.myDoc(fire.db, "vehicle-information", currentUserId);
    let myQRImage = document.querySelector(".qr-code-image img");
    let myQRImage2 = document.querySelector(".modal-qrcode");
    let saveQR = document.querySelector(".saveQR");
    let vehi = '';
    

    
    const auth = fire.auth;
    console.log("home_currentUser:", auth);
    
    // function getVehicleInformation(element, collectionReference) {
    function getVehicleInformation(docReference) {
        fire.myOnSnapshot(docReference, (doc) => {
            // console.log("vehicleInformation", doc.data(), doc.id);
            let vehicleInformation = {...doc.data()};
            console.log("vehicleInformation:", vehicleInformation);
            let noQrCode = document.querySelector('.no-qr-code');
            let yesQRCode = document.querySelector('.yes-qr-code');


            console.log('keys length: ', Object.keys(vehicleInformation).length > 1);
            console.log('first data: ', Object.keys(vehicleInformation)[1]);
            console.log(Object.keys(vehicleInformation)[1]);

            if(Object.keys(vehicleInformation).length > 1) {
                let firstVehicleData = vehicleInformation[Object.keys(vehicleInformation)[1]];
                console.log('firstVehicleData: ', firstVehicleData);

                console.log('qrCode: ', firstVehicleData["qrCode"])
                console.log("modelVehicle:", firstVehicleData["model"][0]);
                console.log("plateNumber:", Object.keys(vehicleInformation)[1]);
                // console.log("vehicleImages:", vehicleInformation.registered_vehicle.vehicles.images[0]); // will be used later
                console.log("qrCode:", firstVehicleData.qrCode[0]); //default, vehicle #1 
    
                localStorage.setItem("vehicleInformation", JSON.stringify(vehicleInformation)); //store vehicle information
                localStorage.setItem("qrCodePlaceholder", JSON.stringify(firstVehicleData.qrCode[0]));
                saveQR.setAttribute("onclick", `downloadImage("${JSON.parse(localStorage.getItem("qrCodePlaceholder"))[0]}")`);
                myQRImage.setAttribute("src", JSON.parse(localStorage.getItem("qrCodePlaceholder"))[0]);
                myQRImage2.setAttribute("src", JSON.parse(localStorage.getItem("qrCodePlaceholder"))[0]);
                
    
                vehi = JSON.parse(localStorage.getItem("vehicleInformation"));
                console.log('vehicleInformation:', vehi);
                displayVehicleDropdownList(vehi);
                addEventsInList();

                yesQRCode.style.display = 'flex';
            }
            else {
                let qrCode = document.querySelectorAll('.qr-code');
                noQrCode.style.display = 'flex';
            }
        });
        
    }


    // Did we download the file?
    console.log("localStorage:", localStorage.getItem("qrCodePlaceholder"));
    if(localStorage.getItem("qrCodePlaceholder") === null || localStorage.getItem("vehicleInformation") === null) {  
        getVehicleInformation(docRefVehicle);
    }
    else {
        console.log("I did the else.")
        myQRImage.setAttribute("src", JSON.parse(localStorage.getItem("qrCodePlaceholder")));
        myQRImage2.setAttribute("src", JSON.parse(localStorage.getItem("qrCodePlaceholder")));
        saveQR.setAttribute("onclick", `downloadImage("${JSON.parse(localStorage.getItem("qrCodePlaceholder"))}")`);
        // console.log("vehicleInformation:", localStorage.getItem("vehicleInformation"));

        vehi = JSON.parse(localStorage.getItem("vehicleInformation"));
        console.log('vehicleInformation:', vehi);
        // displayVehicleDropdownList(vehi);
        displayVehicleDropdownList(vehi); //display the dropdown ul list, depend on number of vehicle
        addEventsInList();  //re-add the events

        // let noQrCode = document.querySelector('.no-qr-code');
        let yesQRCode = document.querySelector('.yes-qr-code');
        yesQRCode.style.display = 'flex';
    }

    function displayVehicleDropdownList(vehicle) {
        let listOfVehiclesTags = '';
        let vehicleListUL = document.getElementById("vehicle-list");
        let vehiclePlaceholder = document.getElementById("vehicle-placeholder");

        let vehicleDataKeys = Object.keys(JSON.parse(localStorage.getItem("vehicleInformation")));
        let vehicleData = JSON.parse(localStorage.getItem("vehicleInformation"));
        // let vehicleData = Object.keys(JSON.parse(vehicle));
        console.log('displayVehicleDropdownList');
        console.log('displayVehicleDropdownList : vehicleData', vehicleData);

        // console.log('qrCode: ', firstVehicleData["qrCode"])
        // console.log("modelVehicle:", firstVehicleData["model"][0]);

        // Object.keys(JSON.parse(localStorage.vehicleInformation)).length

        // console.log("QR Code:", vehicle.registered_vehicle.vehicles.qrCode);
        // console.log("Vehicle Images:", vehicle.registered_vehicle.vehicles.images);
        // console.log("Plate:", vehicle.registered_vehicle.plate);
        // console.log("Model:", vehicle.registered_vehicle.model);
        // console.log("User Types:", vehicle.registered_vehicle);
        // console.log("Length:", vehicle.vehicle_length);

        for (let x=0; x<vehicleDataKeys.length; x++) {
            if(vehicleDataKeys[x] !== "vehicle_length") {
                console.log('x:', vehicleDataKeys[x]);
                // <li>Vehicle #1 | Toyota Raize 2022, Private</li>
                //id="vehicle-list"
                //vehicle-placeholder
                listOfVehiclesTags += `<li>Vehicle ${x} | ${vehicleData[vehicleDataKeys[x]]["model"][0]}, ${vehicleData[vehicleDataKeys[x]]["use_types"]}</li>`
    
                if(x === 1) { //will be used for placeholder
                    console.log('placeholder');
                    vehiclePlaceholder.innerHTML =  `<p>Vehicle #1</p>
                    <p>${vehicleData[vehicleDataKeys[x]]["model"][0]}, ${vehicleData[vehicleDataKeys[x]]["use_types"]}</p>`;
    
                    // myQRImage.setAttribute("src", JSON.parse(localStorage.getItem("qrCodePlaceholder"))[x]);
                    // myQRImage2.setAttribute("src", JSON.parse(localStorage.getItem("qrCodePlaceholder"))[x]);
                    // saveQR.setAttribute("onclick", `downloadImage("${JSON.parse(localStorage.getItem("qrCodePlaceholder"))[x]}")`);
                }
            }
        } //end of iteration
        vehicleListUL.innerHTML = listOfVehiclesTags;
        return;
    }  //end of displayVehicleDropdownList

    //     vehicleListUL.innerHTML = listOfVehiclesTags;
    //     return;
    // }

    function addEventsInList() {
        let dropdown = document.querySelector('.qr-code-dropdown-clickable');
        let popup = document.querySelector('.popup-dropdown');
        let buttons = document.querySelectorAll('.qr-code .qr-code-common-actions > button');
        let getQRCodeImage = document.querySelector("qr-code-image img");
        let myDropdown = document.querySelector('.popup-dropdown');
        let myLists = document.querySelectorAll('#vehicle-list > li');
        let bool = true;
    
        if(myDropdown !== null && myDropdown !== undefined) {
            let vehiclePlaceholder = document.getElementById("vehicle-placeholder");
            myLists.forEach((element, index) => {
                element.addEventListener('click', (e) => {
                    // console.log('mydropselected:', e.target);
                    popup.style.display = "none";
                    
                    vehiclePlaceholder.innerHTML =  `<p>Vehicle #${index+1}</p>
                    <p>${vehi.registered_vehicle.model[index]}, ${vehi.registered_vehicle.use_types[index]}</p>`;
                    
                    myQRImage.setAttribute("src", JSON.parse(localStorage.getItem("qrCodePlaceholder"))[index]);
                    myQRImage2.setAttribute("src", JSON.parse(localStorage.getItem("qrCodePlaceholder"))[index]);
                    saveQR.setAttribute("onclick", `downloadImage("${JSON.parse(localStorage.getItem("qrCodePlaceholder"))[index]}")`);
                    
                    buttons.forEach((btn) => {
                        btn.style.pointerEvents = "auto";
                    });
                    bool = !bool;
                });
            });
        }


        dropdown.addEventListener('click', () => {
            // console.log('clicked.', bool)
            if(bool) {
                popup.style.display = "block";
                
                buttons.forEach((btn) => {
                    btn.style.pointerEvents = "none";
                });
            }
            else {
                popup.style.display = "none";
        
                buttons.forEach((btn) => {
                    btn.style.pointerEvents = "auto";
                });
            }
            bool = !bool;
        });
    }
    

    let logoutUser = document.querySelector('.util-icon-logout');
    logoutUser.addEventListener('click', () => {
        console.log("this is a test.");
        localStorage.clear();
        fire.logoutUser();
        // window.location = '../login.html';
        window.location = '../index.html';
    });

    // document.querySelector('.fullname').innerText = localStorage.personal_info_name === '' ? '' : localStorage.personal_info_name;
    // document.querySelector('.category').innerText = 
    //     localStorage.user_type === '' || localStorage.user_type === undefined || localStorage.user_type === null
    //      ? '' : localStorage.personal_info_name;

}