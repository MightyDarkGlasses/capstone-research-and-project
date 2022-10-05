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
    // function getVehicleInformation(element, collectionReference) {
    function getVehicleInformation(docReference) {
        fire.myOnSnapshot(docReference, (doc) => {
            // console.log("vehicleInformation", doc.data(), doc.id);
            let vehicleInformation = {...doc.data()};
            // console.log("vehicleInformation:", vehicleInformation);

            console.log("modelVehicle:", vehicleInformation.registered_vehicle.model[0]);
            console.log("plateNumber:", vehicleInformation.registered_vehicle.plate[0]);
            // console.log("vehicleImages:", vehicleInformation.registered_vehicle.vehicles.images[0]); // will be used later
            console.log("qrCode:", vehicleInformation.registered_vehicle.vehicles.qrCode[0]); //default, vehicle #1 

            localStorage.setItem("vehicleInformation", JSON.stringify(vehicleInformation)); //store vehicle information
            localStorage.setItem("qrCodePlaceholder", JSON.stringify(vehicleInformation.registered_vehicle.vehicles.qrCode));
            saveQR.setAttribute("onclick", `downloadImage("${JSON.parse(localStorage.getItem("qrCodePlaceholder"))[0]}")`);
            myQRImage.setAttribute("src", JSON.parse(localStorage.getItem("qrCodePlaceholder"))[0]);
            myQRImage2.setAttribute("src", JSON.parse(localStorage.getItem("qrCodePlaceholder"))[0]);


            vehi = JSON.parse(localStorage.getItem("vehicleInformation"));
            console.log('vehicleInformation:', vehi);
            displayVehicleDropdownList(vehi);
            addEventsInList();
        });
        
    }


    // Did we download the file?
    console.log("localStorage:", localStorage.getItem("qrCodePlaceholder"));
    if(localStorage.getItem("qrCodePlaceholder") === null || localStorage.getItem("vehicleInformation") === null) {  
        getVehicleInformation(docRefVehicle);
    }
    else {
        console.log("I did the else.")
        myQRImage.setAttribute("src", JSON.parse(localStorage.getItem("qrCodePlaceholder"))[0]);
        myQRImage2.setAttribute("src", JSON.parse(localStorage.getItem("qrCodePlaceholder"))[0]);
        saveQR.setAttribute("onclick", `downloadImage("${JSON.parse(localStorage.getItem("qrCodePlaceholder"))[0]}")`);
        // console.log("vehicleInformation:", localStorage.getItem("vehicleInformation"));

        vehi = JSON.parse(localStorage.getItem("vehicleInformation"));
        console.log('vehicleInformation:', vehi);
        // displayVehicleDropdownList(vehi);
        displayVehicleDropdownList(vehi); //display the dropdown ul list, depend on number of vehicle
        addEventsInList();  //re-add the events
    }

    function displayVehicleDropdownList(vehicle) {
        let listOfVehiclesTags = '';
        let vehicleListUL = document.getElementById("vehicle-list");
        let vehiclePlaceholder = document.getElementById("vehicle-placeholder");

        console.log("QR Code:", vehicle.registered_vehicle.vehicles.qrCode);
        console.log("Vehicle Images:", vehicle.registered_vehicle.vehicles.images);
        console.log("Plate:", vehicle.registered_vehicle.plate);
        console.log("Model:", vehicle.registered_vehicle.model);
        console.log("User Types:", vehicle.registered_vehicle.use_types);
        console.log("Length:", vehicle.vehicle_length);
        for (let x=0; x<vehicle.vehicle_length; x++) {
            console.log('x:', x);

            // <li>Vehicle #1 | Toyota Raize 2022, Private</li>
            //id="vehicle-list"
            //vehicle-placeholder
            listOfVehiclesTags += `<li>Vehicle ${x+1} | ${vehicle.registered_vehicle.model[x]}, ${vehicle.registered_vehicle.use_types[x]}</li>`

            if(x === 0) { //will be used for placeholder
                vehiclePlaceholder.innerHTML =  `<p>Vehicle #1</p>
                <p>${vehicle.registered_vehicle.model[x]}, ${vehicle.registered_vehicle.use_types[x]}</p>`;

                myQRImage.setAttribute("src", JSON.parse(localStorage.getItem("qrCodePlaceholder"))[x]);
                myQRImage2.setAttribute("src", JSON.parse(localStorage.getItem("qrCodePlaceholder"))[x]);
                saveQR.setAttribute("onclick", `downloadImage("${JSON.parse(localStorage.getItem("qrCodePlaceholder"))[x]}")`);
            }
        }

        vehicleListUL.innerHTML = listOfVehiclesTags;

        
        return;
    }

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
    }
    

    let logoutUser = document.querySelector('.util-icon-logout');
    logoutUser.addEventListener('click', () => {
        console.log("this is a test.");
        localStorage.clear();
        window.location = '../login.html';
    });
    
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


    function changeCardInformation() {

    }
}