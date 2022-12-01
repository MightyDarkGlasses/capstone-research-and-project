import * as fire from "../src/index";


let windowLocation = window.location.pathname;
let qrCodes = {};
let vehicleInformation = [];

if(windowLocation.indexOf("user-home") > -1) {

// Change theme
if(localStorage.getItem("theme") === "light") {
    document.querySelector("#system-theme1").setAttribute("href", "user-home-light.css");
    document.querySelector("#system-theme2").setAttribute("href", "user-home-mods-light.css");
}

document.addEventListener('DOMContentLoaded', function() {
    // ##### Delete User
    // fire.getOnAuthStateChanged(fire.auth, (user) => {
    //     if (user) {
    //         // fire.deleteUserData("Vut59fOZ1TflIsqbWgkgEzu2phN2");
    //     }
    // });


    // ### Display dropdown list of vehicles and linkages
    fire.getOnAuthStateChanged(fire.auth, (user) => {
        if (user) {
            // Display user profile picture.
            // console.log("Current authenticated user: ", user.uid);


            console.log("profile-picture: ", localStorage.getItem("profile-picture") );
            if((localStorage.getItem("profile-picture") === null 
            || localStorage.getItem("profile-category") === null
            || localStorage.getItem("profile-owner") === null)) {
                // console.log("false...");

                localStorage.setItem("theme", "dark");
                const profilePicture = displayProfile(user.uid).then(evt => { 
                    console.log("current user: ", fire.auth.currentUser);
                    console.log('current user uid: ', fire.auth.currentUser.uid);
                    console.log('evt.profilePicture: ', evt);
    
                    if(fire.auth.currentUser.photoURL !== null) {
                        document.querySelector("#profile-picture").setAttribute('src', fire.auth.currentUser.photoURL);
                        localStorage.setItem("profile-picture", fire.auth.currentUser.photoURL);
                    }
                    else {
                        document.querySelector("#profile-picture").setAttribute('src', "bulsu-logo.png");
                        localStorage.setItem("profile-picture", "bulsu-logo.png");
                    }
    
                    // Set the fullname
                    document.querySelector(".fullname").textContent = evt[0];
                    localStorage.setItem("profile-owner", evt[0]);
    
                    // Set the position of user. (NAP or Faculty)
                    if(typeof(evt[1]) !== "undefined" || evt[1] !== null) {
                        document.querySelector(".category").textContent = evt[1];
                        localStorage.setItem("profile-category", evt[1]);
                    }
                    else {
                        document.querySelector(".category").textContent = "-";
                        localStorage.setItem("profile-category", "-");
                    }
                });
            }
            else {
                document.querySelector("#profile-picture").setAttribute("src", localStorage.getItem("profile-picture"));
                document.querySelector(".fullname").textContent = localStorage.getItem("profile-owner");
                document.querySelector(".category").textContent = localStorage.getItem("profile-category");
            }
            
            // fire.deleteUserData("Vut59fOZ1TflIsqbWgkgEzu2phN2");
            

            // Did we download the file?
            // console.log("localStorage:", localStorage.getItem("qrCodePlaceholder"));
            if(localStorage.getItem("qrCodePlaceholder") === null || localStorage.getItem("vehicleInformation") === null) {  
                getVehicleInformation(docRefVehicle);
            }
            else {
                // console.log("I did the else.")

                if(JSON.parse(localStorage.getItem("qrCodePlaceholder")) === "h") {
                    myQRImage.setAttribute("src", "bulsu-logo.png");
                    myQRImage2.setAttribute("src", JSON.parse(localStorage.getItem("qrCodePlaceholder")));
                }
                else {
                    myQRImage.setAttribute("src", JSON.parse(localStorage.getItem("qrCodePlaceholder")));
                    myQRImage2.setAttribute("src", JSON.parse(localStorage.getItem("qrCodePlaceholder")));
                    saveQR.setAttribute("onclick", `downloadImage("${JSON.parse(localStorage.getItem("qrCodePlaceholder"))}")`);
                }

                // console.log("vehicleInformation:", localStorage.getItem("vehicleInformation"));

                vehi = JSON.parse(localStorage.getItem("vehicleInformation"));
                // console.log('vehicleInformation:', vehi);
                // displayVehicleDropdownList(vehi);
                displayVehicleDropdownList(vehi); //display the dropdown ul list, depend on number of vehicle
                displayLinkagesDropdownList(fire.auth.currentUser.uid);
                addEventsInList(vehi);  //re-add the events

                // let noQrCode = document.querySelector('.no-qr-code');
                let yesQRCode = document.querySelector('.yes-qr-code');
                yesQRCode.style.display = 'flex';
            }
        }
        else {
            window.location = "../login.html";
        }
    });




    async function displayProfile(userUID) {
        const docAccountActivity = fire.myDoc(fire.db, "account-information", userUID);
        const docVSnap = await fire.myGetDoc(docAccountActivity);
        if (docVSnap.exists()) {
            const position = docVSnap.data()["category"];

            console.log("position: ", position);
            console.log("position: ", typeof(position) !== "undefined" || position !== null);
            if(typeof(position) !== "undefined" || position !== null) {
                return [`${docVSnap.data()['last_name']}, ${docVSnap.data()['first_name']}`, position];
            }
        }
        return [`${docVSnap.data()['last_name']}, ${docVSnap.data()['first_name']}`, null];
    }

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

    // function getVehicleInformation(element, collectionReference) {
    function getVehicleInformation(docReference) {
        fire.myOnSnapshot(docReference, (doc) => {
            // console.log("vehicleInformation", doc.data(), doc.id);
            let vehicleInformation = {...doc.data()};
            // console.log("vehicleInformation:", vehicleInformation);
            let noQrCode = document.querySelector('.no-qr-code');
            let yesQRCode = document.querySelector('.yes-qr-code');


            // console.log('keys length: ', Object.keys(vehicleInformation).length > 1);
            // console.log('first data: ', Object.keys(vehicleInformation)[1]);
            // console.log(Object.keys(vehicleInformation)[1]);

            if(Object.keys(vehicleInformation).length > 1) {
                const vehicleKeysLength = Object.keys(vehicleInformation).length;
                for(let index=0; index<vehicleKeysLength; index++) {
                    // console.log('keys: ', Object.keys(vehicleInformation)[index]);
                    let currentKeyIteration = Object.keys(vehicleInformation)[index];
                    if("vehicle_length" !== Object.keys(vehicleInformation)[index]) {
                        // console.log("MyCurrentKey:", currentKeyIteration);
                        // console.log('MyfirstVehicleData: ', vehicleInformation[currentKeyIteration]);
                        // console.log('qrCode: ', vehicleInformation[currentKeyIteration]["qrCode"][0])
                        // console.log("modelVehicle:", vehicleInformation[currentKeyIteration]["model"][0]);

                        localStorage.setItem("vehicleInformation", JSON.stringify(vehicleInformation)); //store vehicle information
                        localStorage.setItem("qrCodePlaceholder", JSON.stringify(vehicleInformation[currentKeyIteration]["qrCode"][0]));

                        const qrCodeImageLink =  vehicleInformation[currentKeyIteration]["qrCode"];
                        saveQR.setAttribute("onclick", `downloadImage("${qrCodeImageLink}")`);
                        myQRImage.setAttribute("src", qrCodeImageLink);
                        myQRImage2.setAttribute("src", qrCodeImageLink);
            
                        // vehi = JSON.parse(localStorage.getItem("vehicleInformation"));
                        // console.log('vehicleInformation:', vehi);
                        displayVehicleDropdownList();
                        displayLinkagesDropdownList(fire.auth.currentUser.uid);
                        addEventsInList(vehicleInformation);

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
    // getVehicleInformation(docRefVehicle);



    // Notification, Full Screen, Logout, etc.
    function topButtons() {        
        const notif = document.querySelector(".util-icon-notif");
        const themes = document.querySelector(".util-icon-theme");
        const fullScreen = document.querySelector(".util-icon-fullscr");
        const settings = document.querySelector(".util-icon-settings");
        const logout = document.querySelector(".util-icon-logout");
        const elem = document.querySelector("html");

        fullScreen.addEventListener("click", () => {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
            }
        });

        themes.addEventListener("click", () => {
            if(localStorage.getItem("theme") === "dark") {
                document.querySelector("#system-theme1").setAttribute("href", "user-home-light.css");
                document.querySelector("#system-theme2").setAttribute("href", "user-home-mods-light.css");
                localStorage.setItem("theme", "light");
            }
            else {
                document.querySelector("#system-theme1").setAttribute("href", "user-home.css");
                document.querySelector("#system-theme2").setAttribute("href", "user-home-mods.css");
                localStorage.setItem("theme", "dark");
            }
        });

        logout.addEventListener('click', () => {
            // console.log("this is a test.");
            // Add activity when user is logged out.
            fire.addActivity(fire.auth.currentUser.uid, fire.listOfUserLevels[0], fire.listOfPages["auth_login"], fire.listOfActivityContext["user_logout"])
            .then((success) => {
                fire.logoutUser();
                localStorage.clear();
                window.location = '../login.html';
            });
        });
    }
    topButtons();

    function displayVehicleDropdownList() {
        let listOfVehiclesTags = '';
        let vehicleListUL = document.getElementById("vehicle-list");
        let vehiclePlaceholder = document.getElementById("vehicle-placeholder");

        let vehicleDataKeys = Object.keys(JSON.parse(localStorage.getItem("vehicleInformation")));
        let vehicleData = JSON.parse(localStorage.getItem("vehicleInformation"));
        // let vehicleData = Object.keys(JSON.parse(vehicle));
        // console.log('displayVehicleDropdownList');
        // console.log('displayVehicleDropdownList : vehicleData', vehicleData);

        let counter = 1;
        for (let x=0; x<vehicleDataKeys.length; x++) {
            if(vehicleDataKeys[x] !== "vehicle_length") {
                // console.log('x:', vehicleDataKeys[x]);
                // <li>Vehicle #1 | Toyota Raize 2022, Private</li>
                //id="vehicle-list"
                //vehicle-placeholder
                console.log('vehicleData: ', vehicleData);
                console.log('keys: ', vehicleDataKeys[x], 'vehicleData model: ', vehicleData[vehicleDataKeys[x]]["model"]);
                listOfVehiclesTags += `<li data-key="${vehicleDataKeys[x]}">Vehicle ${counter} | ${vehicleData[vehicleDataKeys[x]]["model"]}, ${vehicleData[vehicleDataKeys[x]]["use_types"]}</li>`
                counter += 1;
                if(x === 1) { //will be used for placeholder
                    vehiclePlaceholder.innerHTML =  `<p>Vehicle #1</p>
                    <p>${vehicleData[vehicleDataKeys[x]]["model"][0]}, ${vehicleData[vehicleDataKeys[x]]["use_types"]}</p>`;
                    
                    const qrCodeImageLink = vehicleData[vehicleDataKeys[x]]["qrCode"];
                    myQRImage.setAttribute("src", qrCodeImageLink);
                    myQRImage2.setAttribute("src", qrCodeImageLink);
                    saveQR.setAttribute("onclick", `downloadImage("${qrCodeImageLink}")`);
                }
                else {
                    vehiclePlaceholder.innerHTML =  `<p style="font-size: 1em;">Click the dropdown.</p>`;
                    myQRImage.setAttribute("src", "bulsu-logo.png");
                    myQRImage2.setAttribute("src", "bulsu-logo.png");
                    saveQR.setAttribute("onclick", ``);
                }
            }
        } //end of iteration
        vehicleListUL.innerHTML = listOfVehiclesTags;
        return;
    }  //end of displayVehicleDropdownList

    var bool = true;
    function displayLinkagesDropdownList(userUID) {
        // userUID = 'mWzeSivijSUBGM7Goyxx5YHcZgz1';
        console.log("displayLinkagesDropdownList");

        let dropdown = document.querySelector('.qr-code-dropdown-clickable');
        let popup = document.querySelector('.popup-dropdown');
        let buttons = document.querySelectorAll('.qr-code .qr-code-common-actions > button');
        let getQRCodeImage = document.querySelector("qr-code-image img");
        let myDropdown = document.querySelector('.popup-dropdown');
        let myLists = document.querySelectorAll('#vehicle-list > li');
        // console.log("displayLinkagesDropdownList")
        
        const docRef = fire.myDoc(fire.db, "linkages", userUID);
        // const docRef = fire.myDoc(fire.db, "linkages", userUID);

        fire.myOnSnapshot(docRef, async (doc) => {
            // console.log("linkages", doc.data(), doc.id);
            let linkagesList = {...doc.data()};

            localStorage.setItem("linkages", linkagesList);
            let listLinkagesKeys = Object.keys(linkagesList);

            // let listOfLinkagesData = [];
            // console.log('linkagesList', linkagesList, Object.keys(linkagesList).length);
            
            if(!doc.exists()) {
                console.log('There are no linked vehicle data.');
            }
            else {
                if(Object.keys(linkagesList).length) {
                    listLinkagesKeys.forEach(async (data, index) => {
                        
                        let ownerFullName = undefined;
                        let ownerVehicleModel = undefined;
                        await getAccountInformationOwner(linkagesList[data]["orig_uid"]).then(evt => {
                            // console.log('event: ', evt)
                            ownerFullName = `${evt['last_name']} ${evt['first_name']}`;
                        });
                        await getVehicleInformationModel(linkagesList[data]["orig_uid"]).then(evt => {
                            console.log('event: ', evt, data)
                            ownerVehicleModel = evt[data]['model'][0];
                        });

                        // console.log('looping: ', linkagesList[data], index)
                        console.log('linked index: ', doc.id)
                        const node = document.createElement('li');
                        const attr = document.createAttribute('data-key');
                        const attr2 = document.createAttribute('data-linkages');
                        attr.value = data;
                        attr2.value = '';
                        node.setAttributeNode(attr);
                        node.setAttributeNode(attr2);

                        const textNode = document.createTextNode(`Linkages #${index+1} | ${ownerVehicleModel} - ${data}, Shared Owner: ${ownerFullName}`);
                        node.appendChild(textNode);
                        node.addEventListener('click', () => {
                            // console.log('linkages clicked: ', linkagesList);
                            // console.log(linkagesList[data].qr);

                            console.log("linkages: ", linkagesList[data].qr);

                            myQRImage.setAttribute("src", linkagesList[data].qr);
                            myQRImage2.setAttribute("src", linkagesList[data].qr);
                            saveQR.setAttribute("onclick", `downloadImage("${linkagesList[data].qr}")`);
                        });

                        document.querySelector('#vehicle-list').appendChild(node);
                    });
                }
            }
        }); //end of snapshot
    } // end of function

    async function getAccountInformationOwner(userUID) {
        let vehicle = undefined;
        const docVehicleActivity = fire.myDoc(fire.db, "account-information", userUID);
        const docVSnap = await fire.myGetDoc(docVehicleActivity);
        if (docVSnap.exists()) {
            return {...docVSnap.data()};
        }
        else {
            vehicle = "N/A";
        }
        return vehicle;
    }
    async function getVehicleInformationModel(userUID) {
        let vehicle = undefined;
        const docVehicleActivity = fire.myDoc(fire.db, "vehicle-information", userUID);
        const docVSnap = await fire.myGetDoc(docVehicleActivity);
        if (docVSnap.exists()) {
            return {...docVSnap.data()};
        }
        else {
            vehicle = "N/A";
        }
        return vehicle;
    }

    // Fixes need in non-refreshed list
    // document.querySelectorAll('#vehicle-list > li').forEach((e) => {
    //     e.addEventListener('click', () => {
    //         // console.log('clicked.', bool)
    //         if(bool) {
    //             document.querySelector('.popup-dropdown').style.display = "block";
                
    //             buttons.forEach((btn) => {
    //                 btn.style.pointerEvents = "none";
    //             });
    //         }
    //         else {
    //             document.querySelector('.popup-dropdown').style.display = "none";
        
    //             buttons.forEach((btn) => {
    //                 btn.style.pointerEvents = "auto";
    //             });
    //         }
    //         bool = !bool;
    //     });
    // });

    function addEventsInList(vehicleData) {
        let dropdown = document.querySelector('.qr-code-dropdown-clickable');
        let popup = document.querySelector('.popup-dropdown');
        let buttons = document.querySelectorAll('.qr-code .qr-code-common-actions > button');
        let getQRCodeImage = document.querySelector("qr-code-image img");
        let myDropdown = document.querySelector('.popup-dropdown');
        let myLists = document.querySelectorAll('#vehicle-list > li');
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

                    // console.log('selectedDataKey: ', selectedDataKey)
                    // console.log('vehicleData', vehicleData);
                    // console.log('selectedDataKey w/ data', vehicleData[selectedDataKey])



                    
                    vehiclePlaceholder.innerHTML = `<p>Vehicle #${index+1}</p>
                    ${vehicleData[selectedDataKey]["model"][0]}, ${vehicleData[selectedDataKey]["use_types"]}`;

                    // console.log('selectedDataKey: ', selectedDataKey)
                    // console.log('qrCodeImageLink: ', vehicleData)
                    const qrCodeImageLink = vehicleData[selectedDataKey]["qrCode"];
                    myQRImage.setAttribute("src", qrCodeImageLink);
                    myQRImage2.setAttribute("src", qrCodeImageLink);
                    saveQR.setAttribute("onclick", `downloadImage("${qrCodeImageLink}")`);
                    
                    
                });
            });

            buttons.forEach((btn) => {
                btn.style.pointerEvents = "auto";
            });
            bool = !bool;
        }

        // Fixes need in non-refreshed list
        dropdown.addEventListener('click', () => {
            
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
    

    

    // document.querySelector('.fullname').innerText = localStorage.personal_info_name === '' ? '' : localStorage.personal_info_name;
    // document.querySelector('.category').innerText = 
    //     localStorage.user_type === '' || localStorage.user_type === undefined || localStorage.user_type === null
    //      ? '' : localStorage.personal_info_name;
});

}