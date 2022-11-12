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
                const vehicleKeysLength = Object.keys(vehicleInformation).length;
                for(let index=0; index<vehicleKeysLength; index++) {
                    // console.log('keys: ', Object.keys(vehicleInformation)[index]);
                    let currentKeyIteration = Object.keys(vehicleInformation)[index];
                    if("vehicle_length" !== Object.keys(vehicleInformation)[index]) {
                        // console.log("MyCurrentKey:", currentKeyIteration);
                        console.log('MyfirstVehicleData: ', vehicleInformation[currentKeyIteration]);
                        console.log('qrCode: ', vehicleInformation[currentKeyIteration]["qrCode"][0])
                        console.log("modelVehicle:", vehicleInformation[currentKeyIteration]["model"][0]);

                        localStorage.setItem("vehicleInformation", JSON.stringify(vehicleInformation)); //store vehicle information
                        localStorage.setItem("qrCodePlaceholder", JSON.stringify(vehicleInformation[currentKeyIteration]["qrCode"][0]));

                        const qrCodeImageLink =  vehicleInformation[currentKeyIteration]["qrCode"];
                        saveQR.setAttribute("onclick", `downloadImage("${qrCodeImageLink}")`);
                        myQRImage.setAttribute("src", qrCodeImageLink);
                        myQRImage2.setAttribute("src", qrCodeImageLink);
            
                        vehi = JSON.parse(localStorage.getItem("vehicleInformation"));
                        console.log('vehicleInformation:', vehi);
                        displayVehicleDropdownList();
                        displayLinkagesDropdownList();
                        addEventsInList();

                        yesQRCode.style.display = 'flex';
                        break;
                    } //end of if statement, internal
                } //end of for loop
            } //end of if statement
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
        displayLinkagesDropdownList();
        addEventsInList(vehi);  //re-add the events

        // let noQrCode = document.querySelector('.no-qr-code');
        let yesQRCode = document.querySelector('.yes-qr-code');
        yesQRCode.style.display = 'flex';
    }

    function displayVehicleDropdownList() {
        let listOfVehiclesTags = '';
        let vehicleListUL = document.getElementById("vehicle-list");
        let vehiclePlaceholder = document.getElementById("vehicle-placeholder");

        let vehicleDataKeys = Object.keys(JSON.parse(localStorage.getItem("vehicleInformation")));
        let vehicleData = JSON.parse(localStorage.getItem("vehicleInformation"));
        // let vehicleData = Object.keys(JSON.parse(vehicle));
        console.log('displayVehicleDropdownList');
        console.log('displayVehicleDropdownList : vehicleData', vehicleData);

        for (let x=0; x<vehicleDataKeys.length; x++) {
            if(vehicleDataKeys[x] !== "vehicle_length") {
                console.log('x:', vehicleDataKeys[x]);
                // <li>Vehicle #1 | Toyota Raize 2022, Private</li>
                //id="vehicle-list"
                //vehicle-placeholder
                listOfVehiclesTags += `<li data-key="${vehicleDataKeys[x]}">Vehicle ${x} | ${vehicleData[vehicleDataKeys[x]]["model"][0]}, ${vehicleData[vehicleDataKeys[x]]["use_types"]}</li>`
                
                if(x === 1) { //will be used for placeholder
                    console.log('placeholder');
                    vehiclePlaceholder.innerHTML =  `<p>Vehicle #1</p>
                    <p>${vehicleData[vehicleDataKeys[x]]["model"][0]}, ${vehicleData[vehicleDataKeys[x]]["use_types"]}</p>`;
                    
                    const qrCodeImageLink = vehicleData[vehicleDataKeys[x]]["qrCode"];
                    myQRImage.setAttribute("src", qrCodeImageLink);
                    myQRImage2.setAttribute("src", qrCodeImageLink);
                    saveQR.setAttribute("onclick", `downloadImage("${qrCodeImageLink}")`);
                }
            }
        } //end of iteration
        vehicleListUL.innerHTML = listOfVehiclesTags;
        return;
    }  //end of displayVehicleDropdownList

    function displayLinkagesDropdownList() {
        console.log("displayLinkagesDropdownList")

        const docRef = fire.myDoc(fire.db, "linkages", "mWzeSivijSUBGM7Goyxx5YHcZgz1");
        fire.myOnSnapshot(docRef, async (doc) => {
            // console.log("linkages", doc.data(), doc.id);
            let linkagesList = {...doc.data()};

            localStorage.setItem("linkages", linkagesList);
            let listLinkagesKeys = Object.keys(linkagesList);

            // let listOfLinkagesData = [];
            console.log('linkagesList', linkagesList, Object.keys(linkagesList).length);
            
            if(!doc.exists()) {
                console.log('There are no linked vehicle data.')
            }
            else {
                if(Object.keys(linkagesList).length) {
                    listLinkagesKeys.forEach(async (data, index) => {
                        
                        console.log('looping: ', linkagesList[data], index)

                        const node = document.createElement('li');
                        const attr = document.createAttribute('data-key');
                        const attr2 = document.createAttribute('data-linkages');
                        attr.value = data;
                        attr2.value = '';
                        node.setAttributeNode(attr);
                        node.setAttributeNode(attr2);

                        const textNode = document.createTextNode(`V-Linked #${index+1} | ${'VEHICLE_MODEL'} - ${data}, Shared
                        Owner: ${"name here..."}`);
                        node.appendChild(textNode);
                        node.addEventListener('click', () => {
                            console.log('linkages clicked: ', linkagesList);
                            console.log(linkagesList[data].qr);

                            myQRImage.setAttribute("src", linkagesList[data].qr);
                            myQRImage2.setAttribute("src", linkagesList[data].qr);
                            saveQR.setAttribute("onclick", `downloadImage("${linkagesList[data].qr}")`);
                        });

                        document.querySelector('#vehicle-list').appendChild(node);
                    });
                }
            }
        });
    }

    function addEventsInList(vehicleData) {
        let dropdown = document.querySelector('.qr-code-dropdown-clickable');
        let popup = document.querySelector('.popup-dropdown');
        let buttons = document.querySelectorAll('.qr-code .qr-code-common-actions > button');
        let getQRCodeImage = document.querySelector("qr-code-image img");
        let myDropdown = document.querySelector('.popup-dropdown');
        let myLists = document.querySelectorAll('#vehicle-list > li');
        let bool = true;
        

        // console.log('addEventsInList vehicle', vehicle)
        // Events in List
        if(myDropdown !== null && myDropdown !== undefined) {
            let vehiclePlaceholder = document.getElementById("vehicle-placeholder");
            myLists.forEach((element, index) => {
                element.addEventListener('click', (e) => {
                    // console.log('mydropselected:', e.target);

                    if(element.hasAttribute('data-linkages')) {
                        console.log('data-linkages');
                    }

                    const selectedDataKey = element.getAttribute("data-key");
                    console.log('list element', element.getAttribute("data-key"), index);
                    popup.style.display = "none";
                    
                    // vehiclePlaceholder.innerHTML =  `<p>Vehicle #${index+1}</p>
                    // <p>${vehi.registered_vehicle.model[index]}, ${vehi.registered_vehicle.use_types[index]}</p>`;

                    console.log('selectedDataKey: ', selectedDataKey)
                    console.log('vehicleData', vehicleData);
                    console.log('selectedDataKey w/ data', vehicleData[selectedDataKey])
                    vehiclePlaceholder.innerHTML = `<p>Vehicle #${index+1}</p>
                    ${vehicleData[selectedDataKey]["model"][0]}, ${vehicleData[selectedDataKey]["use_types"]}`;

                    console.log('selectedDataKey: ', selectedDataKey)
                    console.log('qrCodeImageLink: ', vehicleData)
                    const qrCodeImageLink = vehicleData[selectedDataKey]["qrCode"];
                    myQRImage.setAttribute("src", qrCodeImageLink);
                    myQRImage2.setAttribute("src", qrCodeImageLink);
                    saveQR.setAttribute("onclick", `downloadImage("${qrCodeImageLink}")`);
                    
                    buttons.forEach((btn) => {
                        btn.style.pointerEvents = "auto";
                    });
                    bool = !bool;
                });
            });
        }

        // Fixes need in non-refreshed list
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